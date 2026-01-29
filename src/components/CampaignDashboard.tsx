import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OutputCard } from '@/components/OutputCard'
import { CampaignOverview } from '@/components/CampaignOverview'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import { 
  Eye,
  Target,
  Palette,
  Funnel,
  CurrencyDollar,
  Desktop,
  CalendarBlank,
  EnvelopeSimple,
  Flask,
  ChartLineUp,
  Warning,
  CheckSquare
} from '@phosphor-icons/react'
import type { CampaignOutput, ContentCalendarItem, CreativeRoute } from '@/lib/types'

interface CampaignDashboardProps {
  outputs: Partial<CampaignOutput>
  isGenerating: boolean
  language: 'es' | 'en'
  onRegenerateBlock?: (blockName: keyof CampaignOutput) => void
}

export function CampaignDashboard({
  outputs,
  isGenerating,
  language,
  onRegenerateBlock
}: CampaignDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [versions, setVersions] = useKV<Record<string, string[]>>('output-versions', {})

  const t = (es: string, en: string) => language === 'es' ? es : en

  const handleSaveVersion = (blockName: string, content: string) => {
    setVersions((current) => {
      const blockVersions = (current || {})[blockName] || []
      return {
        ...(current || {}),
        [blockName]: [...blockVersions, content]
      }
    })
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="glass-panel mb-6 border-2 rounded-xl p-1 inline-flex w-auto">
            <TabsTrigger value="overview" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Eye size={16} weight="fill" className="mr-2" />
              {t('Overview', 'Overview')}
            </TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Target size={16} weight="fill" className="mr-2" />
              {t('Estrategia', 'Strategy')}
            </TabsTrigger>
            <TabsTrigger value="creative" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Palette size={16} weight="fill" className="mr-2" />
              {t('Rutas Creativas', 'Creative Routes')}
            </TabsTrigger>
            <TabsTrigger value="funnel" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Funnel size={16} weight="fill" className="mr-2" />
              {t('Funnel', 'Funnel')}
            </TabsTrigger>
            <TabsTrigger value="paid" className="text-xs font-semibold rounded-lg px-4 py-2">
              <CurrencyDollar size={16} weight="fill" className="mr-2" />
              {t('Paid Pack', 'Paid Pack')}
            </TabsTrigger>
            <TabsTrigger value="landing" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Desktop size={16} weight="fill" className="mr-2" />
              {t('Landing Kit', 'Landing Kit')}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs font-semibold rounded-lg px-4 py-2">
              <CalendarBlank size={16} weight="fill" className="mr-2" />
              {t('Calendario', 'Calendar')}
            </TabsTrigger>
            <TabsTrigger value="flows" className="text-xs font-semibold rounded-lg px-4 py-2">
              <EnvelopeSimple size={16} weight="fill" className="mr-2" />
              {t('Flows', 'Flows')}
            </TabsTrigger>
            <TabsTrigger value="experiments" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Flask size={16} weight="fill" className="mr-2" />
              {t('Experimentos', 'Experiments')}
            </TabsTrigger>
            <TabsTrigger value="measurement" className="text-xs font-semibold rounded-lg px-4 py-2">
              <ChartLineUp size={16} weight="fill" className="mr-2" />
              {t('Medición', 'Measurement')}
            </TabsTrigger>
            <TabsTrigger value="risks" className="text-xs font-semibold rounded-lg px-4 py-2">
              <Warning size={16} weight="fill" className="mr-2" />
              {t('Riesgos', 'Risks')}
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs font-semibold rounded-lg px-4 py-2">
              <CheckSquare size={16} weight="fill" className="mr-2" />
              {t('Checklist', 'Checklist')}
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="overview" className="mt-0">
          {outputs.overview ? (
            <CampaignOverview 
              data={outputs.overview}
              language={language}
            />
          ) : (
            <Card className="glass-panel p-12 border-2">
              <div className="text-center">
                <Eye size={48} weight="fill" className="mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground italic">
                  {t(
                    'Genera una campaña para ver el overview ejecutivo',
                    'Generate a campaign to see the executive overview'
                  )}
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="strategy" className="mt-0">
          <OutputCard
            title={t('Estrategia de Campaña', 'Campaign Strategy')}
            icon={<Target size={20} weight="fill" />}
            content={outputs.strategy || ''}
            isLoading={isGenerating}
            emptyMessage={t('La estrategia se generará aquí', 'Strategy will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('strategy')}
            onSaveVersion={(content) => handleSaveVersion('strategy', content)}
            blockName="strategy"
          />
        </TabsContent>

        <TabsContent value="creative" className="mt-0">
          {Array.isArray(outputs.creativeRoutes) ? (
            <CreativeRoutesDisplay
              routes={outputs.creativeRoutes}
              language={language}
              isLoading={isGenerating}
            />
          ) : (
            <OutputCard
              title={t('Rutas Creativas', 'Creative Routes')}
              icon={<Palette size={20} weight="fill" />}
              content={outputs.creativeRoutes || ''}
              isLoading={isGenerating}
              emptyMessage={t('Las rutas creativas se generarán aquí', 'Creative routes will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
              onSaveVersion={(content) => handleSaveVersion('creativeRoutes', content)}
              blockName="creativeRoutes"
            />
          )}
        </TabsContent>

        <TabsContent value="funnel" className="mt-0">
          <OutputCard
            title={t('Blueprint del Funnel', 'Funnel Blueprint')}
            icon={<Funnel size={20} weight="fill" />}
            content={outputs.funnelBlueprint || ''}
            isLoading={isGenerating}
            emptyMessage={t('El funnel se generará aquí', 'Funnel will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
            onSaveVersion={(content) => handleSaveVersion('funnelBlueprint', content)}
            blockName="funnelBlueprint"
          />
        </TabsContent>

        <TabsContent value="paid" className="mt-0">
          <OutputCard
            title={t('Pack de Paid Media', 'Paid Media Pack')}
            icon={<CurrencyDollar size={20} weight="fill" />}
            content={outputs.paidPack || ''}
            isLoading={isGenerating}
            emptyMessage={t('El pack de paid media se generará aquí', 'Paid media pack will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('paidPack')}
            onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
            blockName="paidPack"
          />
        </TabsContent>

        <TabsContent value="landing" className="mt-0">
          <OutputCard
            title={t('Landing Page Kit', 'Landing Page Kit')}
            icon={<Desktop size={20} weight="fill" />}
            content={outputs.landingKit || ''}
            isLoading={isGenerating}
            emptyMessage={t('El landing kit se generará aquí', 'Landing kit will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('landingKit')}
            onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
            blockName="landingKit"
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <Card className="glass-panel p-6 border-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CalendarBlank size={24} weight="fill" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t('Calendario de Contenidos', 'Content Calendar')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('Plan de publicaciones y contenido', 'Content and publishing plan')}
                </p>
              </div>
            </div>

            {isGenerating ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : !outputs.contentCalendar || outputs.contentCalendar.length === 0 ? (
              <p className="text-muted-foreground text-sm italic py-8 text-center">
                {t('El calendario se generará aquí', 'Calendar will be generated here')}
              </p>
            ) : (
              <div className="space-y-3">
                {outputs.contentCalendar.map((item, idx) => (
                  <Card key={idx} className="p-4 border-2 hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{item.date}</Badge>
                          <Badge>{item.platform}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.funnelPhase}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-sm mb-1">{item.contentType}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">
                            {t('Objetivo:', 'Objective:')} <span className="font-medium">{item.objective}</span>
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {t('CTA:', 'CTA:')} <span className="font-medium">{item.cta}</span>
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {t('Formato:', 'Format:')} <span className="font-medium">{item.format}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="mt-0">
          <div className="space-y-6">
            <OutputCard
              title={t('Flow de Email', 'Email Flow')}
              icon={<EnvelopeSimple size={20} weight="fill" />}
              content={outputs.emailFlow || ''}
              isLoading={isGenerating}
              emptyMessage={t('El flow de email se generará aquí', 'Email flow will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('emailFlow')}
              onSaveVersion={(content) => handleSaveVersion('emailFlow', content)}
              blockName="emailFlow"
            />

            <OutputCard
              title={t('Flow de WhatsApp', 'WhatsApp Flow')}
              icon={<EnvelopeSimple size={20} weight="fill" />}
              content={outputs.whatsappFlow || ''}
              isLoading={isGenerating}
              emptyMessage={t('El flow de WhatsApp se generará aquí', 'WhatsApp flow will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
              onSaveVersion={(content) => handleSaveVersion('whatsappFlow', content)}
              blockName="whatsappFlow"
            />
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="mt-0">
          <OutputCard
            title={t('Plan de Experimentos', 'Experiment Plan')}
            icon={<Flask size={20} weight="fill" />}
            content={outputs.experimentPlan || ''}
            isLoading={isGenerating}
            emptyMessage={t('El plan de experimentos se generará aquí', 'Experiment plan will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
            onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
            blockName="experimentPlan"
          />
        </TabsContent>

        <TabsContent value="measurement" className="mt-0">
          <OutputCard
            title={t('Medición y UTMs', 'Measurement & UTMs')}
            icon={<ChartLineUp size={20} weight="fill" />}
            content={outputs.measurementUtms || ''}
            isLoading={isGenerating}
            emptyMessage={t('El sistema de medición se generará aquí', 'Measurement system will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('measurementUtms')}
            onSaveVersion={(content) => handleSaveVersion('measurementUtms', content)}
            blockName="measurementUtms"
          />
        </TabsContent>

        <TabsContent value="risks" className="mt-0">
          <OutputCard
            title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
            icon={<Warning size={20} weight="fill" />}
            content={outputs.risks || ''}
            isLoading={isGenerating}
            emptyMessage={t('Los riesgos se generarán aquí', 'Risks will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('risks')}
            onSaveVersion={(content) => handleSaveVersion('risks', content)}
            blockName="risks"
          />
        </TabsContent>

        <TabsContent value="checklist" className="mt-0">
          <OutputCard
            title={t('Checklist de Ejecución', 'Execution Checklist')}
            icon={<CheckSquare size={20} weight="fill" />}
            content={outputs.executionChecklist || ''}
            isLoading={isGenerating}
            emptyMessage={t('El checklist se generará aquí', 'Checklist will be generated here')}
            language={language}
            onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
            onSaveVersion={(content) => handleSaveVersion('executionChecklist', content)}
            blockName="executionChecklist"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
