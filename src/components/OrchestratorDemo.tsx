import { useState } from 'react'
import { useOrchestrator } from '@/hooks/use-orchestrator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ChatCircle, PaperPlaneTilt, Trash, Plus, Robot, User, FileText, Sparkle, Lightning } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function OrchestratorDemo() {
  const [inputMessage, setInputMessage] = useState('')

  const {
    thread,
    messages,
    isProcessing,
    error,
    createThread,
    sendMessage,
    clearThread
  } = useOrchestrator({
    agentId: 'asst_marketing_orchestrator',
    onMessageReceived: (message) => {
      toast.success('Response received', {
        description: message.content.substring(0, 50) + '...'
      })
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message
      })
    }
  })

  const handleCreateThread = () => {
    createThread({
      source: 'demo',
      createdBy: 'user'
    })
    toast.success('Thread created', {
      description: 'New conversation started'
    })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    const message = inputMessage.trim()
    setInputMessage('')
    
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearThread = () => {
    clearThread()
    toast.info('Thread cleared', {
      description: 'Conversation history deleted'
    })
  }

  const handleGenerateCampaign = async () => {
    if (!thread) {
      createThread({
        source: 'campaign-generation'
      })
    }

    const campaignPrompt = `Generate a complete marketing campaign with the following elements:
- Creative routes (3 different approaches)
- Funnel blueprint
- Paid pack recommendations
- Content calendar
- Execution checklist

Please provide a comprehensive and actionable campaign strategy.`

    await sendMessage(campaignPrompt)
    toast.success('Campaign generation started', {
      description: 'The orchestrator is creating your campaign...'
    })
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Robot size={24} weight="duotone" className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Foundry Workflow</h2>
                  <p className="text-xs text-muted-foreground">
                    Microsoft Foundry Agent - Campaign Generation
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {thread && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {thread.id.substring(0, 20)}...
                  </Badge>
                )}
                
                {thread && (
                  <Button onClick={handleClearThread} size="sm" variant="outline">
                    <Trash size={16} weight="bold" className="mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <Separator className="mb-4" />

          <div className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No messages yet. Send a message to start the conversation.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Robot size={18} weight="fill" className="text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] rounded-xl p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.createdAt.toLocaleTimeString()}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <User size={18} weight="fill" className="text-accent" />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Robot size={18} weight="fill" className="text-primary" />
                    </div>
                    <div className="max-w-[75%] rounded-xl p-4 bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                <strong>Error:</strong> {error.message}
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message or use 'Generar campaña' to start..."
                disabled={isProcessing}
                className="flex-1 min-h-[60px]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
                size="icon"
                className="flex-shrink-0 h-[60px]"
              >
                <PaperPlaneTilt size={18} weight="fill" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
      </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="glass-panel p-6 space-y-4">
            <div>
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Lightning size={16} weight="fill" className="text-primary" />
                Campaign Controls
              </h3>
              <p className="text-xs text-muted-foreground">
                Quick actions for campaign generation
              </p>
            </div>

            <Separator />

              <div className="space-y-3">
                <Button 
                  onClick={handleGenerateCampaign} 
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkle size={18} weight="fill" className="mr-2" />
                      Generar campaña
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This will send a campaign generation request to Microsoft Foundry
                </p>
              </div>
          </Card>
        </div>
      </div>

      <Card className="glass-panel p-4">
        <h3 className="font-bold text-sm mb-3">Code Example (TypeScript)</h3>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs font-mono">
{`import { useOrchestrator } from '@/hooks/use-orchestrator'

function MyComponent() {
  const { thread, messages, isProcessing, createThread, sendMessage } = 
    useOrchestrator({
      agentId: 'asst_marketing_orchestrator',
      onMessageReceived: (msg) => console.log('Received:', msg.content)
    })

  // Create a new conversation thread
  const startConversation = () => {
    createThread({ metadata: 'value' })
  }

  // Send a message and get AI response
  const chat = async (text: string) => {
    await sendMessage(text)
  }

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.role}: {msg.content}</div>
      ))}
    </div>
  )
}`}
          </pre>
        </div>
      </Card>
    </div>
  )
}
