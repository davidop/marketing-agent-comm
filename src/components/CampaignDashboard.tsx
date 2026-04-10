import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { OutputCard } from '@/components/OutputCard'
import { CampaignOverview } from '@/components/CampaignOverview'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import { FunnelBlueprint } from '@/components/FunnelBlueprint'
import { PaidPack } from '@/components/PaidPack'
import LandingKitDisplay from '@/components/LandingKitDisplay'
import { ContentCalendarDisplay } from '@/components/ContentCalendarDisplay'
import FlowsDisplay from '@/components/FlowsDisplay'
import { MeasurementUtmsDisplay } from '@/components/MeasurementUtmsDisplay'
import { RisksAssumptionsDisplay } from '@/components/RisksAssumptionsDisplay'
import { ExecutionChecklistDisplay } from '@/components/ExecutionChecklistDisplay'
import { EmptyState } from '@/components/EmptyState'
import { CampaignExport } from '@/components/CampaignExport'
import { getCopy } from '@/lib/premiumCopy'
import {
  Eye,
  Palette,
  Funnel,
  CurrencyDollar,
  CalendarBlank,
  Flask,
  ChartLine,
  Warning,
  CheckSquare,
  Sparkle,
  Target,
  Desktop,
  Export,
  EnvelopeSimple,
  ChatCircleDots
} from '@phosphor-icons/react'
import type { CampaignOutput } from '@/lib/types'
import type { Language } from '@/lib/i18n'

interface CampaignDashboardProps {
  outputs: Partial<CampaignOutput>
  isGenerating: boolean
  language: Language
  onRegenerateBlock?: (blockName: string) => void
}

