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
import { FileText, Palette, Sparkle, Lightning } from '@phosphor-icons/react'
import type { Language } from '@/lib/i18n'
import type { CampaignBriefData, CampaignOutput, CopyVariation, BrandKit, FlowSequence } from '@/lib/types'

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
      const overviewPrompt = spark.llmPrompt`${isSpanish ? 'Genera un Overview ejecutivo súper escaneable con esta estructura EXACTA:' : 'Generate an executive Overview super scannable with this EXACT structure:'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}
Objetivos: ${briefData.goals}
Presupuesto: ${briefData.budget}
Canales: ${briefData.channels.join(', ')}
${briefData.price ? `Precio: ${briefData.price}` : ''}
${briefData.mainPromise ? `Promesa Principal: ${briefData.mainPromise}` : ''}

${isSpanish ? 'Formato de respuesta (SIGUE ESTE FORMATO EXACTO):' : 'Response format (FOLLOW THIS EXACT FORMAT):'}

OBJETIVO: ${isSpanish ? '[un objetivo claro y específico]' : '[one clear and specific objective]'}
KPI: ${isSpanish ? '[métrica principal a trackear]' : '[main metric to track]'}

AUDIENCIA PRIMARIA: ${isSpanish ? '[descripción del segmento prioritario en 1 línea]' : '[description of priority segment in 1 line]'}

PROPUESTA DE VALOR: ${isSpanish ? '[1 frase única que explica qué obtendrá el cliente]' : '[1 unique sentence explaining what the customer will get]'}

MENSAJE PRINCIPAL: ${isSpanish ? '[1 frase que comunica el core del mensaje de campaña]' : '[1 sentence communicating the core campaign message]'}

RTBs:
1. ${isSpanish ? '[Razón para creer #1]' : '[Reason to believe #1]'}
2. ${isSpanish ? '[Razón para creer #2]' : '[Reason to believe #2]'}
3. ${isSpanish ? '[Razón para creer #3]' : '[Reason to believe #3]'}

CTA RECOMENDADO: ${isSpanish ? '[llamada a la acción clara]' : '[clear call to action]'}

QUÉ LANZAR PRIMERO:
1. ${isSpanish ? '[Acción prioritaria #1]' : '[Priority action #1]'}
2. ${isSpanish ? '[Acción prioritaria #2]' : '[Priority action #2]'}
3. ${isSpanish ? '[Acción prioritaria #3]' : '[Priority action #3]'}

ALERTAS:
TBDs: ${isSpanish ? '[lista de cosas por definir]' : '[list of things to be defined]'}
RIESGOS: ${isSpanish ? '[riesgos identificados]' : '[identified risks]'}`

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
      const creativeRoutesPrompt = spark.llmPrompt`${isSpanish ? 'Eres un director creativo premium. Crea EXACTAMENTE 3 rutas creativas con todos los detalles:' : 'You are a premium creative director. Create EXACTLY 3 creative routes with all details:'}
${brandGuidelines}

Producto: ${briefData.product}
Promesa: ${briefData.mainPromise || 'TBD'}
Audiencia: ${briefData.audience}
Objetivos: ${briefData.goals}

${isSpanish ? 'Devuelve un objeto JSON con una propiedad "routes" que contenga un array de 3 objetos, UNO PARA CADA RUTA.' : 'Return a JSON object with a "routes" property containing an array of 3 objects, ONE FOR EACH ROUTE.'}

${isSpanish ? 'Las 3 rutas deben ser:' : 'The 3 routes must be:'}

RUTA 1 - SEGURA (type: "safe"):
- ${isSpanish ? 'Enfoque: Claridad, directo al punto, sin riesgos' : 'Approach: Clarity, straight to the point, no risks'}
- ${isSpanish ? 'Tono: Profesional, confiable, educativo' : 'Tone: Professional, trustworthy, educational'}
- ${isSpanish ? 'Ideal para: Audiencias conservadoras, B2B, productos complejos' : 'Ideal for: Conservative audiences, B2B, complex products'}

RUTA 2 - ATREVIDA (type: "bold"):
- ${isSpanish ? 'Enfoque: Hook fuerte, disruptivo, provocador' : 'Approach: Strong hook, disruptive, provocative'}
- ${isSpanish ? 'Tono: Urgente, directo, emocional' : 'Tone: Urgent, direct, emotional'}
- ${isSpanish ? 'Ideal para: Mercados saturados, necesitas destacar, audiencia joven' : 'Ideal for: Saturated markets, need to stand out, young audience'}

RUTA 3 - PREMIUM (type: "premium"):
- ${isSpanish ? 'Enfoque: Elegante, aspiracional, exclusivo' : 'Approach: Elegant, aspirational, exclusive'}
- ${isSpanish ? 'Tono: Sofisticado, refinado, inspirador' : 'Tone: Sophisticated, refined, inspiring'}
- ${isSpanish ? 'Ideal para: Productos premium, audiencia de alto poder adquisitivo' : 'Ideal for: Premium products, high-income audience'}

${isSpanish ? 'Para CADA ruta, el objeto debe contener exactamente estas propiedades:' : 'For EACH route, the object must contain exactly these properties:'}

{
  "type": "safe" | "bold" | "premium",
  "bigIdea": "${isSpanish ? '(Una frase de 15-25 palabras que captura el concepto central único de esta ruta)' : '(One sentence of 15-25 words capturing the unique central concept of this route)'}",
  "tagline": "${isSpanish ? '(Un tagline memorable de 5-10 palabras que resume la promesa)' : '(A memorable 5-10 word tagline summarizing the promise)'}",
  "hooks": [
    "${isSpanish ? '(Hook 1: apertura impactante que capte atención inmediata)' : '(Hook 1: impactful opening that captures immediate attention)'}",
    "${isSpanish ? '(Hook 2: variante con ángulo diferente)' : '(Hook 2: variant with different angle)'}",
    "${isSpanish ? '(Hook 3: variante con otro ángulo)' : '(Hook 3: variant with another angle)'}",
    "${isSpanish ? '(Hook 4: variante con otro ángulo)' : '(Hook 4: variant with another angle)'}",
    "${isSpanish ? '(Hook 5: variante con otro ángulo)' : '(Hook 5: variant with another angle)'}"
  ],
  "adExamples": [
    {
      "title": "${isSpanish ? '(Título del anuncio 1, max 60 caracteres)' : '(Ad title 1, max 60 chars)'}",
      "body": "${isSpanish ? '(Cuerpo del anuncio 1, 2-3 frases que desarrollen el hook, expliquen el beneficio y generen deseo)' : '(Ad body 1, 2-3 sentences developing the hook, explaining benefit and generating desire)'}",
      "cta": "${isSpanish ? '(CTA específico, 2-4 palabras)' : '(Specific CTA, 2-4 words)'}"
    },
    "${isSpanish ? '(Repetir estructura para ejemplo 2)' : '(Repeat structure for example 2)'}",
    "${isSpanish ? '(Repetir estructura para ejemplo 3)' : '(Repeat structure for example 3)'}"
  ],
  "risk": "bajo" | "medio" | "alto",
  "whenToUse": "${isSpanish ? '(2-3 frases explicando cuándo esta ruta es la mejor opción: tipo de audiencia, contexto de mercado, objetivos)' : '(2-3 sentences explaining when this route is the best option: audience type, market context, objectives)'}",
  "expectedResults": "${isSpanish ? '(2-3 frases sobre qué métricas/resultados esperar: CTR, conversión, percepción de marca)' : '(2-3 sentences about expected metrics/results: CTR, conversion, brand perception)'}"
}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido con el formato exacto indicado. No añadas texto adicional fuera del JSON.' : 'IMPORTANT: Return ONLY the valid JSON with the exact format indicated. Do not add additional text outside the JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const funnelPrompt = spark.llmPrompt`${isSpanish ? 'Eres un experto en funnels. Crea un blueprint del funnel completo con 4 fases estructuradas.' : 'You are a funnel expert. Create a complete funnel blueprint with 4 structured phases.'}
${brandGuidelines}

