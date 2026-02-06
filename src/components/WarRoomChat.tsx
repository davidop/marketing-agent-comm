import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlugsConnected, Plug, Lightning, Copy, CheckCircle, WarningCircle, X, FileText } from '@phosphor-icons/react'
import { runCampaignFlow, type FoundryPayload, type FoundryError } from '@/lib/foundryClient'
import { useBriefStore } from '@/lib/briefStore'
import type { CampaignBriefData } from '@/lib/types'
import { toast } from 'sonner'

interface WarRoomChatProps {
  language: 'es' | 'en'
  onCommand?: (command: string) => void
}

interface LogEntry {
  id: string
  text: string
  type: 'info' | 'success' | 'error' | 'loading'
  timestamp: Date
}

export function WarRoomChat({ language }: WarRoomChatProps) {
  const [isConnected] = useState(true)
  const [briefText, setBriefText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [foundryLogs, setFoundryLogs] = useState<LogEntry[]>([])
  const [lastResponse, setLastResponse] = useState<string>('')
  const [currentBrief] = useKV<CampaignBriefData>('campaign-brief-data')
  const [copiedResponse, setCopiedResponse] = useState(false)
  const { selectedBrief, clearSelectedBrief } = useBriefStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedBrief && selectedBrief.briefText) {
      setBriefText(selectedBrief.briefText)
    }
  }, [selectedBrief])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [foundryLogs])

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const log: LogEntry = {
      id: `log-${Date.now()}`,
      text,
      type,
      timestamp: new Date()
    }
    setFoundryLogs(prev => [...prev, log])
  }

  const handleGenerateCampaign = async () => {
    if (!briefText.trim() && !currentBrief && !selectedBrief) {
      toast.error(language === 'es' ? 'Por favor escribe un brief' : 'Please write a brief')
      return
    }

    setIsGenerating(true)
    setFoundryLogs([])
    setLastResponse('')

    addLog(language === 'es' ? '🚀 Iniciando generación...' : '🚀 Starting generation...', 'info')

    const brief = briefText.trim() || (selectedBrief ? selectedBrief.briefText : buildBriefFromForm(currentBrief))
    
    const payload: FoundryPayload = {
      messages: [
        {
          role: 'user',
          content: brief
        }
      ],
      context: {
        campaignContext: {
          product: selectedBrief?.product || currentBrief?.product || '',
          target: selectedBrief?.target || currentBrief?.audience || '',
          channels: selectedBrief?.channels || (Array.isArray(currentBrief?.channels) 
            ? currentBrief.channels 
            : []),
          brandTone: selectedBrief?.brandTone || currentBrief?.tone || '',
          budget: selectedBrief?.budget || currentBrief?.budget || ''
        },
        uiState: {
          view: 'campaign'
        }
      }
    }

    const mode = import.meta.env.VITE_USE_PROXY !== 'false' ? 'Proxy' : 'Direct'
    addLog(
      language === 'es' 
        ? `📤 Llamando a Foundry (modo: ${mode})...` 
        : `📤 Calling Foundry (mode: ${mode})...`, 
      'loading'
    )

    try {
      const response = await runCampaignFlow(payload)
      
      addLog(language === 'es' ? '✅ Campaña generada con éxito' : '✅ Campaign generated successfully', 'success')
      setLastResponse(JSON.stringify(response, null, 2))
      
      toast.success(language === 'es' ? 'Campaña generada' : 'Campaign generated')
    } catch (err) {
      const error = err as FoundryError
      
      addLog(`❌ Error: ${error.message}`, 'error')
      
      if (error.mode) {
        addLog(
          language === 'es' 
            ? `🔧 Modo usado: ${error.mode === 'proxy' ? 'Proxy' : 'Directo'}` 
            : `🔧 Mode used: ${error.mode === 'proxy' ? 'Proxy' : 'Direct'}`,
          'info'
        )
      }
      
      if (error.recommendation) {
        addLog(`💡 ${error.recommendation}`, 'info')
      }

      if (error.type === 'cors') {
        addLog(
          language === 'es' 
            ? '⚠️ CORS: El navegador bloquea la llamada directa. Usa VITE_USE_PROXY=true.' 
            : '⚠️ CORS: Browser blocks direct call. Use VITE_USE_PROXY=true.',
          'error'
        )
      } else if (error.type === 'auth') {
        if (error.mode === 'proxy') {
          addLog(
            language === 'es' 
              ? '⚠️ AUTH: Configura FOUNDRY_API_KEY en el servidor backend.' 
              : '⚠️ AUTH: Set FOUNDRY_API_KEY on backend server.',
            'error'
          )
        } else {
          addLog(
            language === 'es' 
              ? '⚠️ AUTH: Configura VITE_FOUNDRY_API_KEY o usa proxy con VITE_USE_PROXY=true.' 
              : '⚠️ AUTH: Set VITE_FOUNDRY_API_KEY or use proxy with VITE_USE_PROXY=true.',
            'error'
          )
        }
      }

      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const buildBriefFromForm = (brief?: CampaignBriefData): string => {
    if (!brief) return ''
    
    const parts: string[] = []
    
    if (brief.product) parts.push(`Producto: ${brief.product}`)
    if (brief.audience) parts.push(`Audiencia: ${brief.audience}`)
    if (brief.goals) parts.push(`Objetivos: ${brief.goals}`)
    if (brief.budget) parts.push(`Presupuesto: ${brief.budget}`)
    if (brief.channels && brief.channels.length > 0) {
      const channels = Array.isArray(brief.channels) ? brief.channels.join(', ') : brief.channels
      parts.push(`Canales: ${channels}`)
    }
    if (brief.tone) parts.push(`Tono: ${brief.tone}`)
    if (brief.mainPromise) parts.push(`Promesa: ${brief.mainPromise}`)
    
    return parts.join('\n')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleGenerateCampaign()
    }
  }

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(lastResponse)
    setCopiedResponse(true)
    toast.success(language === 'es' ? 'Respuesta copiada' : 'Response copied')
    setTimeout(() => setCopiedResponse(false), 2000)
  }

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden border-2 marketing-shine">
      <div className="p-5 border-b-2 border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Lightning size={28} weight="fill" className="text-primary float-animate" />
          <h2 className="text-lg font-bold uppercase tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {language === 'es' ? 'Foundry Workflow' : 'Foundry Workflow'}
          </h2>
        </div>
        
        <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit mb-3">
          {isConnected ? (
            <>
              <PlugsConnected size={12} weight="fill" className="text-success" />
              {language === 'es' ? 'Conectado a Azure AI Agent' : 'Connected to Azure AI Agent'}
            </>
          ) : (
            <>
              <Plug size={12} weight="fill" className="text-muted-foreground" />
              {language === 'es' ? 'Desconectado' : 'Disconnected'}
            </>
          )}
        </Badge>

        <div className="space-y-3">
          {selectedBrief && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 space-y-2">
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
                    setBriefText('')
                    toast.info(language === 'es' ? 'Brief limpiado' : 'Brief cleared')
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBriefText(selectedBrief.briefText)}
                className="w-full text-xs"
              >
                {language === 'es' ? 'Usar brief seleccionado' : 'Use selected brief'}
              </Button>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              {language === 'es' ? 'Brief de Campaña' : 'Campaign Brief'}
            </label>
            <Textarea
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                language === 'es'
                  ? 'Escribe tu brief aquí o usa el formulario del Brief Wizard...\n\nPresiona Ctrl+Enter o el botón para generar.'
                  : 'Write your brief here or use the Brief Wizard form...\n\nPress Ctrl+Enter or the button to generate.'
              }
              className="min-h-[120px] text-sm resize-none"
              disabled={isGenerating}
            />
          </div>

          <Button
            onClick={handleGenerateCampaign}
            disabled={isGenerating || (!briefText.trim() && !currentBrief && !selectedBrief)}
            className="w-full font-bold"
            size="lg"
          >
            <Lightning size={18} weight="fill" className="mr-2" />
            {isGenerating
              ? (language === 'es' ? 'Generando...' : 'Generating...')
              : (language === 'es' ? 'Generar Campaña' : 'Generate Campaign')}
          </Button>

          {lastResponse && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyResponse}
                className="flex-1 text-xs"
              >
                {copiedResponse ? (
                  <CheckCircle size={14} weight="fill" className="mr-1" />
                ) : (
                  <Copy size={14} className="mr-1" />
                )}
                {language === 'es' ? 'Copiar Respuesta' : 'Copy Response'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-2">
            {foundryLogs.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Lightning size={48} weight="duotone" className="mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm font-semibold text-muted-foreground">
                  {language === 'es'
                    ? 'Escribe un brief y presiona Generar'
                    : 'Write a brief and press Generate'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'es'
                    ? 'Los logs de ejecución aparecerán aquí'
                    : 'Execution logs will appear here'}
                </p>
              </div>
            ) : (
              foundryLogs.map((log) => (
                <div
                  key={log.id}
                  className={`text-xs font-mono p-2 rounded-md ${
                    log.type === 'success'
                      ? 'bg-success/10 text-success'
                      : log.type === 'error'
                      ? 'bg-destructive/10 text-destructive'
                      : log.type === 'loading'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {log.type === 'error' && (
                      <WarningCircle size={14} weight="fill" className="mt-0.5 flex-shrink-0" />
                    )}
                    <span className="flex-1">{log.text}</span>
                    <span className="text-[10px] opacity-60 flex-shrink-0">
                      {log.timestamp.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {lastResponse && (
        <div className="p-3 border-t-2 border-border/50 bg-muted/20">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            {language === 'es' ? 'Debug: Usa el botón arriba para copiar la respuesta' : 'Debug: Use button above to copy response'}
          </p>
        </div>
      )}
    </Card>
  )
}
