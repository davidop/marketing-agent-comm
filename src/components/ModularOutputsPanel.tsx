import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Sparkle, ChartBar, Calendar, TrendUp, Copy, ArrowsClockwise, 
  Target, Funnel, ChartLineUp, FileText, EnvelopeSimple, 
  WhatsappLogo, Flask, Link, Warning, CheckSquare, Lightning
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { BrandConsistencyEvaluator } from '@/components/BrandConsistencyEvaluator'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import FunnelBlueprint from '@/components/FunnelBlueprint'
import LandingKitDisplay from '@/components/LandingKitDisplay'
import MeasurementUtmsDisplay from '@/components/MeasurementUtmsDisplay'
import ExecutionChecklistDisplay from '@/components/ExecutionChecklistDisplay'
import type { CampaignOutput, CreativeRoute, FunnelPhase, LandingKitData, MeasurementUtmsData, ExecutionChecklistData } from '@/lib/types'

interface ModularOutputsPanelProps {
  outputs: Partial<CampaignOutput>
  isGenerating: boolean
  language: 'es' | 'en'
  onRegenerateBlock?: (blockName: string) => void
}

interface OutputBlockProps {
  title: string
  icon: React.ReactNode
  content: string
  isLoading: boolean
  emptyMessage: string
  onRegenerate?: () => void
  onCopy?: () => void
  language: 'es' | 'en'
  variant?: 'default' | 'highlight'
}