Producto: ${briefData.product}
Objetivos: ${briefData.goals}
Canales: ${briefData.channels.join(', ')}
Audiencia: ${briefData.audience}

${isSpanish ? 'Genera EXACTAMENTE 4 fases (Awareness, Consideración, Conversión, Retención).' : 'Generate EXACTLY 4 phases (Awareness, Consideration, Conversion, Retention).'}

${isSpanish ? 'Para CADA fase, el objeto debe contener exactamente estas propiedades:' : 'For EACH phase, the object must contain exactly these properties:'}

{
  "phase": "awareness" | "consideration" | "conversion" | "retention",
  "phaseLabel": "${isSpanish ? '(Nombre de la fase en español/inglés según idioma)' : '(Phase name in Spanish/English per language)'}",
  "objective": "${isSpanish ? '(Objetivo claro de esta fase del funnel, 1-2 frases)' : '(Clear objective of this funnel phase, 1-2 sentences)'}",
  "keyMessage": "${isSpanish ? '(Mensaje clave que comunica al usuario en esta fase, 1 frase)' : '(Key message communicated to user in this phase, 1 sentence)'}",
  "formats": [
    "${isSpanish ? '(Formato 1: tipo de contenido recomendado)' : '(Format 1: recommended content type)'}",
    "${isSpanish ? '(Formato 2)' : '(Format 2)'}",
    "${isSpanish ? '(Formato 3)' : '(Format 3)'}",
    "${isSpanish ? '(Formato 4)' : '(Format 4)'}",
    "${isSpanish ? '(Formato 5)' : '(Format 5)'}"
  ],
  "cta": "${isSpanish ? '(CTA recomendado para esta fase, 2-4 palabras)' : '(Recommended CTA for this phase, 2-4 words)'}",
  "kpis": [
    "${isSpanish ? '(KPI 1: métrica clave para medir éxito)' : '(KPI 1: key metric to measure success)'}",
    "${isSpanish ? '(KPI 2)' : '(KPI 2)'}",
    "${isSpanish ? '(KPI 3)' : '(KPI 3)'}",
    "${isSpanish ? '(KPI 4)' : '(KPI 4)'}",
    "${isSpanish ? '(KPI 5)' : '(KPI 5)'}"
  ],
  "examples": [
    {
      "title": "${isSpanish ? '(Título de pieza tipo 1, específica para el producto/servicio)' : '(Title of example piece 1, specific to product/service)'}",
      "description": "${isSpanish ? '(Descripción detallada de qué es y cómo funciona esta pieza, 2-3 frases)' : '(Detailed description of what this piece is and how it works, 2-3 sentences)'}",
      "format": "${isSpanish ? '(Formato: Video, PDF, Post, Email, etc.)' : '(Format: Video, PDF, Post, Email, etc.)'}"
    },
    {
      "title": "${isSpanish ? '(Título de pieza tipo 2)' : '(Title of example piece 2)'}",
      "description": "${isSpanish ? '(Descripción)' : '(Description)'}",
      "format": "${isSpanish ? '(Formato)' : '(Format)'}"
    }
  ]
}

${isSpanish ? 'Las 4 fases deben ser ESPECÍFICAS para este producto/servicio y audiencia, no genéricas.' : 'The 4 phases must be SPECIFIC for this product/service and audience, not generic.'}

${isSpanish ? 'Devuelve un objeto JSON con una propiedad "phases" que contenga un array de 4 objetos (uno para cada fase).' : 'Return a JSON object with a "phases" property containing an array of 4 objects (one for each phase).'}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido. No añadas texto adicional fuera del JSON.' : 'IMPORTANT: Return ONLY the valid JSON. Do not add additional text outside the JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const paidPackPrompt = spark.llmPrompt`${isSpanish ? 'Eres un especialista en paid media. Crea un pack completo de campañas pagadas en formato JSON estructurado.' : 'You are a paid media specialist. Create a complete paid campaigns pack in structured JSON format.'}
${brandGuidelines}

Producto: ${briefData.product}
Presupuesto: ${briefData.budget}
Canales: ${briefData.channels.join(', ')}
Audiencia: ${briefData.audience}
Objetivo: ${briefData.goals}
${briefData.price ? `Precio: ${briefData.price}` : ''}
${briefData.mainPromise ? `Promesa Principal: ${briefData.mainPromise}` : ''}

${isSpanish ? 'IMPORTANTE: NO inventes claims sin prueba. Si no hay evidencia, marca como "Por validar" o usa lenguaje conservador.' : 'IMPORTANT: DO NOT invent unproven claims. If there is no evidence, mark as "To be validated" or use conservative language.'}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "campaignStructure": [
    {
      "objective": "${isSpanish ? '(Objetivo: Awareness/Consideration/Conversion/Retention)' : '(Objective: Awareness/Consideration/Conversion/Retention)'}",
      "adsets": [
        {
          "name": "${isSpanish ? '(Nombre descriptivo del adset)' : '(Descriptive adset name)'}",
          "audience": "${isSpanish ? '(Tipo de audiencia: fría/lookalike/retargeting)' : '(Audience type: cold/lookalike/retargeting)'}",
          "bidStrategy": "${isSpanish ? '(Estrategia: CPC/CPM/CPA automático)' : '(Strategy: CPC/CPM/Automated CPA)'}",
          "budget": "${isSpanish ? '(Presupuesto diario en euros)' : '(Daily budget in euros)'}"
        }
      ]
    }
  ],
  "audiences": [
    {
      "type": "cold" | "lookalike" | "retargeting",
      "name": "${isSpanish ? '(Nombre de la audiencia)' : '(Audience name)'}",
      "size": "${isSpanish ? '(Tamaño estimado: 50K-200K, etc.)' : '(Estimated size: 50K-200K, etc.)'}",
      "description": "${isSpanish ? '(Descripción de la audiencia)' : '(Audience description)'}",
      "criteria": [
        "${isSpanish ? '(Criterio 1 de segmentación)' : '(Targeting criterion 1)'}",
        "${isSpanish ? '(Criterio 2)' : '(Criterion 2)'}",
        "${isSpanish ? '(Criterio 3)' : '(Criterion 3)'}"
      ]
    }
  ],
  "copyVariants": {
    "hooks": [
      "${isSpanish ? '(Hook 1: apertura impactante, max 10 palabras)' : '(Hook 1: impactful opening, max 10 words)'}",
      "${isSpanish ? '...9 hooks más (total 10)' : '...9 more hooks (total 10)'}"
    ],
    "headlines": [
      "${isSpanish ? '(Headline 1: titular claro y específico, max 60 caracteres)' : '(Headline 1: clear and specific title, max 60 chars)'}",
      "${isSpanish ? '...9 headlines más (total 10)' : '...9 more headlines (total 10)'}"
    ],
    "descriptions": [
      "${isSpanish ? '(Descripción 1: explica beneficio y CTA, 2-3 frases, max 150 caracteres)' : '(Description 1: explain benefit and CTA, 2-3 sentences, max 150 chars)'}",
      "${isSpanish ? '...4 descripciones más (total 5)' : '...4 more descriptions (total 5)'}"
    ]
  },
  "creativeAngles": [
    {
      "angle": "beneficio" | "urgencia" | "autoridad" | "emocion" | "objeciones",
      "description": "${isSpanish ? '(Descripción del ángulo en 1-2 frases)' : '(Angle description in 1-2 sentences)'}",
      "whenToUse": "${isSpanish ? '(Cuándo usar este ángulo: contexto y audiencia)' : '(When to use this angle: context and audience)'}",
      "examples": [
        "${isSpanish ? '(Ejemplo 1 de copy con este ángulo)' : '(Example 1 of copy with this angle)'}",
        "${isSpanish ? '(Ejemplo 2)' : '(Example 2)'}",
        "${isSpanish ? '(Ejemplo 3)' : '(Example 3)'}"
      ]
    }
  ],
  "budgetDistribution": [
    {
      "phase": "${isSpanish ? '(Fase: Testing/Escalado/Optimización/Retargeting)' : '(Phase: Testing/Scaling/Optimization/Retargeting)'}",
      "percentage": ${isSpanish ? '(número del 0-100)' : '(number from 0-100)'},
      "allocation": "${isSpanish ? '(Cantidad en euros)' : '(Amount in euros)'}",
      "reasoning": "${isSpanish ? '(Por qué esta distribución para esta fase)' : '(Why this distribution for this phase)'}"
    }
  ],
  "testPlan": [
    {
      "priority": ${isSpanish ? '(número de prioridad 1, 2, 3...)' : '(priority number 1, 2, 3...)'},
      "testName": "${isSpanish ? '(Nombre del test)' : '(Test name)'}",
      "hypothesis": "${isSpanish ? '(Hipótesis: creemos que X resultará en Y porque Z)' : '(Hypothesis: we believe X will result in Y because Z)'}",
      "variants": [
        "${isSpanish ? '(Variante A)' : '(Variant A)'}",
        "${isSpanish ? '(Variante B)' : '(Variant B)'}"
      ],
      "metric": "${isSpanish ? '(Métrica principal: CTR/CPC/CPA/ROAS)' : '(Main metric: CTR/CPC/CPA/ROAS)'}",
      "duration": "${isSpanish ? '(Duración: 7 días, 14 días, etc.)' : '(Duration: 7 days, 14 days, etc.)'}",
      "reasoning": "${isSpanish ? '(Por qué testear esto primero: impacto potencial y facilidad)' : '(Why test this first: potential impact and ease)'}"
    }
  ],
  "warnings": [
    "${isSpanish ? '(Advertencia si falta información crítica: precio, margen, prueba social, etc.)' : '(Warning if critical info is missing: price, margin, social proof, etc.)'}"
  ]
}

${isSpanish ? 'Genera:' : 'Generate:'}
- ${isSpanish ? '2-3 estructuras de campaña (por objetivo)' : '2-3 campaign structures (by objective)'}
- ${isSpanish ? '3-5 audiencias (al menos 1 fría, 1 lookalike, 1 retargeting)' : '3-5 audiences (at least 1 cold, 1 lookalike, 1 retargeting)'}
- ${isSpanish ? '10 hooks + 10 headlines + 5 descripciones (todos diferentes y específicos para el producto)' : '10 hooks + 10 headlines + 5 descriptions (all different and specific to product)'}
- ${isSpanish ? '5 ángulos creativos (1 para cada tipo: beneficio, urgencia, autoridad, emoción, objeciones)' : '5 creative angles (1 for each type: benefit, urgency, authority, emotion, objections)'}
- ${isSpanish ? '4-5 fases de presupuesto con porcentajes que sumen 100%' : '4-5 budget phases with percentages adding up to 100%'}
- ${isSpanish ? '3-5 tests iniciales priorizados' : '3-5 prioritized initial tests'}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido. No añadas texto adicional fuera del JSON.' : 'IMPORTANT: Return ONLY valid JSON. Do not add additional text outside the JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const landingKitPrompt = spark.llmPrompt`${isSpanish ? 'Eres un experto en landing pages con 10+ años de experiencia. Crea un kit completo y detallado para landing page en formato JSON estructurado.' : 'You are a landing page expert with 10+ years of experience. Create a complete and detailed landing page kit in structured JSON format.'}
${brandGuidelines}

