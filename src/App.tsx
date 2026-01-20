import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { CampaignBrief } from '@/components/CampaignBrief'
import { OutputsPanel } from '@/components/OutputsPanel'
import { LiveChat } from '@/components/LiveChat'
import type { Language } from '@/lib/i18n'

interface CampaignOutputs {
  strategy: string
  copyA: string
  copyB: string
  calendar: string
  kpis: string
}

function App() {
  const [theme, setTheme] = useKV<string>('theme', 'light')
  const [language, setLanguage] = useKV<Language>('language', 'en')
  const [isConnected, setIsConnected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [outputs, setOutputs] = useKV<CampaignOutputs>('campaign-outputs', {
    strategy: '',
    copyA: '',
    copyB: '',
    calendar: '',
    kpis: ''
  })

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
    setLanguage((current) => current === 'en' ? 'es' : 'en')
  }

  const handleGenerateCampaign = async (briefData: any) => {
    setIsGenerating(true)
    
    try {
      const lang = language || 'en'
      const isSpanish = lang === 'es'
      
      // @ts-expect-error - spark global is provided by runtime
      const strategyPrompt = spark.llmPrompt`${isSpanish ? 'Eres un estratega de marketing experto. Basándote en este brief de campaña, crea una estrategia de marketing integral:' : 'You are an expert marketing strategist. Based on this campaign brief, create a comprehensive marketing strategy:'}

${isSpanish ? 'Producto/Servicio:' : 'Product/Service:'} ${briefData.product}
${isSpanish ? 'Público Objetivo:' : 'Target Audience:'} ${briefData.audience}
${isSpanish ? 'Objetivos de Campaña:' : 'Campaign Goals:'} ${briefData.goals}
${isSpanish ? 'Presupuesto:' : 'Budget:'} ${briefData.budget}
${isSpanish ? 'Canales:' : 'Channels:'} ${briefData.channels}

${isSpanish ? 'Proporciona una estrategia estructurada con estas secciones:' : 'Provide a structured strategy with these sections:'}
${isSpanish ? '- Descripción General (2-3 oraciones)' : '- Overview (2-3 sentences)'}
${isSpanish ? '- Enfoque del Público (insights clave sobre la audiencia)' : '- Target Approach (key insights about the audience)'}
${isSpanish ? '- Estrategia de Canales (cómo usar cada canal efectivamente)' : '- Channel Strategy (how to use each channel effectively)'}
${isSpanish ? '- Asignación de Presupuesto (recomendaciones para el gasto)' : '- Budget Allocation (recommendations for spending)'}

${isSpanish ? 'Mantén todo conciso y accionable. Responde en español.' : 'Keep it concise and actionable.'}`

      // @ts-expect-error - spark global is provided by runtime
      const copyPrompt = spark.llmPrompt`${isSpanish ? 'Eres un copywriter creativo. Crea dos variaciones distintas para prueba A/B para esta campaña:' : 'You are a creative copywriter. Create two distinct A/B test variations for this campaign:'}

${isSpanish ? 'Producto/Servicio:' : 'Product/Service:'} ${briefData.product}
${isSpanish ? 'Público Objetivo:' : 'Target Audience:'} ${briefData.audience}
${isSpanish ? 'Objetivos de Campaña:' : 'Campaign Goals:'} ${briefData.goals}

${isSpanish ? 'Para cada variación (A y B), proporciona:' : 'For each variation (A and B), provide:'}
${isSpanish ? '- Un titular convincente (máx. 10 palabras)' : '- A compelling headline (max 10 words)'}
${isSpanish ? '- Texto del cuerpo (3-4 oraciones)' : '- Body copy (3-4 sentences)'}
${isSpanish ? '- Llamado a la acción (frase corta)' : '- Call-to-action (short phrase)'}

${isSpanish ? 'Haz que la Versión A sea más emocional y la Versión B más racional/factual. Formato:' : 'Make Version A more emotional and Version B more rational/factual. Format as:'}

${isSpanish ? 'VERSIÓN A:' : 'VERSION A:'}
${isSpanish ? 'Titular: [titular]' : 'Headline: [headline]'}
${isSpanish ? 'Cuerpo: [texto del cuerpo]' : 'Body: [body copy]'}
${isSpanish ? 'CTA: [llamado a la acción]' : 'CTA: [call to action]'}

${isSpanish ? 'VERSIÓN B:' : 'VERSION B:'}
${isSpanish ? 'Titular: [titular]' : 'Headline: [headline]'}
${isSpanish ? 'Cuerpo: [texto del cuerpo]' : 'Body: [body copy]'}
${isSpanish ? 'CTA: [llamado a la acción]' : 'CTA: [call to action]'}

${isSpanish ? 'Responde en español.' : ''}`

      // @ts-expect-error - spark global is provided by runtime
      const calendarPrompt = spark.llmPrompt`${isSpanish ? 'Eres un especialista en operaciones de marketing. Crea un calendario de contenidos de 2 semanas para esta campaña:' : 'You are a marketing operations specialist. Create a 2-week content calendar for this campaign:'}

${isSpanish ? 'Producto/Servicio:' : 'Product/Service:'} ${briefData.product}
${isSpanish ? 'Canales:' : 'Channels:'} ${briefData.channels}
${isSpanish ? 'Objetivos de Campaña:' : 'Campaign Goals:'} ${briefData.goals}

${isSpanish ? 'Proporciona un cronograma día a día con:' : 'Provide a day-by-day schedule with:'}
${isSpanish ? '- Fecha (usa Semana 1 Día 1, Día 2, etc.)' : '- Date (use Week 1 Day 1, Day 2, etc.)'}
${isSpanish ? '- Plataforma' : '- Platform'}
${isSpanish ? '- Tipo de Contenido' : '- Content Type'}
${isSpanish ? '- Descripción Breve' : '- Brief Description'}

${isSpanish ? 'Formatea como una lista clara con un elemento por línea. Responde en español.' : 'Format as a clear list with one item per line.'}`

      // @ts-expect-error - spark global is provided by runtime
      const kpiPrompt = spark.llmPrompt`${isSpanish ? 'Eres un experto en analítica de marketing. Recomienda 5-6 KPIs clave para rastrear en esta campaña:' : 'You are a marketing analytics expert. Recommend 5-6 key KPIs to track for this campaign:'}

${isSpanish ? 'Producto/Servicio:' : 'Product/Service:'} ${briefData.product}
${isSpanish ? 'Objetivos de Campaña:' : 'Campaign Goals:'} ${briefData.goals}
${isSpanish ? 'Canales:' : 'Channels:'} ${briefData.channels}
${isSpanish ? 'Presupuesto:' : 'Budget:'} ${briefData.budget}

${isSpanish ? 'Para cada KPI proporciona:' : 'For each KPI provide:'}
${isSpanish ? '- Nombre del KPI' : '- KPI Name'}
${isSpanish ? '- Por qué importa (1 oración)' : '- Why it matters (1 sentence)'}
${isSpanish ? '- Rango objetivo o benchmark' : '- Target range or benchmark'}

${isSpanish ? 'Formatea claramente con un KPI por sección. Responde en español.' : 'Format clearly with one KPI per section.'}`

      const [strategy, copy, calendar, kpis] = await Promise.all([
        spark.llm(strategyPrompt),
        spark.llm(copyPrompt),
        spark.llm(calendarPrompt),
        spark.llm(kpiPrompt)
      ])

      const versionBSeparator = isSpanish ? 'VERSIÓN B:' : 'VERSION B:'
      const versionASeparator = isSpanish ? 'VERSIÓN A:' : 'VERSION A:'
      
      const copyParts = copy.split(versionBSeparator)
      const copyA = copyParts[0].replace(versionASeparator, '').trim()
      const copyB = copyParts[1] ? copyParts[1].trim() : ''

      setOutputs(() => ({
        strategy,
        copyA,
        copyB,
        calendar,
        kpis
      }))
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        theme={theme || 'light'}
        onThemeToggle={handleThemeToggle}
        isConnected={isConnected}
        language={language || 'en'}
        onLanguageToggle={handleLanguageToggle}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <CampaignBrief 
              onGenerate={handleGenerateCampaign}
              isGenerating={isGenerating}
              language={language || 'en'}
            />
          </div>
          
          <div className="lg:col-span-6">
            <OutputsPanel 
              outputs={outputs || {
                strategy: '',
                copyA: '',
                copyB: '',
                calendar: '',
                kpis: ''
              }}
              isGenerating={isGenerating}
              language={language || 'en'}
            />
          </div>
          
          <div className="lg:col-span-3">
            <LiveChat language={language || 'en'} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App