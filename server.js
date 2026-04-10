import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { DefaultAzureCredential } from '@azure/identity'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/run', async (req, res) => {
    try {
        const { endpoint, payload } = req.body

        if (!endpoint || !payload) {
            return res.status(400).json({
                error: 'Missing endpoint or payload',
                details: 'Request must include both "endpoint" and "payload" fields'
            })
        }

        const apiKey = process.env.FOUNDRY_API_KEY

        if (!apiKey) {
            return res.status(500).json({
                error: 'FOUNDRY_API_KEY not configured on server',
                recommendation: 'Set FOUNDRY_API_KEY environment variable before starting the server'
            })
        }

        console.log('[Foundry Proxy] Calling endpoint:', endpoint.substring(0, 60) + '...')

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
                'Ocp-Apim-Subscription-Key': apiKey
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('[Foundry Proxy] Error response:', response.status, data)
            return res.status(response.status).json({
                error: data.error || 'Foundry API error',
                details: data,
                status: response.status
            })
        }

        console.log('[Foundry Proxy] Success:', response.status)
        res.json(data)
    } catch (error) {
        console.error('[Foundry Proxy] Exception:', error)
        res.status(500).json({
            error: error.message || 'Internal server error',
            type: error.name || 'UnknownError'
        })
    }
})

// --------------- Foundry Chat (SSE streaming) ---------------

const WORKFLOW_NAME = 'campaign-orchestration-flow'
const TOKEN_SCOPE = 'https://ai.azure.com/.default'

const credential = new DefaultAzureCredential()

/** Get a bearer token for Azure AI services */
async function getBearerToken() {
    const token = await credential.getToken(TOKEN_SCOPE)
    return token.token
}

/**
 * POST /api/chat
 * Body: { message: string, conversationId?: string }
 * Response: SSE stream with events: delta, workflow, done, error
 */
app.post('/api/chat', async (req, res) => {
    console.log('[Chat] === Request received ===')
    const projectEndpoint = process.env.AZURE_AI_PROJECT_ENDPOINT
    if (!projectEndpoint) {
        return res.status(500).json({ error: 'AZURE_AI_PROJECT_ENDPOINT not configured' })
    }

    const { message, conversationId: incomingConvId } = req.body
    if (!message) {
        return res.status(400).json({ error: 'Missing "message" field' })
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders()

    let conversationId = incomingConvId
    let token

    try {
        token = await getBearerToken()
    } catch (err) {
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Azure auth failed: ' + err.message })}\n\n`)
        return res.end()
    }

    const baseUrl = projectEndpoint.replace(/\/+$/, '')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    try {
        // 1) Create conversation if none provided
        if (!conversationId) {
            const convUrl = `${baseUrl}/openai/v1/conversations`
            console.log('[Chat] Creating conversation at:', convUrl)
            const convRes = await fetch(convUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({}),
            })
            if (!convRes.ok) {
                const errText = await convRes.text()
                console.error('[Chat] Create conversation failed:', convRes.status, errText)
                res.write(`event: error\ndata: ${JSON.stringify({ error: `Create conversation failed (${convRes.status}): ${errText}` })}\n\n`)
                return res.end()
            }
            const convData = await convRes.json()
            conversationId = convData.id
            console.log('[Chat] Created conversation:', conversationId)
        }

        // 2) Send message with streaming via responses endpoint
        const responsesUrl = `${baseUrl}/openai/v1/responses`
        const body = {
            conversation: conversationId,
            input: message,
            stream: true,
            agent_reference: {
                name: WORKFLOW_NAME,
                type: 'agent_reference',
            },
            metadata: { 'x-ms-debug-mode-enabled': '1' },
        }

        console.log('[Chat] Streaming response for conversation:', conversationId)

        const streamRes = await fetch(responsesUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        if (!streamRes.ok) {
            const errText = await streamRes.text()
            res.write(`event: error\ndata: ${JSON.stringify({ error: `Responses API failed (${streamRes.status}): ${errText}` })}\n\n`)
            return res.end()
        }

        // 3) Parse SSE from Foundry and forward to client
        const reader = streamRes.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() // keep incomplete line in buffer

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue
                const dataStr = line.slice(6).trim()
                if (dataStr === '[DONE]') continue

                let event
                try {
                    event = JSON.parse(dataStr)
                } catch {
                    continue
                }

                const eventType = event.type

                // Text delta - forward incrementally
                if (eventType === 'response.output_text.delta') {
                    res.write(`event: delta\ndata: ${JSON.stringify({ text: event.delta, conversationId })}\n\n`)
                }
                // Text done
                else if (eventType === 'response.output_text.done') {
                    res.write(`event: text_done\ndata: ${JSON.stringify({ conversationId })}\n\n`)
                }
                // Workflow action start
                else if (eventType === 'response.output_item.added' && event.item?.type === 'workflow_action') {
                    res.write(`event: workflow\ndata: ${JSON.stringify({ action: event.item.action_id, status: event.item.status, phase: 'start' })}\n\n`)
                }
                // Workflow action end
                else if (eventType === 'response.output_item.done' && event.item?.type === 'workflow_action') {
                    res.write(`event: workflow\ndata: ${JSON.stringify({ action: event.item.action_id, status: event.item.status, phase: 'end' })}\n\n`)
                }
                // Error
                else if (eventType === 'response.failed') {
                    res.write(`event: error\ndata: ${JSON.stringify({ error: event.error || 'Response failed', conversationId })}\n\n`)
                }
            }
        }

        // Final done event
        res.write(`event: done\ndata: ${JSON.stringify({ conversationId })}\n\n`)
        res.end()

    } catch (err) {
        console.error('[Chat] Exception:', err)
        res.write(`event: error\ndata: ${JSON.stringify({ error: err.message || 'Internal error' })}\n\n`)
        res.end()
    }
})