Producto: ${briefData.product}
Promesa Principal: ${briefData.mainPromise || 'TBD'}
Audiencia: ${briefData.audience}
Precio: ${briefData.price || 'TBD'}
Pruebas/Evidencia: ${briefData.proof?.join(', ') || 'TBD'}
Objetivo: ${briefData.goals}
Garantía: ${briefData.guarantee || 'N/A'}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "sections": [
    {
      "sectionName": "Hero",
      "wireframe": "${isSpanish ? '(Describe la estructura visual del Hero: disposición de headline, subheadline, CTA, imagen/video. Usa bullets y formato tipo ASCII art simple si ayuda)' : '(Describe the visual structure of Hero: layout of headline, subheadline, CTA, image/video. Use bullets and simple ASCII art format if it helps)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: Headline + subheadline + CTA completos. Debe ser copy listo para usar)' : '(Option 1: Complete headline + subheadline + CTA. Must be ready-to-use copy)'}",
        "${isSpanish ? '(Opción 2: Variante con diferente ángulo/enfoque)' : '(Option 2: Variant with different angle/approach)'}"
      ]
    },
    {
      "sectionName": "Beneficios",
      "wireframe": "${isSpanish ? '(Describe estructura: cuántos beneficios, formato (cards/lista/iconos), disposición)' : '(Describe structure: how many benefits, format (cards/list/icons), layout)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: Lista completa de beneficios con títulos y descripciones breves)' : '(Option 1: Complete list of benefits with titles and brief descriptions)'}",
        "${isSpanish ? '(Opción 2: Variante con diferente enfoque)' : '(Option 2: Variant with different approach)'}"
      ]
    },
    {
      "sectionName": "Prueba Social",
      "wireframe": "${isSpanish ? '(Describe estructura: testimonios, logos de clientes, cifras, formato)' : '(Describe structure: testimonials, client logos, numbers, format)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: Copy completo de testimonios/cifras/evidencia)' : '(Option 1: Complete copy of testimonials/numbers/evidence)'}",
        "${isSpanish ? '(Opción 2: Variante con diferente presentación)' : '(Option 2: Variant with different presentation)'}"
      ]
    },
    {
      "sectionName": "Manejo de Objeciones",
      "wireframe": "${isSpanish ? '(Describe estructura: FAQ corto, comparativa, garantía)' : '(Describe structure: short FAQ, comparison, guarantee)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: 3-4 objeciones principales con respuestas)' : '(Option 1: 3-4 main objections with answers)'}",
        "${isSpanish ? '(Opción 2: Variante con diferente enfoque)' : '(Option 2: Variant with different approach)'}"
      ]
    },
    {
      "sectionName": "FAQs",
      "wireframe": "${isSpanish ? '(Describe formato: acordeón, dos columnas, etc.)' : '(Describe format: accordion, two columns, etc.)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: 6-10 preguntas frecuentes completas con respuestas)' : '(Option 1: 6-10 complete FAQs with answers)'}",
        "${isSpanish ? '(Opción 2: Variante con preguntas diferentes)' : '(Option 2: Variant with different questions)'}"
      ]
    },
    {
      "sectionName": "CTA Final",
      "wireframe": "${isSpanish ? '(Describe estructura: headline de cierre, refuerzo de urgencia/valor, botón, garantía)' : '(Describe structure: closing headline, urgency/value reinforcement, button, guarantee)'}",
      "copyOptions": [
        "${isSpanish ? '(Opción 1: Copy completo del CTA final)' : '(Option 1: Complete final CTA copy)'}",
        "${isSpanish ? '(Opción 2: Variante con diferente ángulo)' : '(Option 2: Variant with different angle)'}"
      ]
    }
  ],
  "formMicrocopy": {
    "fields": [
      {
        "fieldName": "Nombre",
        "label": "${isSpanish ? '(Label para el campo nombre)' : '(Label for name field)'}",
        "placeholder": "${isSpanish ? '(Placeholder para nombre)' : '(Placeholder for name)'}",
        "errorState": "${isSpanish ? '(Mensaje de error si el campo está vacío o inválido)' : '(Error message if field is empty or invalid)'}",
        "helpText": "${isSpanish ? '(Texto de ayuda opcional)' : '(Optional help text)'}"
      },
      {
        "fieldName": "Email",
        "label": "${isSpanish ? '(Label para email)' : '(Label for email)'}",
        "placeholder": "${isSpanish ? '(Placeholder)' : '(Placeholder)'}",
        "errorState": "${isSpanish ? '(Error si email inválido)' : '(Error if invalid email)'}",
        "helpText": "${isSpanish ? '(Ayuda)' : '(Help)'}"
      },
      {
        "fieldName": "Teléfono",
        "label": "${isSpanish ? '(Label)' : '(Label)'}",
        "placeholder": "${isSpanish ? '(Placeholder)' : '(Placeholder)'}",
        "errorState": "${isSpanish ? '(Error)' : '(Error)'}",
        "helpText": "${isSpanish ? '(Ayuda)' : '(Help)'}"
      },
      {
        "fieldName": "Empresa",
        "label": "${isSpanish ? '(Label)' : '(Label)'}",
        "placeholder": "${isSpanish ? '(Placeholder)' : '(Placeholder)'}",
        "errorState": "${isSpanish ? '(Error)' : '(Error)'}",
        "helpText": "${isSpanish ? '(Ayuda)' : '(Help)'}"
      }
    ],
    "privacyText": "${isSpanish ? '(Texto legal de privacidad completo, cumpliendo RGPD/GDPR si aplica. Debe incluir consentimiento de datos y link a política de privacidad)' : '(Complete privacy legal text, complying with GDPR if applicable. Must include data consent and privacy policy link)'}",
    "submitButton": "${isSpanish ? '(Texto del botón de envío, accionable y específico)' : '(Submit button text, actionable and specific)'}",
    "successMessage": "${isSpanish ? '(Mensaje de confirmación tras envío exitoso)' : '(Confirmation message after successful submission)'}"
  },
  "faqs": [
    {
      "question": "${isSpanish ? '(Pregunta frecuente 1)' : '(FAQ question 1)'}",
      "answer": "${isSpanish ? '(Respuesta clara y completa)' : '(Clear and complete answer)'}"
    },
    "${isSpanish ? '...incluir 6-10 FAQs en total' : '...include 6-10 FAQs in total'}"
  ],
  "trustSignals": [
    {
      "type": "reviews",
      "description": "${isSpanish ? '(Descripción de qué tipo de reviews mostrar: testimonios, rating, cantidad)' : '(Description of what type of reviews to show: testimonials, rating, quantity)'}",
      "recommendation": "${isSpanish ? '(Recomendación específica: dónde colocar, formato, cuántos)' : '(Specific recommendation: where to place, format, how many)'}"
    },
    {
      "type": "logos",
      "description": "${isSpanish ? '(Qué logos de clientes/partners mostrar)' : '(Which client/partner logos to show)'}",
      "recommendation": "${isSpanish ? '(Recomendación)' : '(Recommendation)'}"
    },
    {
      "type": "garantias",
      "description": "${isSpanish ? '(Qué garantías ofrecer: devolución, satisfacción, prueba gratis)' : '(Which guarantees to offer: refund, satisfaction, free trial)'}",
      "recommendation": "${isSpanish ? '(Recomendación)' : '(Recommendation)'}"
    },
    {
      "type": "cifras",
      "description": "${isSpanish ? '(Qué cifras destacar: usuarios, ahorro, ROI, años de experiencia)' : '(Which numbers to highlight: users, savings, ROI, years of experience)'}",
      "recommendation": "${isSpanish ? '(Recomendación)' : '(Recommendation)'}"
    },
    {
      "type": "certificaciones",
      "description": "${isSpanish ? '(Certificaciones, premios, reconocimientos relevantes)' : '(Relevant certifications, awards, recognitions)'}",
      "recommendation": "${isSpanish ? '(Recomendación)' : '(Recommendation)'}"
    },
    {
      "type": "casos",
      "description": "${isSpanish ? '(Casos de éxito/estudios de caso a destacar)' : '(Success cases/case studies to highlight)'}",
      "recommendation": "${isSpanish ? '(Recomendación)' : '(Recommendation)'}"
    }
  ]
}

