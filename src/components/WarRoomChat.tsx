import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlugsConnected, Plug, Lightning, Copy, CheckCircle, WarningCircle, X, FileText, User, Robot } from '@phosphor-icons/react'
import { useBriefStore } from '@/lib/briefStore'
import type { CampaignBriefData } from '@/lib/types'
import { toast } from 'sonner'

interface WarRoomChatProps {
  language: 'es' | 'en'
  onCommand?: (command: string) => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

/**
 * Streams a message to the Foundry workflow via the Node.js SSE proxy.
 * Calls onDelta for each text chunk, onDone when finished, onError on failure.
 */
async function streamFromAgent(
  message: string,
  conversationId: string | null,
  callbacks: {
    onDelta: (text: string, conversationId: string) => void
    onDone: (conversationId: string) => void
    onError: (error: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const url = '/api/chat'

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      ...(conversationId && { conversationId }),
    }),
    signal: callbacks.signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Error ${response.status}: ${response.statusText}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

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
          callbacks.onDelta(data.text as string, data.conversationId as string)
        } else if (currentEvent === 'done') {
          callbacks.onDone(data.conversationId as string)
        } else if (currentEvent === 'error') {
          callbacks.onError(data.error as string)
        }
      }
    }
  }
}

export function WarRoomChat({ language }: WarRoomChatProps) {
  const [isConnected] = useState(true)
  const [userInput, setUserInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [currentBrief] = useKV<CampaignBriefData>('campaign-brief-data')
  const { selectedBrief, clearSelectedBrief } = useBriefStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  /**
   * Construye el contexto del brief seleccionado en formato texto
   */
  const buildBriefContext = (): string => {
    if (selectedBrief) {
      return `Producto: ${selectedBrief.product}
Audiencia: ${selectedBrief.target}
Canales: ${selectedBrief.channels.join(', ')}
Tono de Marca: ${selectedBrief.brandTone}
Presupuesto: ${selectedBrief.budget}

Brief completo:
${selectedBrief.briefText}`
    }

    if (currentBrief) {
      const parts: string[] = []
      
      if (currentBrief.product) parts.push(`Producto: ${currentBrief.product}`)
      if (currentBrief.audience) parts.push(`Audiencia: ${currentBrief.audience}`)
      if (currentBrief.goals) parts.push(`Objetivos: ${currentBrief.goals}`)
      if (currentBrief.budget) parts.push(`Presupuesto: ${currentBrief.budget}`)
      if (currentBrief.channels && currentBrief.channels.length > 0) {
        const channels = Array.isArray(currentBrief.channels) ? currentBrief.channels.join(', ') : currentBrief.channels
        parts.push(`Canales: ${channels}`)
      }
      if (currentBrief.tone) parts.push(`Tono: ${currentBrief.tone}`)
      if (currentBrief.mainPromise) parts.push(`Promesa: ${currentBrief.mainPromise}`)
      
      return parts.join('\n')
    }

    return ''
  }

  /**
   * Maneja el envío de mensajes al agente
   */
  const handleSendMessage = async () => {
    const trimmedInput = userInput.trim()
    
    if (!trimmedInput) {
      toast.error(language === 'es' ? 'Por favor escribe un mensaje' : 'Please write a message')
      return
    }

    if (!selectedBrief && !currentBrief) {
      toast.error(language === 'es' ? 'Por favor selecciona un brief primero' : 'Please select a brief first')
      return
    }

    setIsSending(true)
    setIsStreaming(true)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setUserInput('')

    // Create a placeholder agent message for streaming
    const agentMsgId = `agent-${Date.now()}`
    const agentMessage: ChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    setChatMessages(prev => [...prev, agentMessage])

    const briefContext = buildBriefContext()
    const contextualizedMessage = `---
CONTEXTO (Brief seleccionado):
${briefContext}
---

PREGUNTA DEL USUARIO:
${trimmedInput}`

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamFromAgent(contextualizedMessage, conversationId, {
        signal: controller.signal,
        onDelta: (text, convId) => {
          if (convId && !conversationId) {
            setConversationId(convId)
          }
          setChatMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId ? { ...m, content: m.content + text } : m
            )
          )
        },
        onDone: (convId) => {
          if (convId) setConversationId(convId)
          setChatMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId ? { ...m, isStreaming: false } : m
            )
          )
        },
        onError: (error) => {
          setChatMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId
                ? { ...m, content: `❌ Error: ${error}`, isStreaming: false }
                : m
            )
          )
          toast.error(error)
        },
      })

      // Mark streaming done in case onDone wasn't received
      setChatMessages(prev =>
        prev.map(m =>
          m.id === agentMsgId ? { ...m, isStreaming: false } : m
        )
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error(language === 'es' ? `Error: ${errorMessage}` : `Error: ${errorMessage}`)
      setChatMessages(prev =>
        prev.map(m =>
          m.id === agentMsgId
            ? { ...m, content: `❌ Error: ${errorMessage}`, isStreaming: false }
            : m
        )
      )
    } finally {
      setIsSending(false)
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = async () => {
    if (abortRef.current) abortRef.current.abort()
    if (conversationId) {
      fetch(`/api/chat/${encodeURIComponent(conversationId)}`, { method: 'DELETE' }).catch(() => {})
    }
    setChatMessages([])
    setConversationId(null)
    setIsStreaming(false)
    setIsSending(false)
    toast.info(language === 'es' ? 'Conversación limpiada' : 'Conversation cleared')
  }

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden border-2 marketing-shine">
      <div className="p-5 border-b-2 border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Lightning size={28} weight="fill" className="text-primary float-animate" />
          <h2 className="text-lg font-bold uppercase tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {language === 'es' ? 'War Room Chat' : 'War Room Chat'}
          </h2>
        </div>
        
        <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit mb-3">
          {isConnected ? (
            <>
              <PlugsConnected size={12} weight="fill" className="text-success" />
              {language === 'es' ? 'Conectado a Azure AI Foundry' : 'Connected to Azure AI Foundry'}
            </>
          ) : (
            <>
              <Plug size={12} weight="fill" className="text-muted-foreground" />
              {language === 'es' ? 'Desconectado' : 'Disconnected'}
            </>
          )}
        </Badge>

        {selectedBrief && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} weight="fill" className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {language === 'es' ? 'Brief Activo' : 'Active Brief'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearSelectedBrief()
                  handleClearChat()
                  toast.info(language === 'es' ? 'Brief y chat limpiados' : 'Brief and chat cleared')
                }}
                className="h-6 px-2 text-xs"
              >
                <X size={12} className="mr-1" />
                {language === 'es' ? 'Limpiar' : 'Clear'}
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{selectedBrief.name}</p>
              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {selectedBrief.product}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedBrief.budget}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {selectedBrief.channels.length} {language === 'es' ? 'canales' : 'channels'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {conversationId && (
          <Badge variant="secondary" className="text-xs mb-3 w-full justify-center" title={conversationId}>
            {language === 'es' ? 'Conversación activa' : 'Active conversation'} - {conversationId.substring(0, 12)}...
          </Badge>
        )}

        {isStreaming && (
          <Badge variant="outline" className="text-xs mb-3 w-full justify-center animate-pulse">
            {language === 'es' ? '⚡ Generando respuesta...' : '⚡ Generating response...'}
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Lightning size={48} weight="duotone" className="mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm font-semibold text-muted-foreground">
                  {language === 'es'
                    ? 'Inicia la conversación'
                    : 'Start the conversation'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'es'
                    ? 'Haz preguntas sobre el brief seleccionado'
                    : 'Ask questions about the selected brief'}
                </p>
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'agent' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Robot size={20} weight="fill" className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p className="text-[10px] opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <User size={20} weight="fill" className="text-accent" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t-2 border-border/50 space-y-2">
        <div className="flex gap-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              language === 'es'
                ? 'Escribe tu mensaje aquí...\n\nPresiona Ctrl+Enter para enviar.'
                : 'Write your message here...\n\nPress Ctrl+Enter to send.'
            }
            className="min-h-[80px] text-sm resize-none flex-1"
            disabled={isSending || (!selectedBrief && !currentBrief)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !userInput.trim() || (!selectedBrief && !currentBrief)}
            className="flex-1 font-bold"
            size="default"
          >
            <Lightning size={18} weight="fill" className="mr-2" />
            {isSending
              ? (language === 'es' ? 'Generando...' : 'Generating...')
              : (language === 'es' ? 'Enviar' : 'Send')}
          </Button>

          {chatMessages.length > 0 && (
            <Button
              variant="outline"
              size="default"
              onClick={handleClearChat}
              disabled={isSending}
              className="text-xs"
            >
              <X size={16} className="mr-1" />
              {language === 'es' ? 'Limpiar' : 'Clear'}
            </Button>
          )}
        </div>

        {!selectedBrief && !currentBrief && (
          <p className="text-xs text-muted-foreground text-center">
            {language === 'es'
              ? '⚠️ Por favor selecciona un brief primero'
              : '⚠️ Please select a brief first'}
          </p>
        )}
      </div>
    </Card>
  )
}
