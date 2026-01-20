import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { CampaignBrief } from '@/components/CampaignBrief'
import { OutputsPanel } from '@/components/OutputsPanel'
import { LiveChat } from '@/components/LiveChat'

interface CampaignOutputs {
  strategy: string
  copyA: string
  copyB: string
  calendar: string
  kpis: string
}

function App() {
  const [theme, setTheme] = useKV<string>('theme', 'light')
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

  const handleGenerateCampaign = async (briefData: any) => {
    setIsGenerating(true)
    
    try {
      // @ts-expect-error - spark global is provided by runtime
      const strategyPrompt = spark.llmPrompt`You are an expert marketing strategist. Based on this campaign brief, create a comprehensive marketing strategy:

Product/Service: ${briefData.product}
Target Audience: ${briefData.audience}
Campaign Goals: ${briefData.goals}
Budget: ${briefData.budget}
Channels: ${briefData.channels}

Provide a structured strategy with these sections:
- Overview (2-3 sentences)
- Target Approach (key insights about the audience)
- Channel Strategy (how to use each channel effectively)
- Budget Allocation (recommendations for spending)

Keep it concise and actionable.`

      // @ts-expect-error - spark global is provided by runtime
      const copyPrompt = spark.llmPrompt`You are a creative copywriter. Create two distinct A/B test variations for this campaign:

Product/Service: ${briefData.product}
Target Audience: ${briefData.audience}
Campaign Goals: ${briefData.goals}

For each variation (A and B), provide:
- A compelling headline (max 10 words)
- Body copy (3-4 sentences)
- Call-to-action (short phrase)

Make Version A more emotional and Version B more rational/factual. Format as:

VERSION A:
Headline: [headline]
Body: [body copy]
CTA: [call to action]

VERSION B:
Headline: [headline]
Body: [body copy]
CTA: [call to action]`

      // @ts-expect-error - spark global is provided by runtime
      const calendarPrompt = spark.llmPrompt`You are a marketing operations specialist. Create a 2-week content calendar for this campaign:

Product/Service: ${briefData.product}
Channels: ${briefData.channels}
Campaign Goals: ${briefData.goals}

Provide a day-by-day schedule with:
- Date (use Week 1 Day 1, Day 2, etc.)
- Platform
- Content Type
- Brief Description

Format as a clear list with one item per line.`

      // @ts-expect-error - spark global is provided by runtime
      const kpiPrompt = spark.llmPrompt`You are a marketing analytics expert. Recommend 5-6 key KPIs to track for this campaign:

Product/Service: ${briefData.product}
Campaign Goals: ${briefData.goals}
Channels: ${briefData.channels}
Budget: ${briefData.budget}

For each KPI provide:
- KPI Name
- Why it matters (1 sentence)
- Target range or benchmark

Format clearly with one KPI per section.`

      const [strategy, copy, calendar, kpis] = await Promise.all([
        spark.llm(strategyPrompt),
        spark.llm(copyPrompt),
        spark.llm(calendarPrompt),
        spark.llm(kpiPrompt)
      ])

      const copyParts = copy.split('VERSION B:')
      const copyA = copyParts[0].replace('VERSION A:', '').trim()
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
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <CampaignBrief 
              onGenerate={handleGenerateCampaign}
              isGenerating={isGenerating}
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
            />
          </div>
          
          <div className="lg:col-span-3">
            <LiveChat />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App