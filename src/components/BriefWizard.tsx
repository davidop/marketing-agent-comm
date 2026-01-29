import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lightning, CaretDown, Check, CheckCircle, ArrowRight, ArrowLeft, Info, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { BriefScoreCard } from '@/components/BriefScoreCard'
import type { CampaignBriefData } from '@/lib/types'

interface BriefWizardProps {
  onGenerate: (data: CampaignBriefData) => void
  isGenerating: boolean
  language: 'es' | 'en'
}

const AVAILABLE_CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google Ads' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' }
]

const DEMO_DATA: CampaignBriefData = {
  objective: 'leads',
  kpi: 'Generar 500 MQLs en 3 meses con un CPL < €50',
  segments: 'Directores de IT y CTOs en empresas medianas (50-500 empleados) del sector financiero y retail',
  pains: 'Costos elevados de infraestructura on-premise, complejidad en gestión híbrida cloud, falta de visibilidad centralizada',
  objections: '"Ya tenemos AWS", "Es muy complejo", "No tenemos equipo capacitado"',
  buyingContext: 'Ciclo de compra de 3-6 meses. Decisión en comité. Requieren demo y caso de éxito',
  product: 'Azure ARC - Plataforma de gestión híbrida multi-cloud',
  price: '€500/mes base + €50 por servidor gestionado',
  promo: 'Primer mes gratis + consultoría de implementación sin costo',
  guarantee: 'Garantía de devolución 30 días. SLA 99.9% uptime',
  usp: 'Única solución que unifica gestión de on-premise, AWS, GCP y Azure desde un solo panel',
  channels: ['linkedin', 'email', 'google'],
  budget: '€15,000/mes durante 3 meses',
  timing: 'Q1 2024 - Lanzamiento: 15 enero. Cierre: 31 marzo',
  geography: 'España (Madrid, Barcelona, Valencia). Idioma: Español',
  language: 'es',
  tone: 'Profesional pero accesible. Técnico sin ser intimidante',
  brandVoice: 'Experto cercano. Claridad > Jerga. Enfoque en ROI y simplicidad',
  forbiddenWords: 'revolucionario, disruptivo, mágico, problema, obsoleto',
  allowedClaims: 'Reduce costos hasta 30%, Implementación en 2 semanas, Certificado ISO 27001',
  legalRequirements: 'Incluir link a términos. Mencionar GDPR compliance. Disclaimer de precios sujetos a configuración',
  availableAssets: 'Logo en SVG, Case study BBVA (PDF), Video demo 2min, Screenshots dashboard',
  links: 'Landing: azurearc.example.com, Case study: example.com/bbva, Demo: calendly.com/demo',
  audience: 'Directores de IT y CTOs en empresas medianas (50-500 empleados) del sector financiero y retail',
  goals: 'Generar 500 MQLs en 3 meses con un CPL < €50',
  mainPromise: 'Gestión híbrida multi-cloud unificada que reduce costos 30% y se implementa en 2 semanas',
  proof: [],
  competitors: [],
  timeline: ''
}