${isSpanish ? 'IMPORTANTE:' : 'IMPORTANT:'}
- ${isSpanish ? 'Genera copy específico para este producto, no genérico.' : 'Generate specific copy for this product, not generic.'}
- ${isSpanish ? 'Cada opción de copy debe ser completa y lista para usar.' : 'Each copy option must be complete and ready to use.'}
- ${isSpanish ? 'Si faltan datos (precio, prueba social), marca como TBD pero sugiere qué añadir.' : 'If data is missing (price, social proof), mark as TBD but suggest what to add.'}
- ${isSpanish ? 'Los FAQs deben responder objeciones reales de la audiencia.' : 'FAQs must answer real audience objections.'}
- ${isSpanish ? 'Las señales de confianza deben ser específicas y accionables.' : 'Trust signals must be specific and actionable.'}

${isSpanish ? 'Devuelve SOLO el JSON válido con el formato exacto indicado. No añadas texto adicional fuera del JSON.' : 'Return ONLY the valid JSON with the exact format indicated. Do not add additional text outside the JSON.'}`

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
      const flowBienvenidaPrompt = spark.llmPrompt`${isSpanish ? 'Crea una secuencia de Bienvenida / Lead Magnet con EXACTAMENTE 3 mensajes.' : 'Create a Welcome / Lead Magnet sequence with EXACTLY 3 messages.'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}