/**
 * DELETE /api/chat/:conversationId
 * Deletes a conversation to free resources
 */
app.delete('/api/chat/:conversationId', async (req, res) => {
    const projectEndpoint = process.env.AZURE_AI_PROJECT_ENDPOINT
    if (!projectEndpoint) {
        return res.status(500).json({ error: 'AZURE_AI_PROJECT_ENDPOINT not configured' })
    }

    try {
        const token = await getBearerToken()
        const baseUrl = projectEndpoint.replace(/\/+$/, '')
        const convId = req.params.conversationId

        const delRes = await fetch(
            `${baseUrl}/openai/v1/conversations/${encodeURIComponent(convId)}`,
            {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            }
        )

        if (!delRes.ok && delRes.status !== 404) {
            const errText = await delRes.text()
            return res.status(delRes.status).json({ error: errText })
        }

        console.log('[Chat] Deleted conversation:', convId)
        res.json({ status: 'deleted', conversationId: convId })
    } catch (err) {
        console.error('[Chat] Delete error:', err)
        res.status(500).json({ error: err.message })
    }
})

// --------------- Campaign Generation (non-streaming) ---------------

/**
 * POST /api/generate
 * Body: { briefText: string, language?: string }
 * Sends briefText to the Foundry campaign-orchestration-flow workflow,
 * collects the full streamed response, and returns { text, conversationId }.
 */
