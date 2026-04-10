import { useState, useCallback } from 'react'
import { orchestrator, type ThreadMessage, type AgentThread, type ThreadRun } from '@/lib/orchestrator'

export interface UseOrchestratorOptions {
  agentId?: string
  onMessageReceived?: (message: ThreadMessage) => void
  onError?: (error: Error) => void
}

export function useOrchestrator(options: UseOrchestratorOptions = {}) {
  const { 
    agentId = 'asst_marketing_orchestrator',
    onMessageReceived,
    onError 
  } = options

  const [thread, setThread] = useState<AgentThread | null>(null)
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createThread = useCallback((metadata?: Record<string, unknown>) => {
    const newThread = orchestrator.createThread(metadata)
    setThread(newThread)
    setMessages([])
    setError(null)
    return newThread
  }, [])

  const sendMessage = useCallback(async (content: string, overrideThread?: AgentThread) => {
    const activeThread = overrideThread || thread
    if (!activeThread) {
      const err = new Error('No active thread. Call createThread() first.')
      setError(err)
      onError?.(err)
      return null
    }

    setIsProcessing(true)
    setError(null)

    try {
      const userMessage = orchestrator.createMessage(
        activeThread.id,
        'user',
        content
      )

      setMessages(prev => [...prev, userMessage])

      const run = orchestrator.createRun(activeThread.id, agentId)

      const completedRun = await orchestrator.waitForRun(
        activeThread.id,
        run.id
      )

      const updatedMessages = orchestrator.listMessages(activeThread.id)
      setMessages(updatedMessages)

      const assistantMessage = updatedMessages[updatedMessages.length - 1]
      if (assistantMessage?.role === 'assistant') {
        onMessageReceived?.(assistantMessage)
      }

      return completedRun

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [thread, agentId, onMessageReceived, onError])

  const loadThread = useCallback((threadId: string) => {
    const existingThread = orchestrator.getThread(threadId)
    if (existingThread) {
      setThread(existingThread)
      const threadMessages = orchestrator.listMessages(threadId)
      setMessages(threadMessages)
      return existingThread
    }
    return null
  }, [])

  const clearThread = useCallback(() => {
    if (thread) {
      orchestrator.deleteThread(thread.id)
    }
    setThread(null)
    setMessages([])
    setError(null)
  }, [thread])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    thread,
    messages,
    isProcessing,
    error,
    createThread,
    sendMessage,
    loadThread,
    clearThread,
    resetError
  }
}