export function BriefWizard({ onGenerate, isGenerating, language }: BriefWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isChannelOpen, setIsChannelOpen] = useState(false)
  
  const [formData, setFormData] = useKV<CampaignBriefData>('campaign-brief-data', {
    objective: '',
    kpi: '',
    segments: '',
    pains: '',
    objections: '',
    buyingContext: '',
    product: '',
    price: '',
    promo: '',
    guarantee: '',
    usp: '',
    channels: [],
    budget: '',
    timing: '',
    geography: '',
    language: 'es',
    tone: '',
    brandVoice: '',
    forbiddenWords: '',
    allowedClaims: '',
    legalRequirements: '',
    availableAssets: '',
    links: '',
    audience: '',
    goals: '',
    mainPromise: '',
    proof: [],
    competitors: [],
    timeline: ''
  })

  const steps = language === 'es' 
    ? ['Objetivo', 'Audiencia', 'Oferta', 'Canales', 'Restricciones']
    : ['Objective', 'Audience', 'Offer', 'Channels', 'Restrictions']

  const handleChange = (field: keyof CampaignBriefData, value: any) => {
    setFormData((current) => {
      const base: CampaignBriefData = current || {
        objective: '',
        kpi: '',
        segments: '',
        pains: '',
        objections: '',
        buyingContext: '',
        product: '',
        price: '',
        promo: '',
        guarantee: '',
        usp: '',
        channels: [],
        budget: '',
        timing: '',
        geography: '',
        language: 'es',
        tone: '',
        brandVoice: '',
        forbiddenWords: '',
        allowedClaims: '',
        legalRequirements: '',
        availableAssets: '',
        links: '',
        audience: '',
        goals: '',
        mainPromise: '',
        proof: [],
        competitors: [],
        timeline: '',
        margin: ''
      }
      return { ...base, [field]: value }
    })
  }

  const toggleChannel = (channelValue: string) => {
    setFormData((current) => {
      const base: CampaignBriefData = current || {
        objective: '',
        kpi: '',
        segments: '',
        pains: '',
        objections: '',
        buyingContext: '',
        product: '',
        price: '',
        promo: '',
        guarantee: '',
        usp: '',
        channels: [],
        budget: '',
        timing: '',
        geography: '',
        language: 'es',
        tone: '',
        brandVoice: '',
        forbiddenWords: '',
        allowedClaims: '',
        legalRequirements: '',
        availableAssets: '',
        links: '',
        audience: '',
        goals: '',
        mainPromise: '',
        proof: [],
        competitors: [],
        timeline: '',
        margin: ''
      }
      return {
        ...base,
        channels: base.channels.includes(channelValue)
          ? base.channels.filter(ch => ch !== channelValue)
          : [...base.channels, channelValue]
      }
    })
  }

  const getChannelDisplayText = () => {
    if (!formData || formData.channels.length === 0) {
      return language === 'es' ? 'Selecciona canales...' : 'Select channels...'
    }
    return formData.channels
      .map(ch => AVAILABLE_CHANNELS.find(c => c.value === ch)?.label)
      .filter(Boolean)
      .join(', ')
  }

  const canProceed = () => {
    if (!formData) return false
    if (currentStep === 0) {
      return formData.objective && formData.kpi
    }
    if (currentStep === 1) {
      return formData.segments && formData.pains
    }
    if (currentStep === 2) {
      return formData.product && formData.usp
    }
    if (currentStep === 3) {
      return formData.channels.length > 0 && formData.budget && formData.timing
    }
    return true
  }

  const handleSubmit = () => {
    if (!formData) return
    const mappedData: CampaignBriefData = {
      ...formData,
      audience: formData.segments,
      goals: formData.kpi
    }
    onGenerate(mappedData)
  }

  const loadDemoData = () => {
    setFormData(() => DEMO_DATA)
  }

  const renderTooltip = (content: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info size={16} className="text-muted-foreground hover:text-primary cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  )

  const renderStepContent = () => {
    if (!formData) return null
    
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="objective" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Objetivo de campaña' : 'Campaign Objective'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Leads" si buscas capturar contactos calificados para tu equipo de ventas'
                  : 'Example: "Leads" if you want to capture qualified contacts for your sales team'
                )}
              </div>
              <Select 
                value={formData.objective} 
                onValueChange={(value) => handleChange('objective', value)}
              >
                <SelectTrigger className="glass-panel-hover border-2 rounded-xl w-full">
                  <SelectValue placeholder={language === 'es' ? 'Selecciona objetivo...' : 'Select objective...'} />
                </SelectTrigger>
                <SelectContent className="glass-panel border-2">
                  <SelectItem value="awareness">
                    {language === 'es' ? 'Awareness (Reconocimiento de marca)' : 'Awareness (Brand Recognition)'}
                  </SelectItem>
                  <SelectItem value="leads">
                    {language === 'es' ? 'Leads (Captación de contactos)' : 'Leads (Lead Generation)'}
                  </SelectItem>
                  <SelectItem value="ventas">
                    {language === 'es' ? 'Ventas (Conversión directa)' : 'Sales (Direct Conversion)'}
                  </SelectItem>
                  <SelectItem value="retencion">
                    {language === 'es' ? 'Retención (Fidelización)' : 'Retention (Loyalty)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="kpi" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'KPI Principal' : 'Main KPI'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Generar 500 MQLs en 3 meses con CPL < €50" - Sé específico con números'
                  : 'Example: "Generate 500 MQLs in 3 months with CPL < €50" - Be specific with numbers'
                )}
              </div>
              <Textarea
                id="kpi"
                value={formData.kpi}
                onChange={(e) => handleChange('kpi', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., Generar 500 MQLs en 3 meses con CPL < €50'
                  : 'e.g., Generate 500 MQLs in 3 months with CPL < €50'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={3}
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="segments" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Segmentos de audiencia' : 'Audience Segments'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "CTOs en empresas 50-500 empleados del sector fintech en Madrid y Barcelona"'
                  : 'Example: "CTOs in 50-500 employee fintech companies in Madrid and Barcelona"'
                )}
              </div>
              <Textarea
                id="segments"
                value={formData.segments}
                onChange={(e) => handleChange('segments', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., CTOs en empresas medianas del sector fintech'
                  : 'e.g., CTOs in mid-sized fintech companies'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="pains" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Pains (Dolores/Problemas)' : 'Pains (Pain Points)'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Costos elevados de infraestructura, complejidad en gestión, falta de visibilidad"'
                  : 'Example: "High infrastructure costs, management complexity, lack of visibility"'
                )}
              </div>
              <Textarea
                id="pains"
                value={formData.pains}
                onChange={(e) => handleChange('pains', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., Costos elevados de infraestructura, complejidad en gestión'
                  : 'e.g., High infrastructure costs, management complexity'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="objections" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Objeciones comunes' : 'Common Objections'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Ya tenemos AWS", "Es muy complejo", "No tenemos presupuesto ahora"'
                  : 'Example: "We already have AWS", "It\'s too complex", "No budget right now"'
                )}
              </div>
              <Textarea
                id="objections"
                value={formData.objections}
                onChange={(e) => handleChange('objections', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., "Ya tenemos otra solución", "No tenemos presupuesto"'
                  : 'e.g., "We already have another solution", "No budget available"'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="buyingContext" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Contexto de compra' : 'Buying Context'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Ciclo de compra 3-6 meses. Decisión en comité. Requieren demo y caso de éxito"'
                  : 'Example: "3-6 month buying cycle. Committee decision. Require demo and case study"'
                )}
              </div>
              <Textarea
                id="buyingContext"
                value={formData.buyingContext}
                onChange={(e) => handleChange('buyingContext', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., Ciclo largo, decisión en comité, requieren demo'
                  : 'e.g., Long cycle, committee decision, demo required'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="product" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Producto/Servicio' : 'Product/Service'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Azure ARC - Plataforma de gestión híbrida multi-cloud"'
                  : 'Example: "Azure ARC - Multi-cloud hybrid management platform"'
                )}
              </div>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => handleChange('product', e.target.value)}
                placeholder={language === 'es' ? 'ej., Azure ARC - Plataforma de gestión híbrida' : 'e.g., Azure ARC - Hybrid management platform'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="price" className="text-xs uppercase font-bold tracking-wider text-primary">
                    {language === 'es' ? 'Precio' : 'Price'}
                  </Label>
                  {renderTooltip(language === 'es' 
                    ? 'Ejemplo: "€500/mes base + €50 por servidor"'
                    : 'Example: "€500/month base + €50 per server"'
                  )}
                </div>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder={language === 'es' ? 'ej., €500/mes' : 'e.g., €500/month'}
                  className="glass-panel-hover border-2 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="promo" className="text-xs uppercase font-bold tracking-wider text-primary">
                    {language === 'es' ? 'Promoción' : 'Promotion'}
                  </Label>
                  {renderTooltip(language === 'es' 
                    ? 'Ejemplo: "Primer mes gratis + consultoría sin costo"'
                    : 'Example: "First month free + free consultation"'
                  )}
                </div>
                <Input
                  id="promo"
                  value={formData.promo}
                  onChange={(e) => handleChange('promo', e.target.value)}
                  placeholder={language === 'es' ? 'ej., Primer mes gratis' : 'e.g., First month free'}
                  className="glass-panel-hover border-2 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="guarantee" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Garantía' : 'Guarantee'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Garantía de devolución 30 días. SLA 99.9% uptime"'
                  : 'Example: "30-day money-back guarantee. 99.9% uptime SLA"'
                )}
              </div>
              <Input
                id="guarantee"
                value={formData.guarantee}
                onChange={(e) => handleChange('guarantee', e.target.value)}
                placeholder={language === 'es' ? 'ej., Garantía 30 días' : 'e.g., 30-day guarantee'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="usp" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'USP / Diferenciador' : 'USP / Differentiator'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Única solución que unifica on-premise, AWS, GCP y Azure desde un solo panel"'
                  : 'Example: "Only solution that unifies on-premise, AWS, GCP and Azure from a single panel"'
                )}
              </div>
              <Textarea
                id="usp"
                value={formData.usp}
                onChange={(e) => handleChange('usp', e.target.value)}
                placeholder={language === 'es' 
                  ? 'ej., Única solución que unifica gestión multi-cloud'
                  : 'e.g., Only solution that unifies multi-cloud management'
                }
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="channels" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Canales de marketing' : 'Marketing Channels'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Selecciona todos los canales donde ejecutarás la campaña'
                  : 'Select all channels where you will run the campaign'
                )}
              </div>
              <Popover open={isChannelOpen} onOpenChange={setIsChannelOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="channels"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isChannelOpen}
                    className={cn(
                      "w-full justify-between font-normal glass-panel-hover border-2 rounded-xl",
                      formData.channels.length === 0 && "text-muted-foreground"
                    )}
                  >
                    <span className="truncate font-medium">{getChannelDisplayText()}</span>
                    <CaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 glass-panel border-2" align="start">
                  <div className="p-2 space-y-1">
                    {AVAILABLE_CHANNELS.map((channel) => (
                      <div
                        key={channel.value}
                        className="flex items-center space-x-2 rounded-xl px-3 py-2 hover:bg-accent/30 cursor-pointer transition-all"
                        onClick={() => toggleChannel(channel.value)}
                      >
                        <Checkbox
                          checked={formData.channels.includes(channel.value)}
                          onCheckedChange={() => toggleChannel(channel.value)}
                          className="pointer-events-none"
                        />
                        <label className="flex-1 text-sm font-semibold cursor-pointer pointer-events-none">
                          {channel.label}
                        </label>
                        {formData.channels.includes(channel.value) && (
                          <Check className="h-4 w-4 text-primary" weight="bold" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="budget" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Presupuesto' : 'Budget'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "€15,000/mes durante 3 meses" - Incluye duración si es relevante'
                  : 'Example: "€15,000/month for 3 months" - Include duration if relevant'
                )}
              </div>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder={language === 'es' ? 'ej., €15,000/mes' : 'e.g., €15,000/month'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="timing" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Timing / Fechas' : 'Timing / Dates'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Q1 2024 - Lanzamiento: 15 enero. Cierre: 31 marzo"'
                  : 'Example: "Q1 2024 - Launch: Jan 15. Close: Mar 31"'
                )}
              </div>
              <Input
                id="timing"
                value={formData.timing}
                onChange={(e) => handleChange('timing', e.target.value)}
                placeholder={language === 'es' ? 'ej., Q1 2024 - Lanzamiento: 15 enero' : 'e.g., Q1 2024 - Launch: Jan 15'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="geography" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Geografía e idioma' : 'Geography & Language'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "España (Madrid, Barcelona). Idioma: Español"'
                  : 'Example: "Spain (Madrid, Barcelona). Language: Spanish"'
                )}
              </div>
              <Input
                id="geography"
                value={formData.geography}
                onChange={(e) => handleChange('geography', e.target.value)}
                placeholder={language === 'es' ? 'ej., España. Idioma: Español' : 'e.g., Spain. Language: Spanish'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tone" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Tono' : 'Tone'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Profesional pero accesible. Técnico sin ser intimidante"'
                  : 'Example: "Professional but accessible. Technical without being intimidating"'
                )}
              </div>
              <Input
                id="tone"
                value={formData.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                placeholder={language === 'es' ? 'ej., Profesional pero accesible' : 'e.g., Professional but accessible'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="brandVoice" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Brand Voice' : 'Brand Voice'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Experto cercano. Claridad > Jerga. Enfoque en ROI y simplicidad"'
                  : 'Example: "Friendly expert. Clarity > Jargon. Focus on ROI and simplicity"'
                )}
              </div>
              <Textarea
                id="brandVoice"
                value={formData.brandVoice}
                onChange={(e) => handleChange('brandVoice', e.target.value)}
                placeholder={language === 'es' ? 'ej., Experto cercano. Enfoque en ROI' : 'e.g., Friendly expert. Focus on ROI'}
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="forbiddenWords" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Palabras prohibidas' : 'Forbidden Words'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "revolucionario, disruptivo, mágico, problema"'
                  : 'Example: "revolutionary, disruptive, magic, problem"'
                )}
              </div>
              <Input
                id="forbiddenWords"
                value={formData.forbiddenWords}
                onChange={(e) => handleChange('forbiddenWords', e.target.value)}
                placeholder={language === 'es' ? 'ej., revolucionario, disruptivo' : 'e.g., revolutionary, disruptive'}
                className="glass-panel-hover border-2 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="allowedClaims" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Claims permitidos' : 'Allowed Claims'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Reduce costos hasta 30%, Implementación en 2 semanas"'
                  : 'Example: "Reduces costs up to 30%, 2-week implementation"'
                )}
              </div>
              <Textarea
                id="allowedClaims"
                value={formData.allowedClaims}
                onChange={(e) => handleChange('allowedClaims', e.target.value)}
                placeholder={language === 'es' ? 'ej., Reduce costos hasta 30%' : 'e.g., Reduces costs up to 30%'}
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="legalRequirements" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Requisitos legales' : 'Legal Requirements'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Incluir link a términos. Mencionar GDPR compliance"'
                  : 'Example: "Include link to terms. Mention GDPR compliance"'
                )}
              </div>
              <Textarea
                id="legalRequirements"
                value={formData.legalRequirements}
                onChange={(e) => handleChange('legalRequirements', e.target.value)}
                placeholder={language === 'es' ? 'ej., Incluir términos y GDPR' : 'e.g., Include terms and GDPR'}
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="availableAssets" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Activos disponibles' : 'Available Assets'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Logo SVG, Case study BBVA (PDF), Video demo 2min"'
                  : 'Example: "SVG logo, BBVA case study (PDF), 2min demo video"'
                )}
              </div>
              <Textarea
                id="availableAssets"
                value={formData.availableAssets}
                onChange={(e) => handleChange('availableAssets', e.target.value)}
                placeholder={language === 'es' ? 'ej., Logo SVG, Case study PDF' : 'e.g., SVG logo, PDF case study'}
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="links" className="text-xs uppercase font-bold tracking-wider text-primary">
                  {language === 'es' ? 'Links relevantes' : 'Relevant Links'}
                </Label>
                {renderTooltip(language === 'es' 
                  ? 'Ejemplo: "Landing: example.com, Demo: calendly.com/demo"'
                  : 'Example: "Landing: example.com, Demo: calendly.com/demo"'
                )}
              </div>
              <Textarea
                id="links"
                value={formData.links}
                onChange={(e) => handleChange('links', e.target.value)}
                placeholder={language === 'es' ? 'ej., Landing: example.com' : 'e.g., Landing: example.com'}
                className="glass-panel-hover resize-none border-2 rounded-xl"
                rows={2}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <BriefScoreCard formData={formData || {} as CampaignBriefData} language={language} />
      
      <Card className="glass-panel p-6 border-2 marketing-shine">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Lightning size={28} weight="fill" className="text-primary float-animate" />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {language === 'es' ? 'Brief de Campaña' : 'Campaign Brief'}
              </span>
            </h2>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDemoData}
              className="rounded-xl border-2 gap-2"
            >
              <Sparkle size={16} weight="fill" />
              {language === 'es' ? 'Demo' : 'Demo'}
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all",
                  idx < currentStep ? "bg-primary text-primary-foreground border-primary" :
                  idx === currentStep ? "bg-accent text-accent-foreground border-accent" :
                  "bg-muted text-muted-foreground border-muted"
                )}>
                  {idx < currentStep ? <CheckCircle size={20} weight="fill" /> : idx + 1}
                </div>
                <span className="text-xs font-bold hidden md:block">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 rounded-xl border-2"
              >
                <ArrowLeft size={18} weight="bold" />
                {language === 'es' ? 'Anterior' : 'Previous'}
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex-1 rounded-xl border-2"
              >
                {language === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRight size={18} weight="bold" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isGenerating || !canProceed()}
                className="flex-1 neon-glow-accent font-bold uppercase tracking-wider rounded-xl py-6 border-2 border-accent/50"
              >
                {isGenerating ? (
                  <span className="animate-pulse">{language === 'es' ? 'Generando...' : 'Generating...'}</span>
                ) : (
                  <>
                    <Lightning size={20} weight="fill" className="sparkle-animate" />
                    {language === 'es' ? 'Generar Campaña' : 'Generate Campaign'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