app.post('/api/generate', async (req, res) => {
    console.log('[Generate] === Request received ===')
    const projectEndpoint = process.env.AZURE_AI_PROJECT_ENDPOINT
    if (!projectEndpoint) {
        return res.status(500).json({ error: 'AZURE_AI_PROJECT_ENDPOINT not configured' })
    }

    const { briefText, language } = req.body
    if (!briefText) {
        return res.status(400).json({ error: 'Missing "briefText" field' })
    }

    let token
    try {
        token = await getBearerToken()
    } catch (err) {
        return res.status(500).json({ error: 'Azure auth failed: ' + err.message })
    }

    const baseUrl = projectEndpoint.replace(/\/+$/, '')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    let conversationId
    try {
        // 1) Create conversation
        const convUrl = `${baseUrl}/openai/v1/conversations`
        console.log('[Generate] URL:', convUrl)
        console.log('[Generate] Token (first 20):', token.substring(0, 20))
        console.log('[Generate] Headers:', JSON.stringify(Object.keys(headers)))
        const convRes = await fetch(convUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({}),
        })
        console.log('[Generate] Conv response status:', convRes.status)
        if (!convRes.ok) {
            const errText = await convRes.text()
            console.error('[Generate] Conv error:', errText)
            return res.status(convRes.status).json({ error: `Create conversation failed: ${errText}` })
        }
        const convData = await convRes.json()
        conversationId = convData.id
        console.log('[Generate] Created conversation:', conversationId)

        // 2) Send brief to workflow and collect full response
        const responsesUrl = `${baseUrl}/openai/v1/responses`
        const prompt = language === 'en'
            ? `Generate a complete marketing campaign plan based on this brief. Respond in English.\n\n${briefText}`
            : `Genera un plan de campa\u00f1a de marketing completo basado en este brief. Responde en espa\u00f1ol.\n\n${briefText}`

        const body = {
            conversation: conversationId,
            input: prompt,
            stream: true,
            agent_reference: {
                name: WORKFLOW_NAME,
                type: 'agent_reference',
            },
            metadata: { 'x-ms-debug-mode-enabled': '1' },
        }

        console.log('[Generate] Streaming response for conversation:', conversationId)

        const streamRes = await fetch(responsesUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })

        if (!streamRes.ok) {
            const errText = await streamRes.text()
            return res.status(streamRes.status).json({ error: `Responses API failed: ${errText}` })
        }

        // 3) Collect all text deltas into a single string
        const reader = streamRes.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let fullText = ''
        const workflowActions = []

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop()

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue
                const dataStr = line.slice(6).trim()
                if (dataStr === '[DONE]') continue

                let event
                try { event = JSON.parse(dataStr) } catch { continue }

                if (event.type === 'response.output_text.delta') {
                    fullText += event.delta
                } else if (event.type === 'response.output_item.added' && event.item?.type === 'workflow_action') {
                    workflowActions.push({ action: event.item.action_id, status: 'started' })
                    console.log(`[Generate] Workflow: ${event.item.action_id} started`)
                } else if (event.type === 'response.output_item.done' && event.item?.type === 'workflow_action') {
                    workflowActions.push({ action: event.item.action_id, status: 'completed' })
                    console.log(`[Generate] Workflow: ${event.item.action_id} completed`)
                } else if (event.type === 'response.failed') {
                    console.error('[Generate] Response failed:', event)
                    return res.status(502).json({ error: 'Workflow response failed', details: event })
                }
            }
        }

        console.log(`[Generate] Collected ${fullText.length} chars, ${workflowActions.length} workflow actions`)

        // 4) Delete conversation to free resources
        try {
            await fetch(
                `${baseUrl}/openai/v1/conversations/${encodeURIComponent(conversationId)}`,
                { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }
            )
            console.log('[Generate] Deleted conversation:', conversationId)
        } catch (cleanupErr) {
            console.warn('[Generate] Failed to delete conversation:', cleanupErr.message)
        }

        // 5) Return the full text
        res.json({ text: fullText, workflowActions })

    } catch (err) {
        console.error('[Generate] Exception:', err)
        // Attempt cleanup
        if (conversationId) {
            try {
                const cleanupToken = await getBearerToken()
                await fetch(
                    `${baseUrl}/openai/v1/conversations/${encodeURIComponent(conversationId)}`,
                    { method: 'DELETE', headers: { 'Authorization': `Bearer ${cleanupToken}` } }
                )
            } catch { /* ignore cleanup errors */ }
        }
        res.status(500).json({ error: err.message || 'Internal error' })
    }
})

// --------------- Health & Legacy ---------------

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'foundry-proxy',
        hasApiKey: !!process.env.FOUNDRY_API_KEY,
        hasProjectEndpoint: !!process.env.AZURE_AI_PROJECT_ENDPOINT
    })
})

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
    console.log(`\u26A1 Foundry Proxy server running on http://localhost:${PORT}`)
    console.log(`    Health check: http://localhost:${PORT}/health`)
    console.log(`    Chat SSE:         POST http://localhost:${PORT}/api/chat`)
    console.log(`    Generate:         POST http://localhost:${PORT}/api/generate`)
    console.log(`    Legacy proxy: POST http://localhost:${PORT}/api/run`)
    console.log(`    Project endpoint: ${process.env.AZURE_AI_PROJECT_ENDPOINT ? '\u2705 Yes' : '\u274C No'}`)
    console.log(`    API Key configured: ${process.env.FOUNDRY_API_KEY ? '\u2705 Yes' : '\u274C No (optional)'}`)
})

// Keep process alive (Express 5 + ESM on Windows can drop the event loop)
server.keepAliveTimeout = 65000
const keepAlive = setInterval(() => {}, 1 << 30)
process.on('SIGINT', () => { clearInterval(keepAlive); server.close(); process.exit(0) })
process.on('SIGTERM', () => { clearInterval(keepAlive); server.close(); process.exit(0) })
