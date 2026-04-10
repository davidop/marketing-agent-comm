import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'
import { BriefWizard } from '@/components/BriefWizard'
import { BrandKitEditor } from '@/components/BrandKitEditor'
import { CampaignDashboard } from '@/components/CampaignDashboard'
import { VariationLab } from '@/components/VariationLab'
import { WarRoomChat } from '@/components/WarRoomChat'
import { WarRoomCommandCenter } from '@/components/WarRoomCommandCenter'
import { ContentSafetyReviewer } from '@/components/ContentSafetyReviewer'
import { OrchestratorDemo } from '@/components/OrchestratorDemo'
import DemoBriefSelector from '@/components/DemoBriefSelector'
import { DraggableSectionWrapper } from '@/components/DraggableSectionWrapper'
import { FileText, Palette, Sparkle, Lightning, ShieldCheck, Robot, Crosshair } from '@phosphor-icons/react'
import type { Language } from '@/lib/i18n'
import type { CampaignBriefData, CampaignOutput, CopyVariation, BrandKit, FlowSequence, ContentCalendarItem } from '@/lib/types'

function App() {
  const [theme, setTheme] = useKV<string>('theme', 'light')
  const [language, setLanguage] = useKV<Language>('language', 'es')
  const [brandKit] = useKV<BrandKit>('brand-kit-v2', {
    tone: 'profesional',
    formality: 3,
    useEmojis: false,
    emojiStyle: 'moderados',
    forbiddenWords: [],
    preferredWords: [],
    allowedClaims: [],
    notAllowedClaims: [],
    brandExamplesYes: [],
    brandExamplesNo: [],
    preferredCTA: 'contacta'
  })
  const [currentBrief, setCurrentBrief] = useKV<CampaignBriefData | null>('current-brief', null)
  const [isConnected, setIsConnected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [outputs, setOutputs] = useKV<Partial<CampaignOutput>>('campaign-outputs-v2', {})
  const [copyVariations, setCopyVariations] = useKV<CopyVariation[]>('copy-variations', [])
  
  const [leftColumnOrder, setLeftColumnOrder] = useKV<string[]>('left-column-order-v2', ['brief-wizard', 'demo-brief'])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsConnected(true)
      } catch {
        setIsConnected(false)
      }
    }
    checkConnection()
  }, [])

  const handleThemeToggle = () => {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }

  const handleLanguageToggle = () => {
    setLanguage((current) => current === 'es' ? 'en' : 'es')
  }

  const handleGenerateCampaign = async (briefData: CampaignBriefData) => {
    setIsGenerating(true)
    setCurrentBrief(() => briefData)
    
    try {
      const lang = language || 'en'
      const isSpanish = lang === 'es'
      const kit = brandKit!
      

      // Build composite brief text with all fields + brand guidelines
      const briefText = [
        `BRIEF DE CAMPAÑA:`,
        `Producto: ${briefData.product}`,
        briefData.sector ? `Sector: ${briefData.sector}` : '',
        `Audiencia: ${briefData.audience}`,
        `Objetivos: ${briefData.goals}`,
        `KPI: ${briefData.kpi}`,
        `Presupuesto: ${briefData.budget}`,
        `Canales: ${briefData.channels.join(', ')}`,
        briefData.price ? `Precio: ${briefData.price}` : '',
        briefData.mainPromise ? `Promesa Principal: ${briefData.mainPromise}` : '',
        briefData.usp ? `USP: ${briefData.usp}` : '',
        briefData.segments ? `Segmentos: ${briefData.segments}` : '',
        briefData.pains ? `Pains: ${briefData.pains}` : '',
        briefData.objections ? `Objeciones: ${briefData.objections}` : '',
        briefData.buyingContext ? `Contexto de compra: ${briefData.buyingContext}` : '',
        briefData.promo ? `Promoción: ${briefData.promo}` : '',
        briefData.guarantee ? `Garantía: ${briefData.guarantee}` : '',
        briefData.timing ? `Timing: ${briefData.timing}` : '',
        briefData.geography ? `Geografía: ${briefData.geography}` : '',
        briefData.tone ? `Tono: ${briefData.tone}` : '',
        briefData.brandVoice ? `Voz de Marca: ${briefData.brandVoice}` : '',
        briefData.forbiddenWords ? `Palabras prohibidas: ${briefData.forbiddenWords}` : '',
        briefData.allowedClaims ? `Claims permitidos: ${briefData.allowedClaims}` : '',
        briefData.legalRequirements ? `Requisitos legales: ${briefData.legalRequirements}` : '',
        briefData.availableAssets ? `Assets disponibles: ${briefData.availableAssets}` : '',
        briefData.links ? `Links: ${briefData.links}` : '',
        briefData.proof ? `Pruebas/Social proof: ${briefData.proof.join(', ')}` : '',
        briefData.competitors ? `Competidores: ${briefData.competitors.join(', ')}` : '',
        briefData.margin ? `Margen: ${briefData.margin}` : '',
        '',
        `BRAND KIT:`,
        `- Tono: ${kit.tone}`,
        `- Formalidad: ${kit.formality}/5`,
        `- Emojis: ${kit.useEmojis ? kit.emojiStyle : 'No'}`,
        kit.forbiddenWords.length > 0 ? `- Palabras prohibidas: ${kit.forbiddenWords.join(', ')}` : '',
        kit.preferredWords.length > 0 ? `- Palabras preferidas: ${kit.preferredWords.join(', ')}` : '',
        kit.allowedClaims.length > 0 ? `- Claims permitidos: ${kit.allowedClaims.join(', ')}` : '',
        kit.notAllowedClaims.length > 0 ? `- Claims NO permitidos: ${kit.notAllowedClaims.join(', ')}` : '',
        `- CTA preferido: ${kit.preferredCTA}`,
        kit.brandExamplesYes.length > 0 ? `- Ejemplos de copy SÍ: ${kit.brandExamplesYes.join(' | ')}` : '',
        kit.brandExamplesNo.length > 0 ? `- Ejemplos de copy NO: ${kit.brandExamplesNo.join(' | ')}` : '',
      ].filter(Boolean).join('\n')

      // Call Foundry workflow via proxy
      const generateUrl = import.meta.env.VITE_GENERATE_ENDPOINT || '/api/generate'
      const response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefText, language: lang }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || `Generation failed (${response.status})`)
      }

      const { text: fullText } = await response.json()
      console.log('[Generate] Received', fullText.length, 'chars from Foundry workflow')

      // --- Parse the monolithic workflow response into sections ---

      // Helper: extract a JSON block from text
      const extractJson = (text: string): string | null => {
        const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
        if (codeBlockMatch) return codeBlockMatch[1].trim()
        const firstBrace = text.indexOf('{')
        const firstBracket = text.indexOf('[')
        if (firstBrace === -1 && firstBracket === -1) return null
        const startChar = firstBrace === -1 ? '[' : firstBracket === -1 ? '{' : (firstBrace < firstBracket ? '{' : '[')
        const endChar = startChar === '{' ? '}' : ']'
        const startIdx = startChar === '{' ? firstBrace : firstBracket
        let depth = 0
        let inString = false
        let escape = false
        for (let i = startIdx; i < text.length; i++) {
          const c = text[i]
          if (escape) { escape = false; continue }
          if (c === '\\') { escape = true; continue }
          if (c === '"') { inString = !inString; continue }
          if (inString) continue
          if (c === startChar) depth++
          else if (c === endChar) { depth--; if (depth === 0) return text.slice(startIdx, i + 1) }
        }
        return null
      }

      // Split response into sections by ## headings
      const sections: Record<string, string> = {}
      const sectionRegex = /^##\s+(\d+\.?\s*)?(.*?)$/gm
      let match: RegExpExecArray | null

      const headings: { key: string; index: number }[] = []
      while ((match = sectionRegex.exec(fullText)) !== null) {
        headings.push({ key: match[2].trim().toLowerCase(), index: match.index })
      }

      for (let i = 0; i < headings.length; i++) {
        if (i === 0 && headings[0].index > 0) {
          sections['_preamble'] = fullText.slice(0, headings[0].index).trim()
        }
        const contentStart = fullText.indexOf('\n', headings[i].index) + 1
        const contentEnd = i + 1 < headings.length ? headings[i + 1].index : fullText.length
        sections[headings[i].key] = fullText.slice(contentStart, contentEnd).trim()
      }

      if (headings.length === 0) {
        sections['full'] = fullText
      }

      console.log('[Generate] Parsed sections:', Object.keys(sections))

      // --- Map sections to CampaignOutput fields ---

      const findSection = (...keywords: string[]): string | undefined => {
        for (const [key, val] of Object.entries(sections)) {
          for (const kw of keywords) {
            if (key.includes(kw)) return val
          }
        }
        return undefined
      }

      // Overview
      const overviewText = findSection('overview', 'executive', 'resumen', 'summary') || ''
      const parseOverview = (text: string) => {
        const lines = text.split('\n')
        let objective = '', kpi = '', primaryAudience = '', valueProposition = ''
        let mainMessage = '', recommendedCTA = ''
        const rtbs: string[] = [], launchPriority: string[] = [], tbds: string[] = [], risks: string[] = []
        let currentSection = ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('OBJETIVO:')) objective = trimmed.replace('OBJETIVO:', '').trim()
          else if (trimmed.startsWith('KPI:')) kpi = trimmed.replace('KPI:', '').trim()
          else if (trimmed.startsWith('AUDIENCIA PRIMARIA:')) primaryAudience = trimmed.replace('AUDIENCIA PRIMARIA:', '').trim()
          else if (trimmed.startsWith('PROPUESTA DE VALOR:')) valueProposition = trimmed.replace('PROPUESTA DE VALOR:', '').trim()
          else if (trimmed.startsWith('MENSAJE PRINCIPAL:')) mainMessage = trimmed.replace('MENSAJE PRINCIPAL:', '').trim()
          else if (trimmed.startsWith('CTA RECOMENDADO:')) recommendedCTA = trimmed.replace('CTA RECOMENDADO:', '').trim()
          else if (/^RTBs?:/i.test(trimmed)) currentSection = 'rtbs'
          else if (/^QU[ÉE] LANZAR PRIMERO:/i.test(trimmed)) currentSection = 'launch'
          else if (trimmed.startsWith('ALERTAS:')) currentSection = 'alerts'
          else if (/^TBDs?:/i.test(trimmed)) currentSection = 'tbds'
          else if (trimmed.startsWith('RIESGOS:')) currentSection = 'risks'
          else if (/^\d+\./.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s*/, '')
            if (currentSection === 'rtbs') rtbs.push(content)
            else if (currentSection === 'launch') launchPriority.push(content)
          } else if (trimmed.startsWith('-') && currentSection === 'tbds') {
            tbds.push(trimmed.replace(/^-\s*/, ''))
          } else if (trimmed.startsWith('-') && currentSection === 'risks') {
            risks.push(trimmed.replace(/^-\s*/, ''))
          }
        }

        if (!objective && !mainMessage) {
          return {
            objective: briefData.goals || 'Por definir',
            kpi: briefData.kpi || 'Por definir',
            primaryAudience: briefData.audience || 'Por definir',
            valueProposition: briefData.mainPromise || text.slice(0, 200),
            mainMessage: text.slice(0, 300),
            rtbs: [],
            recommendedCTA: kit.preferredCTA || 'Por definir',
            launchPriority: [],
            alerts: { tbds: [], risks: [] }
          }
        }

        return {
          objective: objective || 'Por definir',
          kpi: kpi || 'Por definir',
          primaryAudience: primaryAudience || 'Por definir',
          valueProposition: valueProposition || 'Por definir',
          mainMessage: mainMessage || 'Por definir',
          rtbs,
          recommendedCTA: recommendedCTA || 'Por definir',
          launchPriority,
          alerts: { tbds, risks }
        }
      }
      const overviewData = parseOverview(overviewText)

      // Strategy
      const strategy = findSection('strateg', 'comunicaci', 'communication') || findSection('social media', 'plan de medios') || ''

      // Creative Routes
      const creativeRoutesText = findSection('creative', 'creativ', 'ruta') || ''
      let parsedCreativeRoutes: any = creativeRoutesText
      try {
        const jsonStr = extractJson(creativeRoutesText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.routes && Array.isArray(parsed.routes)) parsedCreativeRoutes = parsed.routes
          else if (Array.isArray(parsed)) parsedCreativeRoutes = parsed
        }
      } catch (e) { console.warn('[Generate] Creative routes JSON parse failed, using text', e) }

      // Funnel Blueprint
      const funnelText = findSection('funnel', 'embudo') || ''
      let parsedFunnelBlueprint: any = funnelText
      try {
        const jsonStr = extractJson(funnelText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.phases && Array.isArray(parsed.phases)) parsedFunnelBlueprint = parsed.phases
          else if (Array.isArray(parsed)) parsedFunnelBlueprint = parsed
        }
      } catch (e) { console.warn('[Generate] Funnel JSON parse failed, using text', e) }

      // Paid Pack
      const paidPackText = findSection('paid', 'media pack', 'pauta') || ''
      let parsedPaidPack: any = paidPackText
      try {
        const jsonStr = extractJson(paidPackText)
        if (jsonStr) parsedPaidPack = JSON.parse(jsonStr)
      } catch (e) { console.warn('[Generate] Paid pack JSON parse failed, using text', e) }

      // Landing Kit
      const landingKitText = findSection('landing', 'página de aterrizaje') || ''
      let parsedLandingKit: any = landingKitText
      try {
        const jsonStr = extractJson(landingKitText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.sections && parsed.formMicrocopy) parsedLandingKit = parsed
        }
      } catch (e) { console.warn('[Generate] Landing kit JSON parse failed, using text', e) }

      // Content Calendar
      const calendarText = findSection('calendar', 'calendario') || ''
      let parsedContentCalendar: ContentCalendarItem[] = []
      try {
        const jsonStr = extractJson(calendarText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.items && Array.isArray(parsed.items)) parsedContentCalendar = parsed.items
          else if (Array.isArray(parsed)) parsedContentCalendar = parsed
        }
      } catch (e) { console.warn('[Generate] Calendar JSON parse failed', e) }

      // Flows
      const parseFlowSequence = (jsonString: string, sequenceId: string, sequenceName: string, sequenceType: 'bienvenida' | 'nurturing' | 'winback', sequenceDescription: string) => {
        try {
          const jsonStr = extractJson(jsonString)
          if (!jsonStr) return null
          const parsed = JSON.parse(jsonStr)
          if (parsed.messages && Array.isArray(parsed.messages)) {
            return {
              id: sequenceId,
              name: sequenceName,
              type: sequenceType,
              description: sequenceDescription,
              totalMessages: parsed.messages.length,
              messages: parsed.messages.map((msg: any) => ({
                id: msg.id || `${sequenceId}-${Math.random().toString(36).substr(2, 9)}`,
                channel: msg.channel || 'email',
                subject: msg.subject,
                firstLine: msg.firstLine,
                body: msg.body || '',
                cta: msg.cta || '',
                objective: msg.objective || '',
                timing: msg.timing || ''
              }))
            }
          }
        } catch (e) { console.warn(`[Generate] Flow ${sequenceName} parse failed`, e) }
        return null
      }

      const flowSequences: FlowSequence[] = []
      const flowsText = findSection('flow', 'secuencia', 'automation', 'automatizaci') || ''

      const bienvenidaFlow = parseFlowSequence(
        flowsText, 'flow-bienvenida',
        isSpanish ? 'Bienvenida / Lead Magnet' : 'Welcome / Lead Magnet',
        'bienvenida',
        isSpanish ? 'Secuencia de bienvenida' : 'Welcome sequence'
      )
      if (bienvenidaFlow) flowSequences.push(bienvenidaFlow)

      const emailFlow = findSection('email') || ''
      const whatsappFlow = findSection('whatsapp') || ''

      // Experiments
      const experimentPlan = findSection('experiment', 'testing', 'a/b') || ''

      // Measurement & UTMs
      const measurementText = findSection('measurement', 'medici', 'utm', 'tracking') || ''
      let parsedMeasurementUtms: any = measurementText
      try {
        const jsonStr = extractJson(measurementText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.kpisByPhase && parsed.utmTemplate) parsedMeasurementUtms = parsed
        }
      } catch (e) { console.warn('[Generate] Measurement UTMs JSON parse failed, using text', e) }

      // Risks & Assumptions
      const risksText = findSection('risk', 'riesgo', 'supuesto', 'assumption') || ''
      let parsedRisks: any = risksText
      try {
        const jsonStr = extractJson(risksText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.assumptions && parsed.risks) parsedRisks = parsed
        }
      } catch (e) { console.warn('[Generate] Risks JSON parse failed, using text', e) }

      // Execution Checklist
      const checklistText = findSection('checklist', 'ejecuci', 'execution', 'tareas') || ''
      let parsedExecutionChecklist: any = checklistText
      try {
        const jsonStr = extractJson(checklistText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          if (parsed.phases && parsed.totalTasks) parsedExecutionChecklist = parsed
        }
      } catch (e) { console.warn('[Generate] Checklist JSON parse failed, using text', e) }

      // Variations
      let parsedVariations: CopyVariation[] = []
      const variationsText = findSection('variation', 'variaci', 'copy') || ''
      try {
        const jsonStr = extractJson(variationsText)
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr)
          const items = parsed.variations || parsed
          if (Array.isArray(items)) {
            parsedVariations = items.map((v: any, idx: number) => ({
              id: `var-${idx}`,
              channel: v.channel || 'Ads',
              objective: v.objective || 'leads',
              angle: v.angle || 'beneficio',
              hookType: v.hookType || 'beneficio',
              hook: v.hook || '',
              promise: v.promise || '',
              proof: v.proof || 'TBD',
              cta: v.cta || '',
              risk: v.risk || 'medio',
              riskReason: v.riskReason || '',
              tone: v.tone || kit.tone || 'profesional'
            }))
          }
        }
      } catch (e) { console.warn('[Generate] Variations JSON parse failed', e) }

      // Fallback: if no structured sections, put full text in strategy
      const hasAnyContent = overviewData.objective !== 'Por definir' || strategy || parsedCreativeRoutes !== creativeRoutesText
      if (!hasAnyContent && fullText.length > 0) {
        console.log('[Generate] No structured sections found, using full text as strategy')
      }

      setOutputs(() => ({
        overview: overviewData,
        strategy: strategy || (hasAnyContent ? '' : fullText),
        creativeRoutes: parsedCreativeRoutes,
        funnelBlueprint: parsedFunnelBlueprint,
        paidPack: parsedPaidPack,
        landingKit: parsedLandingKit,
        contentCalendar: parsedContentCalendar,
        emailFlow,
        whatsappFlow,
        flows: flowSequences.length > 0 ? flowSequences : undefined,
        experimentPlan,
        measurementUtms: parsedMeasurementUtms,
        risks: parsedRisks,
        executionChecklist: parsedExecutionChecklist
      }))

      setCopyVariations(() => parsedVariations)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const newOrder = [...(leftColumnOrder || [])]
    const [removed] = newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, removed)
    setLeftColumnOrder(() => newOrder)
  }

  const renderLeftColumnSection = (sectionId: string) => {
    switch (sectionId) {
      case 'brief-wizard':
        return (
          <BriefWizard 
            onGenerate={handleGenerateCampaign}
            isGenerating={isGenerating}
            language={language || 'es'}
          />
        )
      case 'demo-brief':
        return (
          <DemoBriefSelector
            onBriefSelected={(briefData) => {
              setCurrentBrief(() => briefData)
            }}
            language={language || 'es'}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <Toaster />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl float-animate"></div>
      </div>
      
      <div className="relative z-10">
        <Header 
          theme={theme || 'light'}
          onThemeToggle={handleThemeToggle}
          isConnected={isConnected}
          language={language || 'es'}
          onLanguageToggle={handleLanguageToggle}
        />
        
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="warroom" className="w-full">
            <TabsList className="glass-panel mb-6 border-2 rounded-xl p-1 w-fit mx-auto">
              <TabsTrigger value="warroom" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Crosshair size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'War Room' : 'War Room'}
              </TabsTrigger>
              <TabsTrigger value="campaign" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Lightning size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Campaña' : 'Campaign'}
              </TabsTrigger>
              <TabsTrigger value="orchestrator" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Robot size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Orquestador' : 'Orchestrator'}
              </TabsTrigger>
              <TabsTrigger value="brandkit" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Palette size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Brand Kit' : 'Brand Kit'}
              </TabsTrigger>
              <TabsTrigger value="variations" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Sparkle size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Variation Lab' : 'Variation Lab'}
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <ShieldCheck size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Safety Review' : 'Safety Review'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warroom" className="mt-0">
              <WarRoomCommandCenter />
            </TabsContent>

            <TabsContent value="campaign" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  {(leftColumnOrder || []).map((sectionId, index) => (
                    <DraggableSectionWrapper
                      key={sectionId}
                      sectionId={sectionId}
                      index={index}
                      onReorder={handleReorder}
                      isDragging={draggingIndex === index}
                      onDragStart={setDraggingIndex}
                      onDragEnd={() => setDraggingIndex(null)}
                    >
                      {renderLeftColumnSection(sectionId)}
                    </DraggableSectionWrapper>
                  ))}
                </div>
                
                <div className="lg:col-span-6">
                  <CampaignDashboard
                    outputs={outputs || {}}
                    isGenerating={isGenerating}
                    language={language || 'es'}
                    onRegenerateBlock={(blockName) => {
                      console.log('Regenerate:', blockName)
                    }}
                  />
                </div>
                
                <div className="lg:col-span-3">
                  <WarRoomChat 
                    language={language || 'es'}
                    onCommand={(cmd) => {
                      console.log('Command:', cmd)
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orchestrator" className="mt-0">
              <OrchestratorDemo />
            </TabsContent>

            <TabsContent value="brandkit" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <BrandKitEditor language={language || 'es'} />
              </div>
            </TabsContent>

            <TabsContent value="variations" className="mt-0">
              <div className="max-w-7xl mx-auto">
                <VariationLab 
                  variations={copyVariations || []}
                  isGenerating={isGenerating}
                  language={language || 'es'}
                />
              </div>
            </TabsContent>

            <TabsContent value="safety" className="mt-0">
              <div className="max-w-7xl mx-auto space-y-6">
                {outputs && outputs.overview && (
                  <ContentSafetyReviewer
                    content={JSON.stringify(outputs.overview, null, 2)}
                    title={language === 'es' ? 'Revisión: Overview' : 'Review: Overview'}
                    sector={currentBrief?.sector}
                    hasProof={!!currentBrief?.proof && currentBrief.proof.length > 0}
                    brandKit={brandKit}
                    language={language || 'es'}
                  />
                )}

                {outputs && outputs.strategy && (
                  <ContentSafetyReviewer
                    content={outputs.strategy}
                    title={language === 'es' ? 'Revisión: Estrategia' : 'Review: Strategy'}
                    sector={currentBrief?.sector}
                    hasProof={!!currentBrief?.proof && currentBrief.proof.length > 0}
                    brandKit={brandKit}
                    language={language || 'es'}
                  />
                )}

                {outputs && outputs.paidPack && typeof outputs.paidPack === 'object' && (
                  <ContentSafetyReviewer
                    content={JSON.stringify(outputs.paidPack, null, 2)}
                    title={language === 'es' ? 'Revisión: Paid Pack' : 'Review: Paid Pack'}
                    sector={currentBrief?.sector}
                    hasProof={!!currentBrief?.proof && currentBrief.proof.length > 0}
                    brandKit={brandKit}
                    language={language || 'es'}
                  />
                )}

                {copyVariations && copyVariations.length > 0 && (
                  <ContentSafetyReviewer
                    content={copyVariations.map(v => `${v.hook}\n${v.promise}\n${v.cta}`).join('\n\n---\n\n')}
                    title={language === 'es' ? 'Revisión: Variaciones de Copy' : 'Review: Copy Variations'}
                    sector={currentBrief?.sector}
                    hasProof={!!currentBrief?.proof && currentBrief.proof.length > 0}
                    brandKit={brandKit}
                    language={language || 'es'}
                  />
                )}

                {(!outputs || Object.keys(outputs).length === 0) && (
                  <div className="glass-panel p-12 text-center space-y-4">
                    <ShieldCheck size={64} weight="duotone" className="mx-auto text-muted-foreground opacity-50" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {language === 'es' ? 'No hay contenido para revisar' : 'No content to review'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' 
                          ? 'Genera una campaña primero para revisar la seguridad legal del contenido'
                          : 'Generate a campaign first to review legal safety of content'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

export default App