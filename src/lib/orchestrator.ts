export type MessageRole = 'user' | 'assistant' | 'system'

  | 'in_progress'
  | 'complet
  | 'in_progress'
  | 'requires_action'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface ThreadMessage {
  id: string
  threadId: string
  role: MessageRole
  content: string
  createdAt: Date
 

export interface ThreadRun {
  threadId: 
  status: RunStat
  completedAt?: Date
 


  id: string
  instructions: st
  tools?: unknown

  private threads
  private runs: Map<

    message: string
    code?: string
  }
}

export interface Agent {
  id: string
  name: string
  instructions: string
  model: string
  tools?: unknown[]
}

class OrchestratorClient {
  private threads: Map<string, AgentThread> = new Map()
  private messages: Map<string, ThreadMessage[]> = new Map()
  private runs: Map<string, ThreadRun> = new Map()
  private agents: Map<string, Agent> = new Map()

  constructor() {
    this.registerDefaultAgent()
  }

  private registerDefaultAgent() {
    const defaultAgent: Agent = {
      id: 'asst_marketing_orchestrator',
      name: 'Marketing Orchestrator',
      instructions: `Eres un asistente experto en marketing estratégico y gestión de campañas digitales.

Tu rol es ayudar a los usuarios a:
1. Planificar campañas de marketing completas
2. Definir estrategias de contenido
  }
  createThread(metadata?: Record<str
    

      metadata

    this.messages.set(threadId, [])
    return thread

    r

    threadId: string,
   

    const message: ThreadMessage = {
      threadId,
   

    const threadMessages = this.messa
    this.messages.set(threadId, thre
   

    const messages = this.messages.get(threadId) || []
    if (order === 'descending') {
    
    return [...messages]

    const runId = `run_${Dat
    const run:
     

    }
    this.runs.set(runId, run)
    
    return run



    this.runs.set(run.id, runData)
   

      }
      const threadMes
        .map(msg => `$


${conversationHistory}
Por 
      const response = await spark.l
      this.createMes
      runData.s
      this.
    } catch (e
      runData.lastError = {
     

  }
  getRun(threadId: string, runId
    if (run && run.threadId === threadId) {

  }
  a

  ): Promise<ThreadRun> {
      const checkStatus = () => {
    
          reject(new Error(`Run $
        }
     
    

   

        setTimeout(checkStatus, pollIntervalMs)

    

    this.threads
    
      .filter(
    threadRuns.forEach(

    t

  }











































































































