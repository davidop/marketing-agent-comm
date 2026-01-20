import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatCircle, PaperPlaneRight } from '@phosphor-icons/react'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: number
}

export function LiveChat() {
  const [messages, setMessages] = useKV<Message[]>('chat-messages', [])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages((current) => [...(current || []), userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // @ts-expect-error - spark global is provided by runtime
      const prompt = spark.llmPrompt`You are a helpful AI marketing assistant. The user is working on marketing campaigns and needs advice. Keep responses concise and actionable.

User message: ${input}

Provide a helpful, friendly response.`

      const response = await spark.llm(prompt)

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: response,
        timestamp: Date.now()
      }

      setMessages((current) => [...(current || []), agentMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages((current) => [...(current || []), errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="glass-panel p-6 flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)]">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <ChatCircle size={24} weight="fill" className="text-success" />
          Live Agent Chat
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions and refine your campaigns
        </p>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-3">
          {!messages || messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ChatCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Start a conversation with your AI marketing agent</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground neon-glow'
                      : 'glass-panel text-foreground'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-panel px-4 py-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="glass-panel-hover flex-1"
          disabled={isTyping}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="neon-glow-accent"
          size="icon"
        >
          <PaperPlaneRight size={18} weight="fill" />
        </Button>
      </div>
    </Card>
  )
}