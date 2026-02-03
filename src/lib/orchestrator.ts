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
  private agents = new Map<string, Agent>()
  private threads = new Map<string, AgentThread>()
  private messages = new Map<string, ThreadMessage[]>()
  private runs = new Map<string, ThreadRun>()

  constructor() {
    const defaultAgent: Agent = {
      id: 'asst_campaign_strategist',
      name: 'Campaign Strategist',
      instructions: `Eres un estratega de marketing experto con 10+ años de experiencia.

Tu misión es ayudar a crear, optimizar y ejecutar campañas de marketing efectivas.

Capacidades:
1. Analizar briefs de campaña y detectar gaps
2. Crear estrategias de marketing integrales
3. Optimizar presupuestos y canales
4. Crear calendarios de contenido
5. Generar copy efectivo para diferentes plataformas

Responde de forma clara, estructurada y accionable.`,
      model: 'gpt-4o',
    }
    this.agents.set(defaultAgent.id, defaultAgent)
  }

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

  createRun(threadId: string, assistantId: string): ThreadRun {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const run: ThreadRun = {
      id: runId,
      threadId,
      status: 'queued',
      createdAt: new Date(),
    }
    
    this.runs.set(runId, run)
    this.processRun(run, assistantId)
    
    return run
  }

  private async processRun(run: ThreadRun, assistantId: string) {
    const runData = this.runs.get(run.id)
    if (!runData) return

    runData.status = 'in_progress'

    try {
      const agent = this.agents.get(assistantId)
      if (!agent) {
        throw new Error(`Agent ${assistantId} not found`)
      }

      const threadMessages = this.listMessages(run.threadId)
      const conversationHistory = threadMessages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')

      const promptText = `${agent.instructions}

Historial de conversación:
${conversationHistory}

Por favor, responde al último mensaje del usuario.`

      const response = await spark.llm(promptText, 'gpt-4o')
      
      this.createMessage(run.threadId, 'assistant', response)
      
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
    this.threads.delete(threadId)
    this.messages.delete(threadId)

    const threadRuns = Array.from(this.runs.values())
      .filter(run => run.threadId === threadId)
    threadRuns.forEach(run => this.runs.delete(run.id))

    return true
  }
}

export const orchestrator = new OrchestratorClient()
