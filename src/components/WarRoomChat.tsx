import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatCircle, Sparkle, Lightning, PaperPlaneRight } from '@phosphor-icons/react'
import { getCopy } from '@/lib/premiumCopy'

interface WarRoomChatProps {
  language: 'es' | 'en'
  onCommand?: (command: string) => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const COMMANDS = [
  { cmd: '/mejora-hooks', key: 'mejoraHooks' as const },
  { cmd: '/más-premium', key: 'masPremium' as const },
  { cmd: '/b2b', key: 'b2b' as const },
  { cmd: '/reduce-riesgo', key: 'reduceRiesgo' as const },
  { cmd: '/regenera-bloque', key: 'regeneraBloque' as const },
  { cmd: '/crea-landing', key: 'creaLanding' as const },
  { cmd: '/paid-pack', key: 'paidPack' as const },
  { cmd: '/flow-email', key: 'flowEmail' as const }
]

const FOUNDRY_ENDPOINT = 'https://tenerife-winter-resource.services.ai.azure.com/api/projects/tenerife-winter'

export function WarRoomChat({ language, onCommand }: WarRoomChatProps) {
  const [showCommands, setShowCommands] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const copy = getCopy(language)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch(FOUNDRY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          language: language
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || data.message || 'No response',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message to Foundry:', error)
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: language === 'es' 
          ? 'Lo siento, hubo un error al conectar con el agente. Por favor, inténtalo de nuevo.' 
          : 'Sorry, there was an error connecting to the agent. Please try again.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleCommandClick = (cmd: string) => {
    setInputValue(cmd)
    onCommand?.(cmd)
  }

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden border-2 marketing-shine">
      <div className="p-5 border-b-2 border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <ChatCircle size={28} weight="fill" className="text-secondary float-animate" />
          <h2 className="text-lg font-bold uppercase tracking-tight bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
            {copy.warRoom.title}
          </h2>
          <Badge variant="outline" className="ml-auto text-xs">
            <Lightning size={12} weight="fill" className="mr-1" />
            {copy.warRoom.premiumAI}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {copy.warRoom.subtitle}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs font-bold"
          onClick={() => setShowCommands(!showCommands)}
        >
          <Sparkle size={14} weight="fill" className="mr-1" />
          {showCommands ? copy.warRoom.hideCommands : copy.warRoom.showCommands}
        </Button>
      </div>
      
      {showCommands && (
        <div className="p-4 border-b-2 border-border/50 bg-muted/20">
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-1 gap-2 pr-4">
              {COMMANDS.map((item) => (
                <Button
                  key={item.cmd}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs font-mono glass-panel-hover rounded-lg"
                  onClick={() => handleCommandClick(item.cmd)}
                >
                  <span className="text-primary font-bold mr-2">{item.cmd}</span>
                  <span className="text-muted-foreground">{copy.warRoom.commands[item.key]}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              {language === 'es' 
                ? 'Conectado a Microsoft Foundry. Escribe un mensaje para comenzar.' 
                : 'Connected to Microsoft Foundry. Type a message to start.'}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                <div className="flex gap-1">
                  <span className="typing-dot w-2 h-2 bg-foreground/50 rounded-full"></span>
                  <span className="typing-dot w-2 h-2 bg-foreground/50 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                  <span className="typing-dot w-2 h-2 bg-foreground/50 rounded-full" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t-2 border-border/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="shrink-0"
          >
            <PaperPlaneRight size={18} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