Promesa Principal: ${briefData.mainPromise || briefData.goals}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "messages": [
    {
      "id": "bienvenida-1",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto del email 1, max 60 caracteres, acogedor y que genere apertura)' : '(Email 1 subject, max 60 chars, welcoming and generating opens)'}",
      "body": "${isSpanish ? '(Cuerpo del mensaje 1: saludo cálido, entrega del lead magnet o recurso, establecer expectativas de qué recibirán. 3-4 párrafos cortos, conversacional)' : '(Message 1 body: warm greeting, deliver lead magnet or resource, set expectations of what they will receive. 3-4 short paragraphs, conversational)'}",
      "cta": "${isSpanish ? '(CTA específico, 2-4 palabras)' : '(Specific CTA, 2-4 words)'}",
      "objective": "${isSpanish ? '(Objetivo: ej. Entregar valor inmediato y generar confianza)' : '(Objective: e.g. Deliver immediate value and generate trust)'}",
      "timing": "${isSpanish ? '(Timing: ej. Inmediato tras suscripción)' : '(Timing: e.g. Immediate after subscription)'}"
    },
    {
      "id": "bienvenida-2",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto del email 2)' : '(Email 2 subject)'}",
      "body": "${isSpanish ? '(Cuerpo del mensaje 2: reforzar valor del recurso, compartir caso de uso o testimonio, invitar a dar siguiente paso)' : '(Message 2 body: reinforce resource value, share use case or testimonial, invite to take next step)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo)' : '(Objective)'}",
      "timing": "${isSpanish ? '(Timing: ej. 2 días después)' : '(Timing: e.g. 2 days later)'}"
    },
    {
      "id": "bienvenida-3",
      "channel": "whatsapp",
      "firstLine": "${isSpanish ? '(Primera línea del mensaje WhatsApp 3, debe captar atención en móvil)' : '(First line of WhatsApp message 3, must capture attention on mobile)'}",
      "body": "${isSpanish ? '(Cuerpo del mensaje 3: recordatorio amigable, destacar beneficio clave, propuesta clara de siguiente acción. Max 2-3 oraciones. Incluir emojis si el Brand Kit lo permite)' : '(Message 3 body: friendly reminder, highlight key benefit, clear next action proposal. Max 2-3 sentences. Include emojis if Brand Kit allows)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo)' : '(Objective)'}",
      "timing": "${isSpanish ? '(Timing: ej. 4 días después)' : '(Timing: e.g. 4 days later)'}"
    }
  ]
}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido. No añadas texto fuera del JSON.' : 'IMPORTANT: Return ONLY valid JSON. Do not add text outside JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const flowNurturingPrompt = spark.llmPrompt`${isSpanish ? 'Crea una secuencia de Nurturing con EXACTAMENTE 4 mensajes.' : 'Create a Nurturing sequence with EXACTLY 4 messages.'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}
Objetivo: ${briefData.goals}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "messages": [
    {
      "id": "nurturing-1",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto educativo, que aporte valor)' : '(Educational subject, providing value)'}",
      "body": "${isSpanish ? '(Cuerpo: contenido educativo sobre el problema que resuelve el producto, sin vender directamente. 3-4 párrafos)' : '(Body: educational content about the problem the product solves, without direct selling. 3-4 paragraphs)'}",
      "cta": "${isSpanish ? '(CTA: ej. Leer artículo completo, Ver caso de estudio)' : '(CTA: e.g. Read full article, See case study)'}",
      "objective": "${isSpanish ? '(Objetivo: Educar y posicionar como experto)' : '(Objective: Educate and position as expert)'}",
      "timing": "${isSpanish ? '(Timing: ej. Semana 1)' : '(Timing: e.g. Week 1)'}"
    },
    {
      "id": "nurturing-2",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto)' : '(Subject)'}",
      "body": "${isSpanish ? '(Cuerpo: compartir caso de éxito o prueba social relevante, mostrar resultados concretos)' : '(Body: share success case or relevant social proof, show concrete results)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo: Generar confianza con prueba social)' : '(Objective: Generate trust with social proof)'}",
      "timing": "${isSpanish ? '(Timing: ej. Semana 2)' : '(Timing: e.g. Week 2)'}"
    },
    {
      "id": "nurturing-3",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto)' : '(Subject)'}",
      "body": "${isSpanish ? '(Cuerpo: explicar cómo funciona la solución, detalles técnicos si es B2B o beneficios específicos si es B2C)' : '(Body: explain how the solution works, technical details if B2B or specific benefits if B2C)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo: Demostrar capacidades y aclarar dudas)' : '(Objective: Demonstrate capabilities and clarify doubts)'}",
      "timing": "${isSpanish ? '(Timing: ej. Semana 3)' : '(Timing: e.g. Week 3)'}"
    },
    {
      "id": "nurturing-4",
      "channel": "whatsapp",
      "firstLine": "${isSpanish ? '(Primera línea)' : '(First line)'}",
      "body": "${isSpanish ? '(Cuerpo: propuesta suave de conversación o demo, sin presión. Tono conversacional. 2-3 oraciones)' : '(Body: soft conversation or demo proposal, no pressure. Conversational tone. 2-3 sentences)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo: Iniciar conversación comercial)' : '(Objective: Start commercial conversation)'}",
      "timing": "${isSpanish ? '(Timing: ej. Semana 4)' : '(Timing: e.g. Week 4)'}"
    }
  ]
}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido. No añadas texto fuera del JSON.' : 'IMPORTANT: Return ONLY valid JSON. Do not add text outside JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const flowWinbackPrompt = spark.llmPrompt`${isSpanish ? 'Crea una secuencia de Winback / Reactivación con EXACTAMENTE 3 mensajes.' : 'Create a Winback / Reactivation sequence with EXACTLY 3 messages.'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "messages": [
    {
      "id": "winback-1",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto nostálgico o que genere curiosidad, ej. Te extrañamos, Algo nuevo para ti)' : '(Nostalgic or curiosity-generating subject, e.g. We miss you, Something new for you)'}",
      "body": "${isSpanish ? '(Cuerpo: reconocer su ausencia de forma empática, recordar valor previo, mencionar novedades o mejoras. 3-4 párrafos)' : '(Body: acknowledge their absence empathetically, remind previous value, mention news or improvements. 3-4 paragraphs)'}",
      "cta": "${isSpanish ? '(CTA: ej. Ver qué hay de nuevo, Retomar)' : '(CTA: e.g. See what is new, Resume)'}",
      "objective": "${isSpanish ? '(Objetivo: Reconectar y generar curiosidad)' : '(Objective: Reconnect and generate curiosity)'}",
      "timing": "${isSpanish ? '(Timing: ej. Tras 30-45 días de inactividad)' : '(Timing: e.g. After 30-45 days of inactivity)'}"
    },
    {
      "id": "winback-2",
      "channel": "email",
      "subject": "${isSpanish ? '(Asunto con incentivo o beneficio exclusivo)' : '(Subject with incentive or exclusive benefit)'}",
      "body": "${isSpanish ? '(Cuerpo: oferta especial de reactivación, beneficio exclusivo para clientes que vuelven, crear urgencia suave)' : '(Body: special reactivation offer, exclusive benefit for returning customers, create soft urgency)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo: Incentivar retorno con oferta)' : '(Objective: Incentivize return with offer)'}",
      "timing": "${isSpanish ? '(Timing: ej. 5 días después del mensaje 1)' : '(Timing: e.g. 5 days after message 1)'}"
    },
    {
      "id": "winback-3",
      "channel": "whatsapp",
      "firstLine": "${isSpanish ? '(Primera línea personal y directa)' : '(Personal and direct first line)'}",
      "body": "${isSpanish ? '(Cuerpo: última oportunidad o recordatorio final, tono amigable pero con cierre claro. Si no responden, avisar que dejarán de recibir mensajes. 2-3 oraciones)' : '(Body: last opportunity or final reminder, friendly tone but clear closure. If no response, notify they will stop receiving messages. 2-3 sentences)'}",
      "cta": "${isSpanish ? '(CTA)' : '(CTA)'}",
      "objective": "${isSpanish ? '(Objetivo: Última oportunidad de reactivación)' : '(Objective: Last reactivation opportunity)'}",
      "timing": "${isSpanish ? '(Timing: ej. 7 días después del mensaje 2)' : '(Timing: e.g. 7 days after message 2)'}"
    }
  ]
}

