import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OutputCard } from '@/components/OutputCard'
import { CampaignOverview } from '@/components/CampaignOverview'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import FunnelBlueprint from '@/components/FunnelBlueprint'
import { PaidPack } from '@/components/PaidPack'
import LandingKitDisplay from '@/components/LandingKitDisplay'
import { ContentCalendarDisplay } from '@/components/ContentCalendarDisplay'
import FlowsDisplay from '@/components/FlowsDisplay'
import MeasurementUtmsDisplay from '@/components/MeasurementUtmsDisplay'
import { RisksAssumptionsDisplay } from '@/components/RisksAssumptionsDisplay'
import ExecutionChecklistDisplay from '@/components/ExecutionChecklistDisplay'
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
import type { CampaignOutput, ContentCalendarItem, CreativeRoute, FunnelPhase, PaidPackData, LandingKitData, FlowSequence, RisksAssumptionsData, ExecutionChecklistData } from '@/lib/types'

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
          {Array.isArray(outputs.funnelBlueprint) ? (
            <FunnelBlueprint phases={outputs.funnelBlueprint} language={language} />
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="paid" className="mt-0">
          {typeof outputs.paidPack === 'object' && outputs.paidPack !== null ? (
            <PaidPack
              data={outputs.paidPack as PaidPackData}
              isLoading={isGenerating}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
            />
          ) : (
            <OutputCard
              title={t('Pack de Paid Media', 'Paid Media Pack')}
              icon={<CurrencyDollar size={20} weight="fill" />}
              content={typeof outputs.paidPack === 'string' ? outputs.paidPack : ''}
              isLoading={isGenerating}
              emptyMessage={t('El pack de paid media se generará aquí', 'Paid media pack will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
              onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
              blockName="paidPack"
            />
          )}
        </TabsContent>

        <TabsContent value="landing" className="mt-0">
          {typeof outputs.landingKit === 'object' && outputs.landingKit !== null ? (
            <Card className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Desktop size={20} weight="fill" className="text-primary" />
                  <h3 className="text-lg font-bold">
                    {t('Landing Page Kit', 'Landing Page Kit')}
                  </h3>
                </div>
              </div>
              <LandingKitDisplay data={outputs.landingKit as LandingKitData} language={language} />
            </Card>
          ) : (
            <OutputCard
              title={t('Landing Page Kit', 'Landing Page Kit')}
              icon={<Desktop size={20} weight="fill" />}
              content={typeof outputs.landingKit === 'string' ? outputs.landingKit : ''}
              isLoading={isGenerating}
              emptyMessage={t('El landing kit se generará aquí', 'Landing kit will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('landingKit')}
              onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
              blockName="landingKit"
            />
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <ContentCalendarDisplay 
            items={outputs.contentCalendar || []} 
            language={language}
          />
        </TabsContent>

        <TabsContent value="flows" className="mt-0">
          {outputs.flows && outputs.flows.length > 0 ? (
            <FlowsDisplay flows={outputs.flows} language={language} />
          ) : (
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
          )}
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
          {typeof outputs.measurementUtms === 'object' && outputs.measurementUtms !== null ? (
            <MeasurementUtmsDisplay 
              data={outputs.measurementUtms}
              language={language}
            />
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="risks" className="mt-0">
          {typeof outputs.risks === 'object' && outputs.risks !== null ? (
            <RisksAssumptionsDisplay
              data={outputs.risks as RisksAssumptionsData}
              language={language}
              isLoading={isGenerating}
            />
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-0">
          {outputs.executionChecklist && typeof outputs.executionChecklist === 'object' ? (
            <ExecutionChecklistDisplay 
              data={outputs.executionChecklist as ExecutionChecklistData} 
              language={language}
            />
          ) : (
            <OutputCard
              title={t('Checklist de Ejecución', 'Execution Checklist')}
              icon={<CheckSquare size={20} weight="fill" />}
              content={typeof outputs.executionChecklist === 'string' ? outputs.executionChecklist : ''}
              isLoading={isGenerating}
              emptyMessage={t('El checklist se generará aquí', 'Checklist will be generated here')}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
              onSaveVersion={(content) => handleSaveVersion('executionChecklist', content)}
              blockName="executionChecklist"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
