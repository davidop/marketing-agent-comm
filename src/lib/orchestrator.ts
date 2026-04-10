import { API_BASE } from '@/lib/apiBase'

export type MessageRole = 'user' | 'assistant' | 'system'

export type ThreadRunStatus =
  | 'queued'
  | 'in_progress'
  | 'requires_action'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface AgentThread {
  id: string
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface ThreadMessage {
  id: string
  threadId: string
  role: MessageRole
  content: string
  createdAt: Date
}

export interface ThreadRun {
  id: string
  threadId: string
  status: ThreadRunStatus
  createdAt: Date
  completedAt?: Date
  lastError?: {
    message: string
    code?: string
  }
}

export interface Agent {
  id: string
  name: string
  instructions: string
  model: string
}

class OrchestratorClient {
  private threads = new Map<string, AgentThread>()
  private messages = new Map<string, ThreadMessage[]>()
  private runs = new Map<string, ThreadRun>()
  private conversationIds = new Map<string, string>() // threadId -> Azure conversationId

  createThread(metadata?: Record<string, unknown>): AgentThread {
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const thread: AgentThread = {
      id: threadId,
      createdAt: new Date(),
      metadata,
    }
    this.threads.set(threadId, thread)
    return thread
  }

  getThread(threadId: string): AgentThread | undefined {
    return this.threads.get(threadId)
  }

  createMessage(
    threadId: string,
    role: MessageRole,
    content: string
  ): ThreadMessage {
    const message: ThreadMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      role,
      content,
      createdAt: new Date(),
    }

    const threadMessages = this.messages.get(threadId) || []
    this.messages.set(threadId, [...threadMessages, message])
    return message
  }

  listMessages(
    threadId: string,
    order: 'ascending' | 'descending' = 'ascending'
  ): ThreadMessage[] {
    const messages = this.messages.get(threadId) || []
    if (order === 'descending') {
      return [...messages].reverse()
    }
    return messages
  }

  createRun(threadId: string, _assistantId: string): ThreadRun {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const run: ThreadRun = {
      id: runId,
      threadId,
      status: 'queued',
      createdAt: new Date(),
    }

    this.runs.set(runId, run)
    this.processRun(run)

    return run
  }

  private async processRun(run: ThreadRun) {
    const runData = this.runs.get(run.id)
    if (!runData) return

    runData.status = 'in_progress'

    try {
      const threadMessages = this.listMessages(run.threadId)
      const lastUserMessage = [...threadMessages].reverse().find(m => m.role === 'user')

      if (!lastUserMessage) {
        throw new Error('No user message found in thread')
      }

      const azureConvId = this.conversationIds.get(run.threadId) || null

      // Call the real Foundry backend via SSE
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lastUserMessage.content,
          ...(azureConvId && { conversationId: azureConvId }),
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Foundry API error (${response.status}): ${errText}`)
      }

      // Parse SSE stream
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let currentEvent = ''
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim()
          } else if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            let data: Record<string, unknown>
            try {
              data = JSON.parse(dataStr)
            } catch {
              continue
            }

            if (currentEvent === 'delta') {
              fullText += data.text as string
              if (data.conversationId && !azureConvId) {
                this.conversationIds.set(run.threadId, data.conversationId as string)
              }
            } else if (currentEvent === 'done') {
              if (data.conversationId) {
                this.conversationIds.set(run.threadId, data.conversationId as string)
              }
            } else if (currentEvent === 'error') {
              throw new Error(data.error as string)
            }
          }
        }
      }

      if (fullText) {
        this.createMessage(run.threadId, 'assistant', fullText)
      }

      runData.status = 'completed'
      runData.completedAt = new Date()
      this.runs.set(run.id, runData)
    } catch (error) {
      runData.status = 'failed'
      runData.lastError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'processing_error',
      }
      this.runs.set(run.id, runData)
    }
  }

  getRun(threadId: string, runId: string): ThreadRun | undefined {
    const run = this.runs.get(runId)
    if (run && run.threadId === threadId) {
      return run
    }
    return undefined
  }

  async waitForRun(
    threadId: string,
    runId: string,
    pollIntervalMs = 500
  ): Promise<ThreadRun> {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        const run = this.getRun(threadId, runId)
        if (!run) {
          reject(new Error(`Run ${runId} not found`))
          return
        }

        if (run.status === 'completed') {
          resolve(run)
        } else if (run.status === 'failed' || run.status === 'cancelled') {
          reject(new Error(run.lastError?.message || 'Run failed'))
        } else {
          setTimeout(checkStatus, pollIntervalMs)
        }
      }

      checkStatus()
    })
  }

  cancelRun(threadId: string, runId: string): ThreadRun | undefined {
    const run = this.getRun(threadId, runId)
    if (run && (run.status === 'queued' || run.status === 'in_progress')) {
      run.status = 'cancelled'
      this.runs.set(runId, run)
      return run
    }
    return undefined
  }

  deleteThread(threadId: string): boolean {
    // Clean up Azure conversation
    const azureConvId = this.conversationIds.get(threadId)
    if (azureConvId) {
      fetch(`http://localhost:3001/api/chat/${encodeURIComponent(azureConvId)}`, { method: 'DELETE' }).catch(() => {})
      this.conversationIds.delete(threadId)
    }

    this.threads.delete(threadId)
    this.messages.delete(threadId)

    const threadRuns = Array.from(this.runs.values())
      .filter(run => run.threadId === threadId)
    threadRuns.forEach(run => this.runs.delete(run.id))

    return true
  }
}

export const orchestrator = new OrchestratorClient()