${isSpanish ? 'IMPORTANTE: Devuelve SOLO el JSON válido. No añadas texto fuera del JSON.' : 'IMPORTANT: Return ONLY valid JSON. Do not add text outside JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const experimentPlanPrompt = spark.llmPrompt`${isSpanish ? 'Crea un plan de experimentos A/B para optimizar esta campaña:' : 'Create an A/B experiment plan to optimize this campaign:'}
${brandGuidelines}

Objetivos: ${briefData.goals}
Presupuesto: ${briefData.budget}

${isSpanish ? 'Identifica 5-6 experimentos clave (headlines, CTAs, landing, segmentación). Para cada uno: hipótesis, variaciones, métrica de éxito, y duración.' : 'Identify 5-6 key experiments (headlines, CTAs, landing, segmentation). For each: hypothesis, variations, success metric, and duration.'}`

      // @ts-expect-error - spark global is provided by runtime
      const measurementUtmsPrompt = spark.llmPrompt`${isSpanish ? 'Crea un plan completo de medición y tracking con UTMs en formato JSON estructurado.' : 'Create a complete measurement and tracking plan with UTMs in structured JSON format.'}
${brandGuidelines}

Producto: ${briefData.product}
Objetivos: ${briefData.goals}
KPI Principal: ${briefData.kpi || 'Por definir'}
Canales: ${briefData.channels.join(', ')}
Presupuesto: ${briefData.budget}
Audiencia: ${briefData.audience}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "kpisByPhase": [
    {
      "phase": "awareness" | "consideration" | "conversion" | "retention",
      "phaseLabel": "${isSpanish ? '(Nombre de la fase en español/inglés)' : '(Phase name in Spanish/English)'}",
      "primaryKPI": "${isSpanish ? '(KPI principal de esta fase, ej: Impresiones, CTR, Conversiones, LTV)' : '(Primary KPI for this phase, e.g.: Impressions, CTR, Conversions, LTV)'}",
      "secondaryKPIs": [
        "${isSpanish ? '(KPI secundario 1)' : '(Secondary KPI 1)'}",
        "${isSpanish ? '(KPI secundario 2)' : '(Secondary KPI 2)'}",
        "${isSpanish ? '(KPI secundario 3)' : '(Secondary KPI 3)'}"
      ],
      "benchmarks": "${isSpanish ? '(Benchmarks del sector o targets esperados, ej: CTR 2-5%, CPL €20-40)' : '(Industry benchmarks or expected targets, e.g.: CTR 2-5%, CPL €20-40)'}",
      "tools": [
        "${isSpanish ? '(Herramienta 1: Google Analytics, Meta Pixel, etc.)' : '(Tool 1: Google Analytics, Meta Pixel, etc.)'}",
        "${isSpanish ? '(Herramienta 2)' : '(Tool 2)'}"
      ]
    }
  ],
  "recommendedEvents": [
    {
      "eventName": "${isSpanish ? '(Nombre del evento, ej: view_content, lead, purchase)' : '(Event name, e.g.: view_content, lead, purchase)'}",
      "eventType": "view_content" | "lead" | "purchase" | "add_to_cart" | "begin_checkout" | "sign_up" | "contact" | "custom",
      "funnelPhase": "${isSpanish ? '(Fase: Awareness, Consideration, Conversion, Retention)' : '(Phase: Awareness, Consideration, Conversion, Retention)'}",
      "description": "${isSpanish ? '(Descripción de qué representa este evento y cuándo se dispara)' : '(Description of what this event represents and when it fires)'}",
      "parameters": [
        "${isSpanish ? '(Parámetro 1: value, currency, item_id, etc.)' : '(Parameter 1: value, currency, item_id, etc.)'}",
        "${isSpanish ? '(Parámetro 2)' : '(Parameter 2)'}"
      ],
      "priority": "critical" | "important" | "nice-to-have"
    }
  ],
  "namingConvention": {
    "structure": "${isSpanish ? '(Estructura de nomenclatura, ej: {objetivo}_{canal}_{audiencia}_{fecha})' : '(Naming structure, e.g.: {objective}_{channel}_{audience}_{date})'}",
    "rules": [
      "${isSpanish ? '(Regla 1: Usar minúsculas y guiones)' : '(Rule 1: Use lowercase and hyphens)'}",
      "${isSpanish ? '(Regla 2: Incluir fecha en formato YYYYMMDD)' : '(Rule 2: Include date in YYYYMMDD format)'}",
      "${isSpanish ? '(Regla 3: Máximo 50 caracteres)' : '(Rule 3: Maximum 50 characters)'}",
      "${isSpanish ? '(Regla 4)' : '(Rule 4)'}"
    ],
    "examples": [
      {
        "campaignType": "${isSpanish ? '(Tipo: Lanzamiento, Retargeting, etc.)' : '(Type: Launch, Retargeting, etc.)'}",
        "exampleName": "${isSpanish ? '(Nombre completo del ejemplo)' : '(Full example name)'}",
        "explanation": "${isSpanish ? '(Explicación de por qué está estructurado así)' : '(Explanation of why it is structured this way)'}"
      }
    ]
  },
  "utmTemplate": {
    "structure": "${isSpanish ? '(Estructura completa: {url_base}?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term})' : '(Complete structure: {base_url}?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term})'}",
    "parameters": [
      {
        "parameter": "source",
        "description": "${isSpanish ? '(Origen del tráfico: facebook, google, email, linkedin, etc.)' : '(Traffic source: facebook, google, email, linkedin, etc.)'}",
        "examples": ["facebook", "google", "linkedin", "email", "instagram"],
        "rules": [
          "${isSpanish ? '(Regla 1 para source)' : '(Rule 1 for source)'}",
          "${isSpanish ? '(Regla 2)' : '(Rule 2)'}"
        ]
      },
      {
        "parameter": "medium",
        "description": "${isSpanish ? '(Tipo de canal: paid, organic, social, email, referral, etc.)' : '(Channel type: paid, organic, social, email, referral, etc.)'}",
        "examples": ["paid", "organic", "social", "email", "referral"],
        "rules": [
          "${isSpanish ? '(Regla 1 para medium)' : '(Rule 1 for medium)'}",
          "${isSpanish ? '(Regla 2)' : '(Rule 2)'}"
        ]
      },
      {
        "parameter": "campaign",
        "description": "${isSpanish ? '(Nombre de la campaña específica)' : '(Specific campaign name)'}",
        "examples": ["${isSpanish ? 'lanzamiento-q1-2024' : 'launch-q1-2024'}", "${isSpanish ? 'black-friday-2024' : 'black-friday-2024'}"],
        "rules": [
          "${isSpanish ? '(Regla 1 para campaign)' : '(Rule 1 for campaign)'}",
          "${isSpanish ? '(Regla 2)' : '(Rule 2)'}"
        ]
      },
      {
        "parameter": "content",
        "description": "${isSpanish ? '(Variante del anuncio o contenido)' : '(Ad or content variant)'}",
        "examples": ["video-hero", "carousel-benefits", "image-testimonial"],
        "rules": [
          "${isSpanish ? '(Regla 1 para content)' : '(Rule 1 for content)'}",
          "${isSpanish ? '(Regla 2)' : '(Rule 2)'}"
        ]
      },
      {
        "parameter": "term",
        "description": "${isSpanish ? '(Palabra clave o segmento de audiencia)' : '(Keyword or audience segment)'}",
        "examples": ["ceo-tech", "marketing-director", "brand-managers"],
        "rules": [
          "${isSpanish ? '(Regla 1 para term)' : '(Rule 1 for term)'}",
          "${isSpanish ? '(Regla 2)' : '(Rule 2)'}"
        ]
      }
    ],
    "exampleUrls": [
      {
        "channel": "${isSpanish ? '(Canal: Facebook, Google, Email, etc.)' : '(Channel: Facebook, Google, Email, etc.)'}",
        "url": "${isSpanish ? '(URL completa con todos los UTMs)' : '(Complete URL with all UTMs)'}",
        "breakdown": "${isSpanish ? '(Explicación de cada parámetro usado en esta URL)' : '(Explanation of each parameter used in this URL)'}"
      }
    ]
  },
  "trackingChecklist": [
    {
      "category": "${isSpanish ? '(Categoría: Configuración inicial, Eventos, Testing, etc.)' : '(Category: Initial setup, Events, Testing, etc.)'}",
      "items": [
        {
          "task": "${isSpanish ? '(Tarea específica a completar)' : '(Specific task to complete)'}",
          "critical": true | false,
          "details": "${isSpanish ? '(Detalles adicionales u observaciones)' : '(Additional details or notes)'}"
        }
      ]
    }
  ]
}

${isSpanish ? 'Genera:' : 'Generate:'}
- ${isSpanish ? '4 fases de KPIs (Awareness, Consideration, Conversion, Retention) con KPI principal, 3-5 secundarios, benchmarks y 2-3 herramientas por fase' : '4 KPI phases (Awareness, Consideration, Conversion, Retention) with primary KPI, 3-5 secondary ones, benchmarks and 2-3 tools per phase'}
- ${isSpanish ? '8-12 eventos recomendados (view_content, lead, purchase, add_to_cart, begin_checkout, sign_up, contact, etc.) con prioridad y parámetros' : '8-12 recommended events (view_content, lead, purchase, add_to_cart, begin_checkout, sign_up, contact, etc.) with priority and parameters'}
- ${isSpanish ? 'Convención de nombres con estructura clara, 4-6 reglas y 3-5 ejemplos' : 'Naming convention with clear structure, 4-6 rules and 3-5 examples'}
- ${isSpanish ? 'Plantilla UTM completa con descripción, ejemplos y reglas para cada parámetro (source, medium, campaign, content, term)' : 'Complete UTM template with description, examples and rules for each parameter (source, medium, campaign, content, term)'}
- ${isSpanish ? '3-5 URLs de ejemplo completas por canal con desglose' : '3-5 complete example URLs per channel with breakdown'}
- ${isSpanish ? 'Checklist de tracking en 5-7 categorías (Configuración inicial, Instalación de píxeles, Eventos críticos, Testing pre-launch, Verificación post-launch, Dashboards, Documentación) con 3-6 tareas por categoría, marcando las críticas' : 'Tracking checklist in 5-7 categories (Initial setup, Pixel installation, Critical events, Pre-launch testing, Post-launch verification, Dashboards, Documentation) with 3-6 tasks per category, marking critical ones'}

${isSpanish ? 'IMPORTANTE:' : 'IMPORTANT:'}
- ${isSpanish ? 'Sé específico para este producto y canales' : 'Be specific for this product and channels'}
- ${isSpanish ? 'Los eventos deben cubrir todo el funnel' : 'Events must cover the entire funnel'}
- ${isSpanish ? 'Los benchmarks deben ser realistas para el sector' : 'Benchmarks must be realistic for the sector'}
- ${isSpanish ? 'La nomenclatura debe ser escalable y consistente' : 'Naming convention must be scalable and consistent'}
- ${isSpanish ? 'El checklist debe ser accionable y práctico' : 'Checklist must be actionable and practical'}