export function CampaignDashboard({
  outputs,
  isGenerating,
  language,
  onRegenerateBlock
}: CampaignDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [versions, setVersions] = useState<Record<string, string[]>>({})
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const t = getCopy(language)

  const handleSaveVersion = (blockName: string, content: string) => {
    setVersions((prev) => {
      return {
        ...prev,
        [blockName]: [...(prev[blockName] || []), content]
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('Campaign Output', 'Campaign Output')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportDialogOpen(true)}
            disabled={!outputs || Object.keys(outputs).length === 0}
          >
            <Export size={18} weight="bold" className="mr-2" />
            {t('Exportar', 'Export')}
          </Button>
        </div>

        <CampaignExport
          outputs={outputs}
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          language={language}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <TabsList className="inline-flex w-auto gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Target size={16} weight="fill" className="shrink-0" />
                <span>{t('Overview', 'Overview')}</span>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-2">
                <Eye size={16} weight="fill" className="shrink-0" />
                <span>{t('Estrategia', 'Strategy')}</span>
              </TabsTrigger>
              <TabsTrigger value="creative" className="flex items-center gap-2">
                <Palette size={16} weight="fill" className="shrink-0" />
                <span>{t('Creative', 'Creative')}</span>
              </TabsTrigger>
              <TabsTrigger value="funnel" className="flex items-center gap-2">
                <Funnel size={16} weight="fill" className="shrink-0" />
                <span>{t('Funnel', 'Funnel')}</span>
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center gap-2">
                <CurrencyDollar size={16} weight="fill" className="shrink-0" />
                <span>{t('Paid Media', 'Paid Media')}</span>
              </TabsTrigger>
              <TabsTrigger value="flows" className="flex items-center gap-2">
                <EnvelopeSimple size={16} weight="fill" className="shrink-0" />
                <span>{t('Flows', 'Flows')}</span>
              </TabsTrigger>
              <TabsTrigger value="experiments" className="flex items-center gap-2">
                <Flask size={16} weight="fill" className="shrink-0" />
                <span>{t('Experimentos', 'Experiments')}</span>
              </TabsTrigger>
              <TabsTrigger value="measurement" className="flex items-center gap-2">
                <ChartLine size={16} weight="fill" className="shrink-0" />
                <span>{t('Medición', 'Measurement')}</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview" className="mt-4">
            {outputs.overview ? (
              <CampaignOverview data={outputs.overview} language={language} />
            ) : (
              <EmptyState
                icon={<Sparkle size={56} weight="duotone" />}
                title={t('No hay overview', 'No overview')}
                subtitle={t('El overview se generará aquí', 'Overview will be generated here')}
              />
            )}
          </TabsContent>

          <TabsContent value="strategy" className="mt-4">
            <OutputCard
              title={t('Estrategia de Comunicación', 'Communication Strategy')}
              content={outputs.strategy || ''}
              emptyMessage={t('La estrategia se generará aquí', 'Strategy will be generated here')}
              isLoading={isGenerating}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('strategy')}
              onSaveVersion={(content) => handleSaveVersion('strategy', content)}
              blockName="strategy"
            />
          </TabsContent>

          <TabsContent value="creative" className="mt-4">
            {outputs.creativeRoutes && Array.isArray(outputs.creativeRoutes) ? (
              <CreativeRoutesDisplay
                routes={outputs.creativeRoutes}
                language={language}
              />
            ) : (
              <OutputCard
                icon={<Palette size={20} weight="duotone" />}
                title={t('Rutas Creativas', 'Creative Routes')}
                content={typeof outputs.creativeRoutes === 'string' ? outputs.creativeRoutes : ''}
                emptyMessage={t('Las rutas creativas se generarán aquí', 'Creative routes will be generated here')}
                isLoading={isGenerating}
                language={language}
                onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
                onSaveVersion={(content) => handleSaveVersion('creativeRoutes', content)}
                blockName="creativeRoutes"
              />
            )}
          </TabsContent>

          <TabsContent value="funnel" className="mt-4">
            {outputs.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
              <FunnelBlueprint phases={outputs.funnelBlueprint} language={language} />
            ) : (
              <OutputCard
                icon={<Funnel size={20} weight="duotone" />}
                title={t('Blueprint de Funnel', 'Funnel Blueprint')}
                content={typeof outputs.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
                emptyMessage={t('El funnel blueprint se generará aquí', 'Funnel blueprint will be generated here')}
                isLoading={isGenerating}
                language={language}
                onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
                onSaveVersion={(content) => handleSaveVersion('funnelBlueprint', content)}
                blockName="funnelBlueprint"
              />
            )}
          </TabsContent>

          <TabsContent value="paid" className="mt-4">
            <div className="space-y-6">
              {outputs.paidPack && typeof outputs.paidPack === 'object' ? (
                <PaidPack
                  data={outputs.paidPack}
                  language={language}
                  isLoading={isGenerating}
                  onRegenerate={() => onRegenerateBlock?.('paidPack')}
                />
              ) : (
                <OutputCard
                  title={t('Pack de Paid Media', 'Paid Media Pack')}
                  content={typeof outputs.paidPack === 'string' ? outputs.paidPack : ''}
                  emptyMessage={t('El pack de paid media se generará aquí', 'Paid media pack will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('paidPack')}
                  onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
                  blockName="paidPack"
                />
              )}

              {outputs.landingKit && typeof outputs.landingKit === 'object' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Desktop size={24} weight="duotone" className="text-primary" />
                    <h3 className="text-lg font-bold">
                      {t('Landing Page Kit', 'Landing Page Kit')}
                    </h3>
                  </div>
                  <LandingKitDisplay data={outputs.landingKit} language={language} />
                </div>
              ) : (
                <OutputCard
                  title={t('Landing Page Kit', 'Landing Page Kit')}
                  content={typeof outputs.landingKit === 'string' ? outputs.landingKit : ''}
                  emptyMessage={t('El landing kit se generará aquí', 'Landing kit will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('landingKit')}
                  onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
                  blockName="landingKit"
                />
              )}

              {outputs.contentCalendar && Array.isArray(outputs.contentCalendar) && outputs.contentCalendar.length > 0 ? (
                <ContentCalendarDisplay
                  items={outputs.contentCalendar}
                  language={language}
                />
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="flows" className="mt-4">
            {outputs.flows && Array.isArray(outputs.flows) ? (
              <FlowsDisplay flows={outputs.flows} language={language} />
            ) : (
              <div className="space-y-6">
                <OutputCard
                  title={t('Flow de Email', 'Email Flow')}
                  content={outputs.emailFlow || ''}
                  emptyMessage={t('El flow de email se generará aquí', 'Email flow will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('emailFlow')}
                  onSaveVersion={(content) => handleSaveVersion('emailFlow', content)}
                  blockName="emailFlow"
                />
                <OutputCard
                  title={t('Flow de WhatsApp', 'WhatsApp Flow')}
                  content={outputs.whatsappFlow || ''}
                  emptyMessage={t('El flow de WhatsApp se generará aquí', 'WhatsApp flow will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
                  onSaveVersion={(content) => handleSaveVersion('whatsappFlow', content)}
                  blockName="whatsappFlow"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiments" className="mt-4">
            <OutputCard
              title={t('Plan de Experimentación', 'Experimentation Plan')}
              content={outputs.experimentPlan || ''}
              emptyMessage={t('El plan de experimentación se generará aquí', 'Experimentation plan will be generated here')}
              isLoading={isGenerating}
              language={language}
              onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
              onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
              blockName="experimentPlan"
            />
          </TabsContent>

          <TabsContent value="measurement" className="mt-4">
            <div className="space-y-6">
              {outputs.measurementUtms && typeof outputs.measurementUtms === 'object' ? (
                <MeasurementUtmsDisplay
                  data={outputs.measurementUtms}
                  language={language}
                />
              ) : (
                <OutputCard
                  title={t('Medición y UTMs', 'Measurement & UTMs')}
                  content={typeof outputs.measurementUtms === 'string' ? outputs.measurementUtms : ''}
                  emptyMessage={t('El sistema de medición se generará aquí', 'Measurement system will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('measurementUtms')}
                  onSaveVersion={(content) => handleSaveVersion('measurementUtms', content)}
                  blockName="measurementUtms"
                />
              )}

              {outputs.risks && typeof outputs.risks === 'object' ? (
                <RisksAssumptionsDisplay
                  data={outputs.risks}
                  isLoading={isGenerating}
                  language={language}
                />
              ) : (
                <OutputCard
                  title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
                  content={typeof outputs.risks === 'string' ? outputs.risks : ''}
                  emptyMessage={t('Los riesgos y supuestos se generarán aquí', 'Risks and assumptions will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('risks')}
                  onSaveVersion={(content) => handleSaveVersion('risks', content)}
                  blockName="risks"
                />
              )}

              {outputs.executionChecklist && typeof outputs.executionChecklist === 'object' ? (
                <ExecutionChecklistDisplay
                  data={outputs.executionChecklist}
                  language={language}
                />
              ) : (
                <OutputCard
                  icon={<CheckSquare size={20} weight="duotone" />}
                  title={t('Checklist de Ejecución', 'Execution Checklist')}
                  content={typeof outputs.executionChecklist === 'string' ? outputs.executionChecklist : ''}
                  emptyMessage={t('El checklist de ejecución se generará aquí', 'Execution checklist will be generated here')}
                  isLoading={isGenerating}
                  language={language}
                  onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
                  onSaveVersion={(content) => handleSaveVersion('executionChecklist', content)}
                  blockName="executionChecklist"
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