function OutputBlock({ title, icon, content, isLoading, emptyMessage, onRegenerate, onCopy, language, variant = 'default' }: OutputBlockProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast.success(language === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard')
    onCopy?.()
  }

  return (
    <Card className={cn(
      "glass-panel p-5 border-2 marketing-shine",
      variant === 'highlight' && "neon-border border-primary/60"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {content && (
            <>
              <BrandConsistencyEvaluator
                content={content}
                blockName={title}
                language={language}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0 rounded-lg"
                title={language === 'es' ? 'Copiar' : 'Copy'}
              >
                <Copy size={16} weight="bold" />
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-8 w-8 p-0 rounded-lg text-accent hover:text-accent"
                  title={language === 'es' ? 'Regenerar' : 'Regenerate'}
                >
                  <ArrowsClockwise size={16} weight="bold" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isLoading && !content ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-5/6 rounded-xl" />
        </div>
      ) : content ? (
        <ScrollArea className="h-[200px]">
          <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-medium pr-4">
            {content}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}
    </Card>
  )
}

export function ModularOutputsPanel({ outputs, isGenerating, language, onRegenerateBlock }: ModularOutputsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { value: 'overview', label: language === 'es' ? 'Vista General' : 'Overview', icon: <Sparkle size={18} weight="fill" /> },
    { value: 'creative', label: language === 'es' ? 'Creativo' : 'Creative', icon: <Lightning size={18} weight="fill" /> },
    { value: 'funnel', label: language === 'es' ? 'Funnel & Paid' : 'Funnel & Paid', icon: <Funnel size={18} weight="fill" /> },
    { value: 'content', label: language === 'es' ? 'Contenido' : 'Content', icon: <Calendar size={18} weight="fill" /> },
    { value: 'automation', label: language === 'es' ? 'Automatización' : 'Automation', icon: <EnvelopeSimple size={18} weight="fill" /> },
    { value: 'execution', label: language === 'es' ? 'Ejecución' : 'Execution', icon: <CheckSquare size={18} weight="fill" /> }
  ]

  const exportToMarkdown = () => {
    let md = `# ${language === 'es' ? 'Campaña de Marketing' : 'Marketing Campaign'}\n\n`
    
    if (outputs.strategy) md += `## ${language === 'es' ? 'Estrategia' : 'Strategy'}\n${outputs.strategy}\n\n`
    if (outputs.creativeRoutes) md += `## ${language === 'es' ? 'Rutas Creativas' : 'Creative Routes'}\n${outputs.creativeRoutes}\n\n`
    if (outputs.funnelBlueprint) md += `## ${language === 'es' ? 'Blueprint del Funnel' : 'Funnel Blueprint'}\n${outputs.funnelBlueprint}\n\n`
    if (outputs.paidPack) md += `## ${language === 'es' ? 'Pack Paid Media' : 'Paid Media Pack'}\n${outputs.paidPack}\n\n`
    if (outputs.landingKit) md += `## ${language === 'es' ? 'Kit de Landing' : 'Landing Kit'}\n${outputs.landingKit}\n\n`
    if (outputs.emailFlow) md += `## ${language === 'es' ? 'Flow de Email' : 'Email Flow'}\n${outputs.emailFlow}\n\n`
    if (outputs.whatsappFlow) md += `## ${language === 'es' ? 'Flow de WhatsApp' : 'WhatsApp Flow'}\n${outputs.whatsappFlow}\n\n`
    if (outputs.experimentPlan) md += `## ${language === 'es' ? 'Plan de Experimentos' : 'Experiment Plan'}\n${outputs.experimentPlan}\n\n`
    if (outputs.measurementUtms) md += `## ${language === 'es' ? 'Medición y UTMs' : 'Measurement & UTMs'}\n${outputs.measurementUtms}\n\n`
    if (outputs.risks) md += `## ${language === 'es' ? 'Riesgos y Supuestos' : 'Risks & Assumptions'}\n${outputs.risks}\n\n`
    if (outputs.executionChecklist) md += `## ${language === 'es' ? 'Checklist de Ejecución' : 'Execution Checklist'}\n${outputs.executionChecklist}\n\n`

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'campaign-output.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(language === 'es' ? 'Exportado como Markdown' : 'Exported as Markdown')
  }

  const exportCalendarToCSV = () => {
    if (!outputs.contentCalendar || outputs.contentCalendar.length === 0) {
      toast.error(language === 'es' ? 'No hay calendario para exportar' : 'No calendar to export')
      return
    }

    const headers = ['Date', 'Platform', 'Content Type', 'Objective', 'Funnel Phase', 'CTA', 'Format', 'Description']
    const rows = outputs.contentCalendar.map(item => [
      item.date,
      item.platform,
      item.contentType,
      item.objective,
      item.funnelPhase,
      item.cta,
      item.format,
      item.description
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content-calendar.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(language === 'es' ? 'Calendario exportado como CSV' : 'Calendar exported as CSV')
  }

  return (
    <Card className="glass-panel p-6 border-2 marketing-shine">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkle size={28} weight="fill" className="text-accent sparkle-animate" />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
                {language === 'es' ? 'Outputs de Campaña' : 'Campaign Outputs'}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {language === 'es' ? 'Resultados modulares y regenerables' : 'Modular and regenerable results'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToMarkdown}
              className="rounded-lg font-bold text-xs"
              disabled={!outputs.strategy && !outputs.creativeRoutes}
            >
              <FileText size={16} weight="bold" className="mr-1" />
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCalendarToCSV}
              className="rounded-lg font-bold text-xs"
              disabled={!outputs.contentCalendar || outputs.contentCalendar.length === 0}
            >
              <Calendar size={16} weight="bold" className="mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 glass-panel mb-4 border-2 rounded-xl p-1 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs rounded-lg font-bold data-[state=active]:neon-glow flex flex-col md:flex-row items-center gap-1 py-2"
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <OutputBlock
              title={language === 'es' ? 'Estrategia' : 'Strategy'}
              icon={<ChartBar size={20} weight="fill" className="text-primary" />}
              content={outputs.strategy || ''}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Genera una campaña para ver la estrategia' : 'Generate a campaign to see the strategy'}
              onRegenerate={() => onRegenerateBlock?.('strategy')}
              language={language}
              variant="highlight"
            />
            
            <OutputBlock
              title={language === 'es' ? 'Plan de Experimentos' : 'Experiment Plan'}
              icon={<Flask size={20} weight="fill" className="text-accent" />}
              content={outputs.experimentPlan || ''}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Plan de A/B testing y experimentos' : 'A/B testing and experiments plan'}
              onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
              language={language}
            />
            
            <OutputBlock
              title={language === 'es' ? 'Riesgos y Supuestos' : 'Risks & Assumptions'}
              icon={<Warning size={20} weight="fill" className="text-destructive" />}
              content={typeof outputs.risks === 'string' ? outputs.risks : ''}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Identificación de riesgos y supuestos' : 'Risk and assumptions identification'}
              onRegenerate={() => onRegenerateBlock?.('risks')}
              language={language}
            />
          </div>
        </TabsContent>

        <TabsContent value="creative" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(outputs.creativeRoutes) ? (
              <CreativeRoutesDisplay
                routes={outputs.creativeRoutes}
                language={language}
                isLoading={isGenerating}
              />
            ) : (
              <OutputBlock
                title={language === 'es' ? 'Rutas Creativas' : 'Creative Routes'}
                icon={<Lightning size={20} weight="fill" className="text-accent" />}
                content={outputs.creativeRoutes || ''}
                isLoading={isGenerating}
                emptyMessage={language === 'es' ? 'Diferentes ángulos creativos para tu campaña' : 'Different creative angles for your campaign'}
                onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
                language={language}
                variant="highlight"
              />
            )}

            {typeof outputs.landingKit === 'object' && outputs.landingKit !== null ? (
              <Card className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} weight="fill" className="text-primary" />
                    <h3 className="text-lg font-bold">
                      {language === 'es' ? 'Kit de Landing' : 'Landing Kit'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const text = JSON.stringify(outputs.landingKit, null, 2)
                        navigator.clipboard.writeText(text)
                        toast.success(language === 'es' ? 'Copiado' : 'Copied')
                      }}
                    >
                      <Copy size={16} weight="bold" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRegenerateBlock?.('landingKit')}
                    >
                      <ArrowsClockwise size={16} weight="bold" />
                    </Button>
                  </div>
                </div>
                <LandingKitDisplay data={outputs.landingKit as LandingKitData} language={language} />
              </Card>
            ) : (
              <OutputBlock
                title={language === 'es' ? 'Kit de Landing' : 'Landing Kit'}
                icon={<FileText size={20} weight="fill" className="text-primary" />}
                content={typeof outputs.landingKit === 'string' ? outputs.landingKit : ''}
                isLoading={isGenerating}
                emptyMessage={language === 'es' ? 'Estructura y copy para landing pages' : 'Structure and copy for landing pages'}
                onRegenerate={() => onRegenerateBlock?.('landingKit')}
                language={language}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(outputs.funnelBlueprint) ? (
              <FunnelBlueprint phases={outputs.funnelBlueprint} language={language} />
            ) : (
              <OutputBlock
                title={language === 'es' ? 'Blueprint del Funnel' : 'Funnel Blueprint'}
                icon={<Funnel size={20} weight="fill" className="text-primary" />}
                content={outputs.funnelBlueprint || ''}
                isLoading={isGenerating}
                emptyMessage={language === 'es' ? 'Mapeo completo del funnel de conversión' : 'Complete conversion funnel mapping'}
                onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
                language={language}
                variant="highlight"
              />
            )}
            
            <OutputBlock
              title={language === 'es' ? 'Pack Paid Media' : 'Paid Media Pack'}
              icon={<ChartLineUp size={20} weight="fill" className="text-accent" />}
              content={typeof outputs.paidPack === 'string' ? outputs.paidPack : JSON.stringify(outputs.paidPack, null, 2)}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Estrategia y copy para campañas pagadas' : 'Strategy and copy for paid campaigns'}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
              language={language}
            />

            {typeof outputs.measurementUtms === 'object' && outputs.measurementUtms !== null ? (
              <MeasurementUtmsDisplay 
                data={outputs.measurementUtms as MeasurementUtmsData}
                language={language}
              />
            ) : (
              <OutputBlock
                title={language === 'es' ? 'Medición y UTMs' : 'Measurement & UTMs'}
                icon={<Link size={20} weight="fill" className="text-primary" />}
                content={typeof outputs.measurementUtms === 'string' ? outputs.measurementUtms : ''}
                isLoading={isGenerating}
                emptyMessage={language === 'es' ? 'Estructura de tracking y UTMs' : 'Tracking structure and UTMs'}
                onRegenerate={() => onRegenerateBlock?.('measurementUtms')}
                language={language}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {outputs.contentCalendar && outputs.contentCalendar.length > 0 ? (
              <Card className="glass-panel p-5 border-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} weight="fill" className="text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      {language === 'es' ? 'Calendario de Contenido' : 'Content Calendar'}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {outputs.contentCalendar.length} {language === 'es' ? 'piezas' : 'pieces'}
                  </Badge>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {outputs.contentCalendar.map((item, idx) => (
                      <Card key={idx} className="glass-panel p-4 border-2 hover:scale-[1.02] transition-transform">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{item.date}</Badge>
                              <Badge variant="secondary" className="text-xs">{item.platform}</Badge>
                            </div>
                            <p className="text-sm font-bold text-foreground">{item.contentType}</p>
                          </div>
                          <Badge className={cn(
                            "text-xs",
                            item.funnelPhase === 'awareness' && "bg-primary",
                            item.funnelPhase === 'consideration' && "bg-accent",
                            item.funnelPhase === 'conversion' && "bg-success",
                            item.funnelPhase === 'retention' && "bg-secondary"
                          )}>
                            {item.funnelPhase}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Target size={14} weight="fill" className="text-primary" />
                          <span className="font-medium">{item.objective}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{item.format}</Badge>
                          <span className="text-xs text-muted-foreground">CTA: {item.cta}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar size={56} className="mx-auto mb-4 opacity-40 float-animate" />
                <p className="font-semibold">
                  {language === 'es' ? 'Genera una campaña para ver el calendario' : 'Generate a campaign to see the calendar'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <OutputBlock
              title={language === 'es' ? 'Flow de Email' : 'Email Flow'}
              icon={<EnvelopeSimple size={20} weight="fill" className="text-primary" />}
              content={outputs.emailFlow || ''}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Secuencia automatizada de emails' : 'Automated email sequence'}
              onRegenerate={() => onRegenerateBlock?.('emailFlow')}
              language={language}
              variant="highlight"
            />
            
            <OutputBlock
              title={language === 'es' ? 'Flow de WhatsApp' : 'WhatsApp Flow'}
              icon={<WhatsappLogo size={20} weight="fill" className="text-success" />}
              content={outputs.whatsappFlow || ''}
              isLoading={isGenerating}
              emptyMessage={language === 'es' ? 'Secuencia automatizada de WhatsApp' : 'Automated WhatsApp sequence'}
              onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
              language={language}
            />
          </div>
        </TabsContent>

        <TabsContent value="execution" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {outputs.executionChecklist && typeof outputs.executionChecklist === 'object' ? (
              <ExecutionChecklistDisplay 
                data={outputs.executionChecklist as ExecutionChecklistData} 
                language={language}
              />
            ) : (
              <OutputBlock
                title={language === 'es' ? 'Checklist de Ejecución' : 'Execution Checklist'}
                icon={<CheckSquare size={20} weight="fill" className="text-success" />}
                content={typeof outputs.executionChecklist === 'string' ? outputs.executionChecklist : ''}
                isLoading={isGenerating}
                emptyMessage={language === 'es' ? 'Lista paso a paso para ejecutar la campaña' : 'Step-by-step list to execute the campaign'}
                onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
                language={language}
                variant="highlight"
              />
            )}
            
            <Card className="glass-panel p-5 border-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                <TrendUp size={20} weight="fill" className="text-primary" />
                {language === 'es' ? 'KPIs de Seguimiento' : 'Tracking KPIs'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-3 rounded-lg border">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">CTR</p>
                  <p className="text-lg font-bold text-primary">TBD</p>
                </div>
                <div className="glass-panel p-3 rounded-lg border">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">CPA</p>
                  <p className="text-lg font-bold text-accent">TBD</p>
                </div>
                <div className="glass-panel p-3 rounded-lg border">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">ROI</p>
                  <p className="text-lg font-bold text-success">TBD</p>
                </div>
                <div className="glass-panel p-3 rounded-lg border">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Conv Rate</p>
                  <p className="text-lg font-bold text-secondary">TBD</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