${isSpanish ? 'Devuelve SOLO el JSON válido con el formato exacto indicado. No añadas texto adicional fuera del JSON.' : 'Return ONLY the valid JSON with the exact format indicated. Do not add additional text outside the JSON.'}`

      // @ts-expect-error - spark global is provided by runtime
      const risksPrompt = spark.llmPrompt`${isSpanish ? 'Crea un análisis completo de riesgos y supuestos en formato JSON estructurado.' : 'Create a complete risk and assumptions analysis in structured JSON format.'}
${brandGuidelines}

Producto: ${briefData.product}
Audiencia: ${briefData.audience}
Presupuesto: ${briefData.budget}
Objetivos: ${briefData.goals}
Canales: ${briefData.channels.join(', ')}
${briefData.price ? `Precio: ${briefData.price}` : ''}
${briefData.mainPromise ? `Promesa Principal: ${briefData.mainPromise}` : ''}
${briefData.proof ? `Pruebas: ${briefData.proof.join(', ')}` : ''}

${isSpanish ? 'Devuelve un objeto JSON con esta estructura EXACTA:' : 'Return a JSON object with this EXACT structure:'}

{
  "assumptions": [
    "${isSpanish ? '(Supuesto 1: qué estás asumiendo del brief o del contexto)' : '(Assumption 1: what you are assuming from the brief or context)'}",
    "${isSpanish ? '(Supuesto 2)' : '(Assumption 2)'}",
    "${isSpanish ? '(Supuesto 3)' : '(Assumption 3)'}",
    "${isSpanish ? '(Supuesto 4)' : '(Assumption 4)'}",
    "${isSpanish ? '(Supuesto 5)' : '(Assumption 5)'}"
  ],
  "risks": [
    {
      "description": "${isSpanish ? '(Descripción clara del riesgo #1: qué podría salir mal)' : '(Clear description of risk #1: what could go wrong)'}",
      "impact": "alto" | "medio" | "bajo",
      "probability": "alta" | "media" | "baja",
      "reasoning": "${isSpanish ? '(Por qué este riesgo existe: contexto, factores que lo causan)' : '(Why this risk exists: context, factors causing it)'}"
    },
    {
      "description": "${isSpanish ? '(Riesgo #2)' : '(Risk #2)'}",
      "impact": "alto" | "medio" | "bajo",
      "probability": "alta" | "media" | "baja",
      "reasoning": "${isSpanish ? '(Por qué)' : '(Why)'}"
    },
    "${isSpanish ? '...incluir 5-7 riesgos en total' : '...include 5-7 risks in total'}"
  ],
  "mitigations": [
    {
      "risk": "${isSpanish ? '(Nombre corto del riesgo que se mitiga)' : '(Short name of the risk being mitigated)'}",
      "action": "${isSpanish ? '(Acción concreta para reducir o eliminar el riesgo: qué hacer específicamente)' : '(Concrete action to reduce or eliminate risk: what specifically to do)'}",
      "priority": "alta" | "media" | "baja"
    },
    "${isSpanish ? '...incluir una mitigación por cada riesgo identificado' : '...include one mitigation per identified risk'}"
  ],
  "tbds": [
    {
      "item": "${isSpanish ? '(Dato o información específica que falta, ej: Precio del producto)' : '(Specific missing data or information, e.g.: Product price)'}",
      "why": "${isSpanish ? '(Por qué es importante tener este dato: impacto en la campaña)' : '(Why this data is important: campaign impact)'}",
      "suggestion": "${isSpanish ? '(Sugerencia de cómo obtenerlo o qué asumir mientras tanto)' : '(Suggestion of how to obtain it or what to assume meanwhile)'}"
    },
    "${isSpanish ? '...incluir 3-6 TBDs relevantes' : '...include 3-6 relevant TBDs'}"
  ],
  "recommendations": [
    "${isSpanish ? '(Recomendación general #1 para aumentar probabilidad de éxito)' : '(General recommendation #1 to increase success probability)'}",
    "${isSpanish ? '(Recomendación #2)' : '(Recommendation #2)'}",
    "${isSpanish ? '(Recomendación #3)' : '(Recommendation #3)'}",
    "${isSpanish ? '(Recomendación #4)' : '(Recommendation #4)'}",
    "${isSpanish ? '(Recomendación #5)' : '(Recommendation #5)'}"
  ]
}

${isSpanish ? 'Ejemplos de supuestos:' : 'Examples of assumptions:'}
- ${isSpanish ? 'Asumimos que el público objetivo tiene acceso a redes sociales' : 'We assume target audience has social media access'}
- ${isSpanish ? 'Asumimos que el producto tiene stock suficiente para demanda generada' : 'We assume product has sufficient stock for generated demand'}
- ${isSpanish ? 'Asumimos que el precio es competitivo vs. alternativas' : 'We assume price is competitive vs. alternatives'}

${isSpanish ? 'Ejemplos de riesgos:' : 'Examples of risks:'}
- ${isSpanish ? 'El presupuesto puede ser insuficiente para alcanzar el CPL objetivo en canales paid' : 'Budget may be insufficient to reach target CPL in paid channels'}
- ${isSpanish ? 'La audiencia podría ser demasiado amplia, diluyendo el mensaje' : 'Audience might be too broad, diluting the message'}
- ${isSpanish ? 'Sin prueba social, la conversión puede ser baja' : 'Without social proof, conversion may be low'}

${isSpanish ? 'Ejemplos de TBDs:' : 'Examples of TBDs:'}
- ${isSpanish ? 'Precio del producto no definido → Impacta copy, oferta y targeting' : 'Product price not defined → Impacts copy, offer and targeting'}
- ${isSpanish ? 'No hay testimonios o casos de éxito → Limita credibilidad en landing' : 'No testimonials or success cases → Limits landing credibility'}
- ${isSpanish ? 'ROI esperado o margen no especificado → Dificulta optimización de CPA' : 'Expected ROI or margin not specified → Hinders CPA optimization'}

${isSpanish ? 'IMPORTANTE:' : 'IMPORTANT:'}
- ${isSpanish ? 'Sé realista y específico. No inventes riesgos genéricos.' : 'Be realistic and specific. Do not invent generic risks.'}
- ${isSpanish ? 'Los riesgos deben estar basados en el brief y en el contexto real.' : 'Risks must be based on the brief and real context.'}
- ${isSpanish ? 'Las mitigaciones deben ser accionables, no teóricas.' : 'Mitigations must be actionable, not theoretical.'}
- ${isSpanish ? 'Los TBDs deben señalar huecos reales de información.' : 'TBDs must point to real information gaps.'}

