import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignOverview } from '@/components/CampaignOverview'
import { OutputCard } from '@/components/OutputCard'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import FlowsDisplay from '@/components/FlowsDisplay'
import { RisksAssumptionsDisplay } from '@/components/RisksAssumptionsDisplay'
import { EmptyState } from '@/components/EmptyState'
import FunnelBlueprint from '@/components/FunnelBlueprint'
import { PaidPack } from '@/components/PaidPack'
import LandingKitDisplay from '@/components/LandingKitDisplay'
import { ContentCalendarDisplay } from '@/components/ContentCalendarDisplay'
import MeasurementUtmsDisplay from '@/components/MeasurementUtmsDisplay'
import ExecutionChecklistDisplay from '@/components/ExecutionChecklistDisplay'
import { getCopy } from '@/lib/premiumCopy'
import {
  Eye,
  Palette,
  Funnel,
  CalendarBlank,
  ChartLine,
  CheckSquare,
  Target,
  Export,
  ChatCircleDots,
  EnvelopeSimple,
  Sparkle,
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
  onRegenerateBlock,
}: CampaignDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())

  const t = (es: string, en: string) => (language === 'es' ? es : en)

  const hasContent = outputs && Object.keys(outputs).length > 0

  const handleSaveVersion = (blockName: string, content: string) => {
    console.log(`Saving version for ${blockName}:`, content)
  }

  const handleExport = () => {
    console.log('Exporting campaign outputs')
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t('Dashboard de Campaña', 'Campaign Dashboard')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!outputs || Object.keys(outputs).length === 0}
        >
          <Export size={16} weight="bold" className="mr-2" />
          {t('Exportar', 'Export')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-panel mb-6 border-2 rounded-xl p-1 w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Eye size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="creative" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Palette size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Creatividad', 'Creative')}
          </TabsTrigger>
          <TabsTrigger value="funnel" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Funnel size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Funnel', 'Funnel')}
          </TabsTrigger>
          <TabsTrigger value="paid" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Target size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Pauta', 'Paid')}
          </TabsTrigger>
          <TabsTrigger value="flows" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <EnvelopeSimple size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Flows', 'Flows')}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <CalendarBlank size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Calendario', 'Calendar')}
          </TabsTrigger>
          <TabsTrigger value="measurement" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <ChartLine size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Medición', 'Measurement')}
          </TabsTrigger>
          <TabsTrigger value="execution" className="text-xs font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <CheckSquare size={16} weight="fill" className="mr-2 shrink-0" />
            {t('Ejecución', 'Execution')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {outputs?.overview ? (
            <CampaignOverview data={outputs.overview} language={language} />
          ) : (
            <EmptyState
              icon={<Eye size={56} weight="duotone" className="text-primary" />}
              title={t('No hay overview', 'No overview')}
              subtitle={t('El overview se generará aquí', 'Overview will be generated here')}
            />
          )}
        </TabsContent>

        <TabsContent value="creative" className="mt-4 space-y-4">
          <OutputCard
            title={t('Estrategia de Comunicación', 'Communication Strategy')}
            icon={<Palette size={24} weight="duotone" className="text-primary" />}
            content={outputs?.strategy || ''}
            isLoading={isGenerating}
            onRegenerate={() => onRegenerateBlock?.('strategy')}
            blockName="strategy"
            emptyMessage={t('La estrategia se generará aquí', 'Strategy will be generated here')}
            language={language}
            onSaveVersion={(content) => handleSaveVersion('strategy', content)}
          />

          {outputs?.creativeRoutes && Array.isArray(outputs.creativeRoutes) ? (
            <CreativeRoutesDisplay
              routes={outputs.creativeRoutes}
              language={language}
            />
          ) : (
            <OutputCard
              title={t('Rutas Creativas', 'Creative Routes')}
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.creativeRoutes === 'string' ? outputs.creativeRoutes : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
              blockName="creativeRoutes"
              emptyMessage={t('Las rutas creativas se generarán aquí', 'Creative routes will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('creativeRoutes', content)}
            />
          )}
        </TabsContent>

        <TabsContent value="funnel" className="mt-4">
          {outputs?.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
            <FunnelBlueprint phases={outputs.funnelBlueprint} language={language} />
          ) : (
            <OutputCard
              title={t('Blueprint de Funnel', 'Funnel Blueprint')}
              icon={<Funnel size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              blockName="funnelBlueprint"
              emptyMessage={t('El funnel blueprint se generará aquí', 'Funnel blueprint will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('funnelBlueprint', content)}
            />
          )}
        </TabsContent>

        <TabsContent value="paid" className="mt-4 space-y-4">
          {outputs?.paidPack && typeof outputs.paidPack === 'object' ? (
            <PaidPack
              data={outputs.paidPack}
              language={language}
              isLoading={isGenerating}
            />
          ) : (
            <OutputCard
              title={t('Media Pack & Pauta', 'Media Pack & Paid')}
              icon={<Target size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.paidPack === 'string' ? outputs.paidPack : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
              blockName="paidPack"
              emptyMessage={t('El paid pack se generará aquí', 'Paid pack will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
            />
          )}

          {outputs?.landingKit && typeof outputs.landingKit === 'object' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">
                  {t('Landing Page Kit', 'Landing Page Kit')}
                </h3>
              </div>
              <LandingKitDisplay data={outputs.landingKit} language={language} />
            </div>
          ) : (
            <OutputCard
              title={t('Landing Page Kit', 'Landing Page Kit')}
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.landingKit === 'string' ? outputs.landingKit : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('landingKit')}
              blockName="landingKit"
              emptyMessage={t('El landing kit se generará aquí', 'Landing kit will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
            />
          )}
        </TabsContent>

        <TabsContent value="flows" className="mt-4 space-y-4">
          {outputs?.flows && outputs.flows.length > 0 ? (
            <FlowsDisplay flows={outputs.flows} language={language} />
          ) : (
            <>
              <OutputCard
                title={t('Flow de Email', 'Email Flow')}
                icon={<EnvelopeSimple size={24} weight="duotone" className="text-primary" />}
                content={outputs?.emailFlow || ''}
                isLoading={isGenerating}
                onRegenerate={() => onRegenerateBlock?.('emailFlow')}
                blockName="emailFlow"
                emptyMessage={t('El flow de email se generará aquí', 'Email flow will be generated here')}
                language={language}
                onSaveVersion={(content) => handleSaveVersion('emailFlow', content)}
              />
              <OutputCard
                title={t('Flow de WhatsApp', 'WhatsApp Flow')}
                icon={<ChatCircleDots size={24} weight="duotone" className="text-primary" />}
                content={outputs?.whatsappFlow || ''}
                isLoading={isGenerating}
                onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
                blockName="whatsappFlow"
                emptyMessage={t('El flow de WhatsApp se generará aquí', 'WhatsApp flow will be generated here')}
                language={language}
                onSaveVersion={(content) => handleSaveVersion('whatsappFlow', content)}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4 space-y-4">
          {outputs?.contentCalendar && outputs.contentCalendar.length > 0 ? (
            <ContentCalendarDisplay
              items={outputs.contentCalendar}
              language={language}
            />
          ) : null}

          <OutputCard
            title={t('Plan de Experimentación', 'Experiment Plan')}
            icon={<CalendarBlank size={24} weight="duotone" className="text-primary" />}
            content={outputs?.experimentPlan || ''}
            isLoading={isGenerating}
            onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
            blockName="experimentPlan"
            emptyMessage={t('El plan de experimentación se generará aquí', 'Experiment plan will be generated here')}
            language={language}
            onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
          />
        </TabsContent>

        <TabsContent value="measurement" className="mt-4 space-y-4">
          {outputs?.measurementUtms && typeof outputs.measurementUtms === 'object' ? (
            <MeasurementUtmsDisplay
              data={outputs.measurementUtms}
              language={language}
            />
          ) : (
            <OutputCard
              title={t('Medición & UTMs', 'Measurement & UTMs')}
              icon={<ChartLine size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.measurementUtms === 'string' ? outputs.measurementUtms : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('measurementUtms')}
              blockName="measurementUtms"
              emptyMessage={t('El plan de medición se generará aquí', 'Measurement plan will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('measurementUtms', content)}
            />
          )}

          {outputs?.risks && typeof outputs.risks === 'object' ? (
            <RisksAssumptionsDisplay
              data={outputs.risks}
              language={language}
            />
          ) : (
            <OutputCard
              title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
              icon={<Target size={24} weight="duotone" className="text-primary" />}
              content={typeof outputs?.risks === 'string' ? outputs.risks : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('risks')}
              blockName="risks"
              emptyMessage={t('Los riesgos y supuestos se generarán aquí', 'Risks and assumptions will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('risks', content)}
            />
          )}
        </TabsContent>

        <TabsContent value="execution" className="mt-4">
          {outputs?.executionChecklist && typeof outputs.executionChecklist === 'object' ? (
            <ExecutionChecklistDisplay
              data={outputs.executionChecklist}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<CheckSquare size={24} weight="duotone" className="text-primary" />}
              title={t('Checklist de Ejecución', 'Execution Checklist')}
              content={typeof outputs?.executionChecklist === 'string' ? outputs.executionChecklist : ''}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
              blockName="executionChecklist"
              emptyMessage={t('El checklist de ejecución se generará aquí', 'Execution checklist will be generated here')}
              language={language}
              onSaveVersion={(content) => handleSaveVersion('executionChecklist', content)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
