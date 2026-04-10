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
const WORKFLOW_VERSION = '2'
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
      const convRes = await fetch(`${baseUrl}/openai/conversations?api-version=2025-05-01-preview`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      })
      if (!convRes.ok) {
        const errText = await convRes.text()
        res.write(`event: error\ndata: ${JSON.stringify({ error: `Create conversation failed (${convRes.status}): ${errText}` })}\n\n`)
        return res.end()
      }
      const convData = await convRes.json()
      conversationId = convData.id
      console.log('[Chat] Created conversation:', conversationId)
    }

    // 2) Send message with streaming via responses endpoint
    const responsesUrl = `${baseUrl}/openai/responses?api-version=2025-05-01-preview`
    const body = {
      conversation: conversationId,
      input: message,
      stream: true,
      extra_body: {
        agent_reference: {
          name: WORKFLOW_NAME,
          type: 'agent_reference',
          version: WORKFLOW_VERSION,
        }
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

        // Text delta — forward incrementally
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
      `${baseUrl}/openai/conversations/${encodeURIComponent(convId)}?api-version=2025-05-01-preview`,
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

app.listen(PORT, () => {
  console.log(`✅ Foundry Proxy server running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   Chat SSE:     POST http://localhost:${PORT}/api/chat`)
  console.log(`   Legacy proxy: POST http://localhost:${PORT}/api/run`)
  console.log(`   Project endpoint: ${process.env.AZURE_AI_PROJECT_ENDPOINT ? '✅ Yes' : '❌ No'}`)
  console.log(`   API Key configured: ${process.env.FOUNDRY_API_KEY ? '✅ Yes' : '❌ No (optional)'}`)
})
