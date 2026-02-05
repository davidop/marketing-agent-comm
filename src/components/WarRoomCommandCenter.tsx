import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightning,
  ChartBar,
  FileText,
  Target,
  Eye,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { runCampaignFlow, type FoundryPayload, type FoundryResponse, type FoundryError } from '@/lib/foundryClient'

type ExecutionState = 'idle' | 'loading' | 'success' | 'error'

interface TraceEvent {
  id: string
  type: 'started' | 'calling' | 'done' | 'error'
  message: string
  timestamp: Date
  details?: string
}

const CHANNELS = [
  'Email',
  'Facebook',
  'Instagram', 
  'LinkedIn',
  'TikTok',
  'Twitter',
  'YouTube',
  'Google Ads',
  'Display Ads'
].sort()

const TONES = [
  { value: 'cercano', label: 'Cercano' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'premium', label: 'Premium' },
  { value: 'canalla', label: 'Canalla' },
  { value: 'tech', label: 'Tech' }
]

export function WarRoomCommandCenter() {
  const [state, setState] = useState<ExecutionState>('idle')
  const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([])
  const [response, setResponse] = useState<FoundryResponse | null>(null)
  const [error, setError] = useState<FoundryError | null>(null)

  const [formData, setFormData] = useState({
    product: '',
    target: '',
    channels: [] as string[],
    tone: 'profesional',
    budget: ''
  })

  const addTraceEvent = (type: TraceEvent['type'], message: string, details?: string) => {
    const event: TraceEvent = {
      id: `trace-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date(),
      details
    }
    setTraceEvents(prev => [...prev, event])
  }

  const handleRun = async () => {
    if (!formData.product || !formData.target || formData.channels.length === 0) {
      toast.error('Por favor completa los campos obligatorios: Producto, Target y al menos un Canal')
      return
    }

    setState('loading')
    setTraceEvents([])
    setResponse(null)
    setError(null)

    addTraceEvent('started', 'Iniciando workflow de Microsoft Foundry...')

    const briefText = `
Producto/Servicio: ${formData.product}
Público Objetivo: ${formData.target}
Canales: ${formData.channels.join(', ')}
Tono de Marca: ${formData.tone}
Presupuesto: ${formData.budget || 'No especificado'}

Por favor genera una campaña de marketing completa con estrategia, creatividad, contenido y análisis.
`.trim()

    const payload: FoundryPayload = {
      messages: [
        {
          role: 'user',
          content: briefText
        }
      ],
      context: {
        campaignContext: {
          product: formData.product,
          target: formData.target,
          channels: formData.channels,
          brandTone: formData.tone,
          budget: formData.budget
        },
        uiState: {
          view: 'war-room'
        }
      }
    }

    addTraceEvent('calling', 'Llamando a Foundry Agent Orchestrator...', JSON.stringify(payload, null, 2))

    try {
      const result = await runCampaignFlow(payload)
      
      addTraceEvent('done', 'Workflow completado exitosamente')
      
      setResponse(result)
      setState('success')
      
      toast.success('¡Campaña generada con éxito!')
    } catch (err: any) {
      const foundryError = err as FoundryError
      
      addTraceEvent('error', `Error: ${foundryError.message}`, foundryError.recommendation)
      
      setError(foundryError)
      setState('error')
      
      toast.error(foundryError.message)
    }
  }

  const handleCopyPayload = () => {
    const briefText = `
Producto/Servicio: ${formData.product}
Público Objetivo: ${formData.target}
Canales: ${formData.channels.join(', ')}
Tono de Marca: ${formData.tone}
Presupuesto: ${formData.budget || 'No especificado'}
`.trim()

    const payload: FoundryPayload = {
      messages: [{ role: 'user', content: briefText }],
      context: {
        campaignContext: {
          product: formData.product,
          target: formData.target,
          channels: formData.channels,
          brandTone: formData.tone,
          budget: formData.budget
        },
        uiState: { view: 'war-room' }
      }
    }

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast.success('Payload copiado al portapapeles')
  }

  const handleCopyResponse = () => {
    if (!response) return
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    toast.success('Response copiado al portapapeles')
  }

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  const getTraceIcon = (type: TraceEvent['type']) => {
    switch (type) {
      case 'started': return <Clock size={16} weight="fill" className="text-primary" />
      case 'calling': return <Lightning size={16} weight="fill" className="text-accent animate-pulse" />
      case 'done': return <CheckCircle size={16} weight="fill" className="text-success" />
      case 'error': return <XCircle size={16} weight="fill" className="text-destructive" />
    }
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            War Room Command Center
          </h1>
          <p className="text-muted-foreground">
            Microsoft Foundry Marketing Orchestrator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Campaign Brief Form */}
          <div className="lg:col-span-3">
            <Card className="glass-panel p-6 space-y-5 border-2 h-fit sticky top-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={24} weight="fill" className="text-primary" />
                <h2 className="text-xl font-bold">Campaign Brief</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Producto/Servicio *</Label>
                  <Input
                    id="product"
                    value={formData.product}
                    onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
                    placeholder="Ej: Azure ARC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Público Objetivo *</Label>
                  <Textarea
                    id="target"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    placeholder="Ej: CEO, CTO, Responsables de IT"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Canales de Marketing *</Label>
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                    {CHANNELS.map(channel => (
                      <Badge
                        key={channel}
                        variant={formData.channels.includes(channel) ? 'default' : 'outline'}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => toggleChannel(channel)}
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.channels.length} seleccionado{formData.channels.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tono de Marca</Label>
                  <Select value={formData.tone} onValueChange={(val) => setFormData(prev => ({ ...prev, tone: val }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="Ej: 3000€"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* CENTER: Output Cards */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {/* Summary */}
              {response?.summary && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye size={24} weight="fill" className="text-accent" />
                    <h3 className="text-xl font-bold">Summary</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap">{response.summary}</p>
                  </div>
                </Card>
              )}

              {/* Strategy */}
              {response?.campaignPlan?.strategy && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={24} weight="fill" className="text-primary" />
                    <h3 className="text-xl font-bold">Strategy</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(response.campaignPlan.strategy, null, 2)}
                    </pre>
                  </div>
                </Card>
              )}

              {/* Content */}
              {response?.campaignPlan?.content && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} weight="fill" className="text-secondary" />
                    <h3 className="text-xl font-bold">Content</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(response.campaignPlan.content, null, 2)}
                    </pre>
                  </div>
                </Card>
              )}

              {/* Analytics */}
              {response?.campaignPlan?.analytics && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <ChartBar size={24} weight="fill" className="text-accent" />
                    <h3 className="text-xl font-bold">Analytics</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(response.campaignPlan.analytics, null, 2)}
                    </pre>
                  </div>
                </Card>
              )}

              {/* SEO/Visibility */}
              {response?.campaignPlan?.seo && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightning size={24} weight="fill" className="text-primary" />
                    <h3 className="text-xl font-bold">SEO/Visibility</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(response.campaignPlan.seo, null, 2)}
                    </pre>
                  </div>
                </Card>
              )}

              {/* Raw JSON Viewer (fallback) */}
              {response && !response.summary && !response.campaignPlan && (
                <Card className="glass-panel p-6 border-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Info size={24} weight="fill" className="text-muted-foreground" />
                    <h3 className="text-xl font-bold">Raw JSON Response</h3>
                  </div>
                  <details className="space-y-2">
                    <summary className="cursor-pointer font-semibold text-sm hover:text-primary transition-colors">
                      Expandir para ver respuesta completa
                    </summary>
                    <pre className="whitespace-pre-wrap text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto mt-2">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </details>
                </Card>
              )}

              {/* Idle State */}
              {state === 'idle' && (
                <Card className="glass-panel p-12 border-2 text-center">
                  <Lightning size={64} weight="duotone" className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-bold mb-2">Listo para generar</h3>
                  <p className="text-muted-foreground">
                    Completa el brief y presiona "Run" para ejecutar el workflow
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* RIGHT: Run Trace + Controls */}
          <div className="lg:col-span-3">
            <Card className="glass-panel p-6 border-2 h-fit sticky top-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Play size={24} weight="fill" className="text-success" />
                <h2 className="text-xl font-bold">Run Trace</h2>
              </div>

              <Button
                onClick={handleRun}
                disabled={state === 'loading'}
                className="w-full"
                size="lg"
              >
                {state === 'loading' ? (
                  <>
                    <Clock size={20} weight="fill" className="mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={20} weight="fill" className="mr-2" />
                    Run
                  </>
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopyPayload}
                >
                  <Copy size={16} className="mr-1" />
                  Copy Payload
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopyResponse}
                  disabled={!response}
                >
                  <Copy size={16} className="mr-1" />
                  Copy Response
                </Button>
              </div>

              <Separator />

              {/* Trace Events */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {traceEvents.map((event) => (
                    <div key={event.id} className="space-y-1">
                      <div className="flex items-start gap-2">
                        {getTraceIcon(event.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {event.details && (
                        <details className="ml-6 mt-1">
                          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                            Ver detalles
                          </summary>
                          <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
                            {event.details}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}

                  {traceEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">No hay eventos aún</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <XCircle size={16} weight="fill" />
                  <AlertDescription className="text-sm">
                    <p className="font-semibold mb-1">{error.message}</p>
                    {error.recommendation && (
                      <p className="text-xs opacity-90 mt-2">
                        💡 {error.recommendation}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Badge */}
              {state === 'success' && (
                <Alert className="bg-success/10 border-success">
                  <CheckCircle size={16} weight="fill" className="text-success" />
                  <AlertDescription className="text-sm text-success-foreground">
                    Workflow completado exitosamente
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
