import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'
import { BriefWizard } from '@/components/BriefWizard'
import { BrandKitEditor } from '@/components/BrandKitEditor'
import { ModularOutputsPanel } from '@/components/ModularOutputsPanel'
import { VariationLab } from '@/components/VariationLab'
import { WarRoomChat } from '@/components/WarRoomChat'
import { FileText, Palette, Sparkle, Lightning } from '@phosphor-icons/react'
import type { Language } from '@/lib/i18n'
import type { CampaignBriefData, CampaignOutput, CopyVariation, BrandKit } from '@/lib/types'

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
  const [isConnected, setIsConnected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [outputs, setOutputs] = useKV<Partial<CampaignOutput>>('campaign-outputs-v2', {})
  const [copyVariations, setCopyVariations] = useKV<CopyVariation[]>('copy-variations', [])

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
    
    try {
      const lang = language || 'en'
      const isSpanish = lang === 'es'
      const kit = brandKit!
      
      const brandGuidelines = `

BRAND GUIDELINES (APLICA A TODO EL COPY GENERADO):
- Tono: ${kit.tone}
- Nivel de Formalidad: ${kit.formality}/5 (1=muy informal, 5=muy formal)
- Emojis: ${kit.useEmojis ? `Sí, usar estilo ${kit.emojiStyle}` : 'No usar emojis'}
${kit.forbiddenWords.length > 0 ? `- Palabras PROHIBIDAS (nunca usar): ${kit.forbiddenWords.join(', ')}` : ''}
${kit.preferredWords.length > 0 ? `- Palabras PREFERIDAS (usar cuando sea relevante): ${kit.preferredWords.join(', ')}` : ''}
${kit.allowedClaims.length > 0 ? `- Claims PERMITIDOS: ${kit.allowedClaims.join(' | ')}` : ''}
${kit.notAllowedClaims.length > 0 ? `- Claims NO PERMITIDOS (evitar): ${kit.notAllowedClaims.join(' | ')}` : ''}
- CTA Preferido: ${kit.preferredCTA}
${kit.brandExamplesYes.length > 0 ? `\nEjemplos de copy que SÍ representa nuestra marca:\n${kit.brandExamplesYes.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}` : ''}
${kit.brandExamplesNo.length > 0 ? `\nEjemplos de copy que NO representa nuestra marca:\n${kit.brandExamplesNo.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}` : ''}

IMPORTANTE: Todo el copy debe seguir estas directrices de marca.`
      
      // @ts-expect-error - spark global is provided by runtime
      const strategyPrompt = spark.llmPrompt`${isSpanish ? 'Eres un estratega de marketing premium. Crea una estrategia integral para esta campaña:' : 'You are a premium marketing strategist. Create a comprehensive strategy for this campaign:'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}
Objetivos: ${briefData.goals}
Presupuesto: ${briefData.budget}
Canales: ${briefData.channels.join(', ')}
${briefData.price ? `Precio: ${briefData.price}` : ''}
${briefData.mainPromise ? `Promesa Principal: ${briefData.mainPromise}` : ''}

${isSpanish ? 'Incluye: Visión general, posicionamiento, enfoque de audiencia, estrategia por canal, y asignación de presupuesto.' : 'Include: Overview, positioning, audience approach, channel strategy, and budget allocation.'}`

      // @ts-expect-error - spark global is provided by runtime
      const creativeRoutesPrompt = spark.llmPrompt`${isSpanish ? 'Eres un director creativo. Proporciona 4 rutas creativas distintas (ángulos) para esta campaña:' : 'You are a creative director. Provide 4 distinct creative routes (angles) for this campaign:'}
${brandGuidelines}

Producto: ${briefData.product}
Promesa: ${briefData.mainPromise || 'TBD'}
Audiencia: ${briefData.audience}

${isSpanish ? 'Para cada ruta incluye: Nombre del ángulo, concepto central, tono, y ejemplos visuales/verbales.' : 'For each route include: Angle name, core concept, tone, and visual/verbal examples.'}`

      // @ts-expect-error - spark global is provided by runtime
      const funnelPrompt = spark.llmPrompt`${isSpanish ? 'Eres un experto en funnels. Crea un blueprint del funnel completo:' : 'You are a funnel expert. Create a complete funnel blueprint:'}
${brandGuidelines}

Producto: ${briefData.product}
Objetivos: ${briefData.goals}
Canales: ${briefData.channels.join(', ')}

${isSpanish ? 'Mapea cada etapa: Awareness → Consideration → Conversion → Retention. Para cada una: objetivo, contenido, CTA, y métricas.' : 'Map each stage: Awareness → Consideration → Conversion → Retention. For each: objective, content, CTA, and metrics.'}`

      // @ts-expect-error - spark global is provided by runtime
      const paidPackPrompt = spark.llmPrompt`${isSpanish ? 'Eres un especialista en paid media. Crea un pack completo de campañas pagadas:' : 'You are a paid media specialist. Create a complete paid campaigns pack:'}
${brandGuidelines}

Producto: ${briefData.product}
Presupuesto: ${briefData.budget}
Canales: ${briefData.channels.join(', ')}

${isSpanish ? 'Incluye: Estructura de campañas, segmentación, ad copy (3 variaciones de headlines + descripciones), presupuesto por canal, y benchmarks esperados.' : 'Include: Campaign structure, segmentation, ad copy (3 headline variations + descriptions), budget per channel, and expected benchmarks.'}`

      // @ts-expect-error - spark global is provided by runtime
      const landingKitPrompt = spark.llmPrompt`${isSpanish ? 'Eres un experto en landing pages. Crea un kit completo para landing:' : 'You are a landing page expert. Create a complete landing kit:'}
${brandGuidelines}

Producto: ${briefData.product}
Promesa: ${briefData.mainPromise || 'TBD'}
Pruebas: ${briefData.proof?.join(', ') || 'TBD'}

${isSpanish ? 'Incluye: Estructura (hero, beneficios, prueba social, CTA), copy para cada sección, y recomendaciones de diseño.' : 'Include: Structure (hero, benefits, social proof, CTA), copy for each section, and design recommendations.'}`

      // @ts-expect-error - spark global is provided by runtime
      const emailFlowPrompt = spark.llmPrompt`${isSpanish ? 'Diseña un flow automatizado de 5 emails para nutrir leads:' : 'Design an automated 5-email flow to nurture leads:'}
${brandGuidelines}

Producto: ${briefData.product}
Objetivo: ${briefData.goals}

${isSpanish ? 'Para cada email: Subject line, preview text, cuerpo (3-4 párrafos), CTA, y timing (ej. día 1, día 3).' : 'For each email: Subject line, preview text, body (3-4 paragraphs), CTA, and timing (e.g., day 1, day 3).'}`

      // @ts-expect-error - spark global is provided by runtime
      const whatsappFlowPrompt = spark.llmPrompt`${isSpanish ? 'Diseña un flow de WhatsApp automatizado de 4 mensajes:' : 'Design an automated WhatsApp flow of 4 messages:'}
${brandGuidelines}

Producto: ${briefData.product}
Tono: conversacional, profesional

${isSpanish ? 'Para cada mensaje: texto breve (max 2-3 oraciones), emojis apropiados, CTA, y timing.' : 'For each message: brief text (max 2-3 sentences), appropriate emojis, CTA, and timing.'}`

      // @ts-expect-error - spark global is provided by runtime
      const experimentPlanPrompt = spark.llmPrompt`${isSpanish ? 'Crea un plan de experimentos A/B para optimizar esta campaña:' : 'Create an A/B experiment plan to optimize this campaign:'}
${brandGuidelines}

Objetivos: ${briefData.goals}
Presupuesto: ${briefData.budget}

${isSpanish ? 'Identifica 5-6 experimentos clave (headlines, CTAs, landing, segmentación). Para cada uno: hipótesis, variaciones, métrica de éxito, y duración.' : 'Identify 5-6 key experiments (headlines, CTAs, landing, segmentation). For each: hypothesis, variations, success metric, and duration.'}`

      // @ts-expect-error - spark global is provided by runtime
      const utmsPrompt = spark.llmPrompt`${isSpanish ? 'Crea una estructura de tracking completa con UTMs:' : 'Create a complete tracking structure with UTMs:'}

Canales: ${briefData.channels.join(', ')}
Campaña: ${briefData.product}

${isSpanish ? 'Proporciona: Nomenclatura estándar de UTMs, ejemplos de URLs completas para cada canal, y dashboard de KPIs a trackear.' : 'Provide: Standard UTM nomenclature, complete URL examples for each channel, and KPI dashboard to track.'}`

      // @ts-expect-error - spark global is provided by runtime
      const risksPrompt = spark.llmPrompt`${isSpanish ? 'Identifica riesgos y supuestos críticos de esta campaña:' : 'Identify critical risks and assumptions for this campaign:'}

Producto: ${briefData.product}
Presupuesto: ${briefData.budget}
Objetivos: ${briefData.goals}

${isSpanish ? 'Lista 5-6 riesgos principales con: descripción, impacto (alto/medio/bajo), probabilidad, y plan de mitigación. También lista supuestos clave.' : 'List 5-6 main risks with: description, impact (high/medium/low), probability, and mitigation plan. Also list key assumptions.'}`

      // @ts-expect-error - spark global is provided by runtime
      const checklistPrompt = spark.llmPrompt`${isSpanish ? 'Crea un checklist ejecutivo paso a paso para lanzar esta campaña:' : 'Create a step-by-step executive checklist to launch this campaign:'}

Canales: ${briefData.channels.join(', ')}

${isSpanish ? 'Organiza por fases: Pre-lanzamiento, Lanzamiento, Post-lanzamiento. Cada ítem debe ser específico y accionable.' : 'Organize by phases: Pre-launch, Launch, Post-launch. Each item should be specific and actionable.'}`

      // @ts-expect-error - spark global is provided by runtime
      const variationsPrompt = spark.llmPrompt`${isSpanish ? 'Genera 15 variaciones de copy etiquetadas por ángulo estratégico. Devuelve JSON.' : 'Generate 15 copy variations labeled by strategic angle. Return JSON.'}
${brandGuidelines}

Producto: ${briefData.product}
Promesa: ${briefData.mainPromise || briefData.goals}
Audiencia: ${briefData.audience}

${isSpanish ? 'Crea 3 variaciones para cada ángulo: beneficio, urgencia, autoridad, emoción, objeciones.' : 'Create 3 variations for each angle: benefit, urgency, authority, emotion, objections.'}

${isSpanish ? 'Para CADA variación incluye:' : 'For EACH variation include:'}
- angle: ${isSpanish ? '"beneficio" | "urgencia" | "autoridad" | "emocion" | "objeciones"' : '"beneficio" | "urgencia" | "autoridad" | "emocion" | "objeciones"'}
- hook: ${isSpanish ? '(titular impactante, max 12 palabras)' : '(impactful headline, max 12 words)'}
- promise: ${isSpanish ? '(qué obtiene el cliente, 1-2 oraciones)' : '(what the customer gets, 1-2 sentences)'}
- proof: ${isSpanish ? '(evidencia o dato que respalda, 1 oración)' : '(evidence or data that supports, 1 sentence)'}
- cta: ${isSpanish ? '(llamado a la acción, max 5 palabras)' : '(call to action, max 5 words)'}
- risk: ${isSpanish ? '"bajo" | "medio" | "alto" (nivel de riesgo del claim)' : '"bajo" | "medio" | "alto" (claim risk level)'}

${isSpanish ? 'Devuelve un objeto JSON con una propiedad "variations" que contenga el array de 15 objetos.' : 'Return a JSON object with a "variations" property containing the array of 15 objects.'}`

      const [
        strategy,
        creativeRoutes,
        funnelBlueprint,
        paidPack,
        landingKit,
        emailFlow,
        whatsappFlow,
        experimentPlan,
        measurementUtms,
        risks,
        executionChecklist,
        variationsJson
      ] = await Promise.all([
        spark.llm(strategyPrompt),
        spark.llm(creativeRoutesPrompt),
        spark.llm(funnelPrompt),
        spark.llm(paidPackPrompt),
        spark.llm(landingKitPrompt),
        spark.llm(emailFlowPrompt),
        spark.llm(whatsappFlowPrompt),
        spark.llm(experimentPlanPrompt),
        spark.llm(utmsPrompt),
        spark.llm(risksPrompt),
        spark.llm(checklistPrompt),
        spark.llm(variationsPrompt, 'gpt-4o', true)
      ])

      let parsedVariations: CopyVariation[] = []
      try {
        const parsed = JSON.parse(variationsJson)
        parsedVariations = (parsed.variations || []).map((v: any, idx: number) => ({
          id: `var-${idx}`,
          angle: v.angle || 'beneficio',
          hook: v.hook || '',
          promise: v.promise || '',
          proof: v.proof || '',
          cta: v.cta || '',
          risk: v.risk || 'medio'
        }))
      } catch (e) {
        console.error('Failed to parse variations', e)
      }

      const mockCalendar = [
        {
          date: 'Week 1 Day 1',
          platform: briefData.channels[0] || 'Email',
          contentType: 'Launch Announcement',
          objective: 'Awareness',
          funnelPhase: 'awareness' as const,
          cta: 'Learn More',
          format: 'Video',
          description: 'Introduce the product with compelling visuals'
        },
        {
          date: 'Week 1 Day 3',
          platform: briefData.channels[1] || 'LinkedIn',
          contentType: 'Thought Leadership',
          objective: 'Authority Building',
          funnelPhase: 'consideration' as const,
          cta: 'Read Article',
          format: 'Article',
          description: 'Industry insights and expertise'
        },
        {
          date: 'Week 1 Day 5',
          platform: briefData.channels[0] || 'Email',
          contentType: 'Case Study',
          objective: 'Social Proof',
          funnelPhase: 'consideration' as const,
          cta: 'See Results',
          format: 'PDF',
          description: 'Real customer success story'
        },
        {
          date: 'Week 2 Day 2',
          platform: briefData.channels[2] || 'Instagram',
          contentType: 'Product Demo',
          objective: 'Education',
          funnelPhase: 'conversion' as const,
          cta: 'Try Now',
          format: 'Carousel',
          description: 'Step-by-step product walkthrough'
        },
        {
          date: 'Week 2 Day 4',
          platform: briefData.channels[0] || 'Email',
          contentType: 'Limited Offer',
          objective: 'Conversion',
          funnelPhase: 'conversion' as const,
          cta: 'Claim Offer',
          format: 'Email',
          description: 'Time-sensitive promotion'
        },
        {
          date: 'Week 2 Day 7',
          platform: briefData.channels[1] || 'LinkedIn',
          contentType: 'Customer Testimonial',
          objective: 'Retention',
          funnelPhase: 'retention' as const,
          cta: 'Join Community',
          format: 'Video',
          description: 'Happy customer sharing experience'
        }
      ]

      setOutputs(() => ({
        strategy,
        creativeRoutes,
        funnelBlueprint,
        paidPack,
        landingKit,
        contentCalendar: mockCalendar,
        emailFlow,
        whatsappFlow,
        experimentPlan,
        measurementUtms,
        risks,
        executionChecklist
      }))

      setCopyVariations(() => parsedVariations)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
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
          <Tabs defaultValue="campaign" className="w-full">
            <TabsList className="glass-panel mb-6 border-2 rounded-xl p-1 w-fit mx-auto">
              <TabsTrigger value="campaign" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Lightning size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Campaña' : 'Campaign'}
              </TabsTrigger>
              <TabsTrigger value="brandkit" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Palette size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Brand Kit' : 'Brand Kit'}
              </TabsTrigger>
              <TabsTrigger value="variations" className="text-sm font-bold rounded-lg px-6 py-2 data-[state=active]:neon-glow">
                <Sparkle size={18} weight="fill" className="mr-2" />
                {language === 'es' ? 'Variation Lab' : 'Variation Lab'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaign" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                  <BriefWizard 
                    onGenerate={handleGenerateCampaign}
                    isGenerating={isGenerating}
                    language={language || 'es'}
                  />
                </div>
                
                <div className="lg:col-span-6">
                  <ModularOutputsPanel 
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
          </Tabs>
        </main>
      </div>
    </div>
  )
}

export default App