${isSpanish ? 'Devuelve SOLO el JSON válido con el formato exacto indicado. No añadas texto adicional fuera del JSON.' : 'Return ONLY the valid JSON with the exact format indicated. Do not add additional text outside the JSON.'}`

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
        overviewText,
        strategy,
        creativeRoutesJson,
        funnelBlueprintJson,
        paidPackJson,
        landingKit,
        emailFlow,
        whatsappFlow,
        flowBienvenidaJson,
        flowNurturingJson,
        flowWinbackJson,
        experimentPlan,
        measurementUtmsJson,
        risksJson,
        executionChecklist,
        variationsJson
      ] = await Promise.all([
        spark.llm(overviewPrompt),
        spark.llm(strategyPrompt),
        spark.llm(creativeRoutesPrompt, 'gpt-4o', true),
        spark.llm(funnelPrompt, 'gpt-4o', true),
        spark.llm(paidPackPrompt, 'gpt-4o', true),
        spark.llm(landingKitPrompt, 'gpt-4o', true),
        spark.llm(emailFlowPrompt),
        spark.llm(whatsappFlowPrompt),
        spark.llm(flowBienvenidaPrompt, 'gpt-4o', true),
        spark.llm(flowNurturingPrompt, 'gpt-4o', true),
        spark.llm(flowWinbackPrompt, 'gpt-4o', true),
        spark.llm(experimentPlanPrompt),
        spark.llm(measurementUtmsPrompt, 'gpt-4o', true),
        spark.llm(risksPrompt, 'gpt-4o', true),
        spark.llm(checklistPrompt),
        spark.llm(variationsPrompt, 'gpt-4o', true)
      ])

      let parsedCreativeRoutes: any = creativeRoutesJson
      try {
        const parsed = JSON.parse(creativeRoutesJson)
        if (parsed.routes && Array.isArray(parsed.routes)) {
          parsedCreativeRoutes = parsed.routes
        }
      } catch (e) {
        console.error('Failed to parse creative routes JSON, using text fallback', e)
      }

      let parsedFunnelBlueprint: any = funnelBlueprintJson
      try {
        const parsed = JSON.parse(funnelBlueprintJson)
        if (parsed.phases && Array.isArray(parsed.phases)) {
          parsedFunnelBlueprint = parsed.phases
        }
      } catch (e) {
        console.error('Failed to parse funnel blueprint JSON, using text fallback', e)
      }

      let parsedPaidPack: any = paidPackJson
      try {
        const parsed = JSON.parse(paidPackJson)
        parsedPaidPack = parsed
      } catch (e) {
        console.error('Failed to parse paid pack JSON, using text fallback', e)
        parsedPaidPack = paidPackJson
      }

      let parsedLandingKit: any = landingKit
      try {
        const parsed = JSON.parse(landingKit)
        if (parsed.sections && parsed.formMicrocopy && parsed.faqs && parsed.trustSignals) {
          parsedLandingKit = parsed
        }
      } catch (e) {
        console.error('Failed to parse landing kit JSON, using text fallback', e)
        parsedLandingKit = landingKit
      }

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

      const parseFlowSequence = (jsonString: string, sequenceId: string, sequenceName: string, sequenceType: 'bienvenida' | 'nurturing' | 'winback', sequenceDescription: string) => {
        try {
          const parsed = JSON.parse(jsonString)
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
        } catch (e) {
          console.error(`Failed to parse ${sequenceName} flow`, e)
        }
        return null
      }

      const flowSequences: FlowSequence[] = []
      
      const bienvenidaFlow = parseFlowSequence(
        flowBienvenidaJson,
        'flow-bienvenida',
        isSpanish ? 'Bienvenida / Lead Magnet' : 'Welcome / Lead Magnet',
        'bienvenida',
        isSpanish 
          ? 'Secuencia para dar la bienvenida a nuevos leads y entregar valor inmediato'
          : 'Sequence to welcome new leads and deliver immediate value'
      )
      if (bienvenidaFlow) flowSequences.push(bienvenidaFlow)

      const nurturingFlow = parseFlowSequence(
        flowNurturingJson,
        'flow-nurturing',
        isSpanish ? 'Nurturing' : 'Nurturing',
        'nurturing',
        isSpanish
          ? 'Secuencia para educar y construir confianza con leads a lo largo del tiempo'
          : 'Sequence to educate and build trust with leads over time'
      )
      if (nurturingFlow) flowSequences.push(nurturingFlow)

      const winbackFlow = parseFlowSequence(
        flowWinbackJson,
        'flow-winback',
        isSpanish ? 'Winback / Reactivación' : 'Winback / Reactivation',
        'winback',
        isSpanish
          ? 'Secuencia para reactivar leads o clientes inactivos'
          : 'Sequence to reactivate inactive leads or customers'
      )
      if (winbackFlow) flowSequences.push(winbackFlow)

      let parsedMeasurementUtms: any = measurementUtmsJson
      try {
        const parsed = JSON.parse(measurementUtmsJson)
        if (parsed.kpisByPhase && parsed.recommendedEvents && parsed.namingConvention && parsed.utmTemplate && parsed.trackingChecklist) {
          parsedMeasurementUtms = parsed
        }
      } catch (e) {
        console.error('Failed to parse measurement UTMs JSON, using text fallback', e)
        parsedMeasurementUtms = measurementUtmsJson
      }

      let parsedRisks: any = risksJson
      try {
        const parsed = JSON.parse(risksJson)
        if (parsed.assumptions && parsed.risks && parsed.mitigations && parsed.tbds) {
          parsedRisks = parsed
        }
      } catch (e) {
        console.error('Failed to parse risks JSON, using text fallback', e)
        parsedRisks = risksJson
      }

      const parseOverview = (text: string) => {
        const lines = text.split('\n')
        let objective = ''
        let kpi = ''
        let primaryAudience = ''
        let valueProposition = ''
        let mainMessage = ''
        const rtbs: string[] = []
        let recommendedCTA = ''
        const launchPriority: string[] = []
        const tbds: string[] = []
        const risks: string[] = []

        let currentSection = ''
        
        for (const line of lines) {
          const trimmed = line.trim()
          
          if (trimmed.startsWith('OBJETIVO:')) {
            objective = trimmed.replace('OBJETIVO:', '').trim()
          } else if (trimmed.startsWith('KPI:')) {
            kpi = trimmed.replace('KPI:', '').trim()
          } else if (trimmed.startsWith('AUDIENCIA PRIMARIA:')) {
            primaryAudience = trimmed.replace('AUDIENCIA PRIMARIA:', '').trim()
          } else if (trimmed.startsWith('PROPUESTA DE VALOR:')) {
            valueProposition = trimmed.replace('PROPUESTA DE VALOR:', '').trim()
          } else if (trimmed.startsWith('MENSAJE PRINCIPAL:')) {
            mainMessage = trimmed.replace('MENSAJE PRINCIPAL:', '').trim()
          } else if (trimmed.startsWith('CTA RECOMENDADO:')) {
            recommendedCTA = trimmed.replace('CTA RECOMENDADO:', '').trim()
          } else if (trimmed.startsWith('RTBs:') || trimmed.startsWith('RTBS:')) {
            currentSection = 'rtbs'
          } else if (trimmed.startsWith('QUÉ LANZAR PRIMERO:') || trimmed.startsWith('QUE LANZAR PRIMERO:')) {
            currentSection = 'launch'
          } else if (trimmed.startsWith('ALERTAS:')) {
            currentSection = 'alerts'
          } else if (trimmed.startsWith('TBDs:') || trimmed.startsWith('TBDS:')) {
            currentSection = 'tbds'
          } else if (trimmed.startsWith('RIESGOS:')) {
            currentSection = 'risks'
          } else if (trimmed && /^\d+\./.test(trimmed)) {
            const content = trimmed.replace(/^\d+\.\s*/, '')
            if (currentSection === 'rtbs') {
              rtbs.push(content)
            } else if (currentSection === 'launch') {
              launchPriority.push(content)
            }
          } else if (trimmed.startsWith('-') && currentSection === 'tbds') {
            tbds.push(trimmed.replace(/^-\s*/, ''))
          } else if (trimmed.startsWith('-') && currentSection === 'risks') {
            risks.push(trimmed.replace(/^-\s*/, ''))
          }
        }

        return {
          objective: objective || 'Por definir',
          kpi: kpi || 'Por definir',
          primaryAudience: primaryAudience || 'Por definir',
          valueProposition: valueProposition || 'Por definir',
          mainMessage: mainMessage || 'Por definir',
          rtbs: rtbs.length > 0 ? rtbs : [],
          recommendedCTA: recommendedCTA || 'Por definir',
          launchPriority: launchPriority.length > 0 ? launchPriority : [],
          alerts: {
            tbds: tbds.length > 0 ? tbds : [],
            risks: risks.length > 0 ? risks : []
          }
        }
      }

      const overviewData = parseOverview(overviewText)

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
        overview: overviewData,
        strategy,
        creativeRoutes: parsedCreativeRoutes,
        funnelBlueprint: parsedFunnelBlueprint,
        paidPack: parsedPaidPack,
        landingKit: parsedLandingKit,
        contentCalendar: mockCalendar,
        emailFlow,
        whatsappFlow,
        flows: flowSequences.length > 0 ? flowSequences : undefined,
        experimentPlan,
        measurementUtms: parsedMeasurementUtms,
        risks: parsedRisks,
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