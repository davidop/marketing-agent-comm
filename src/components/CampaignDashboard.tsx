import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignOverview } from '@/components/CampaignOverview'
import { OutputCard } from '@/components/OutputCard'
import { CreativeRoutesDisplay } from '@/components/CreativeRoutesDisplay'
import FlowsDisplay from '@/components/FlowsDisplay'
import FunnelBlueprint from '@/components/FunnelBlueprint'
import LandingKitDisplay from '@/components/LandingKitDisplay'
import MeasurementUtmsDisplay from '@/components/MeasurementUtmsDisplay'
import { RisksAssumptionsDisplay } from '@/components/RisksAssumptionsDisplay'
import ExecutionChecklistDisplay from '@/components/ExecutionChecklistDisplay'
import { ContentCalendarDisplay } from '@/components/ContentCalendarDisplay'
import { PaidPack } from '@/components/PaidPack'
import { EmptyState } from '@/components/EmptyState'
import { getCopy } from '@/lib/premiumCopy'
import {
  Eye,
  Funnel,
  ChartLine,
  Target,
  ChatCircleDots,
  Sparkle,
  CheckSquare,
  CalendarBlank,
  Lightning,
  Crosshair,
  Download
} from '@phosphor-icons/react'
import type { Language } from '@/lib/i18n'
import type { CampaignOutput } from '@/lib/types'

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
  const t = (es: string, en: string) => language === 'es' ? es : en

  const handleExport = () => {
    console.log('Exporting campaign outputs...')
  }

  const handleSaveVersion = (blockName: string, content: string) => {
    console.log(`Saving version for ${blockName}:`, content)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border-2">
        <h2 className="text-2xl font-bold">
          {t('Outputs de Campaña', 'Campaign Outputs')}
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
          className="glass-panel-hover"
        >
          <Download size={16} weight="bold" className="mr-2" />
          {t('Exportar', 'Export')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-panel grid w-full grid-cols-6 gap-1 p-1 border-2">
          <TabsTrigger value="overview" className="text-xs font-bold rounded-lg">
            <Eye size={16} weight="fill" className="mr-1" />
            {t('Overview', 'Overview')}
          </TabsTrigger>
          <TabsTrigger value="creative" className="text-xs font-bold rounded-lg">
            <Lightning size={16} weight="fill" className="mr-1" />
            {t('Creativo', 'Creative')}
          </TabsTrigger>
          <TabsTrigger value="funnel" className="text-xs font-bold rounded-lg">
            <Funnel size={16} weight="fill" className="mr-1" />
            {t('Funnel', 'Funnel')}
          </TabsTrigger>
          <TabsTrigger value="paid" className="text-xs font-bold rounded-lg">
            <Crosshair size={16} weight="fill" className="mr-1" />
            {t('Paid', 'Paid')}
          </TabsTrigger>
          <TabsTrigger value="flows" className="text-xs font-bold rounded-lg">
            <ChatCircleDots size={16} weight="fill" className="mr-1" />
            {t('Flows', 'Flows')}
          </TabsTrigger>
          <TabsTrigger value="measurement" className="text-xs font-bold rounded-lg">
            <ChartLine size={16} weight="fill" className="mr-1" />
            {t('Medición', 'Measurement')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {outputs?.overview ? (
            <CampaignOverview data={outputs.overview} language={language} />
          ) : (
            <EmptyState
              icon={<Eye size={56} weight="duotone" />}
              title={t('No hay overview', 'No overview')}
              subtitle={t('Genera una campaña para ver el overview', 'Generate a campaign to see the overview')}
            />
          )}
        </TabsContent>

        <TabsContent value="creative" className="mt-4 space-y-4">
          <OutputCard
            icon={<Lightning size={24} weight="duotone" className="text-primary" />}
            title={t('Estrategia de Comunicación', 'Communication Strategy')}
            content={outputs?.strategy || ''}
            onRegenerate={() => onRegenerateBlock?.('strategy')}
            emptyMessage={t('La estrategia se generará aquí', 'Strategy will be generated here')}
            onSaveVersion={(content) => handleSaveVersion('strategy', content)}
            isLoading={isGenerating}
            blockName="strategy"
            language={language}
          />

          {outputs?.creativeRoutes && Array.isArray(outputs.creativeRoutes) ? (
            <CreativeRoutesDisplay
              routes={outputs.creativeRoutes}
              isLoading={isGenerating}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              title={t('Rutas Creativas', 'Creative Routes')}
              content={typeof outputs?.creativeRoutes === 'string' ? outputs.creativeRoutes : ''}
              onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
              emptyMessage={t('Las rutas creativas se generarán aquí', 'Creative routes will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('creativeRoutes', content)}
              isLoading={isGenerating}
              blockName="creativeRoutes"
              language={language}
            />
          )}

          {outputs?.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
            <FunnelBlueprint
              phases={outputs.funnelBlueprint}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<Funnel size={24} weight="duotone" className="text-primary" />}
              title={t('Funnel Blueprint', 'Funnel Blueprint')}
              content={typeof outputs?.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              emptyMessage={t('El funnel blueprint se generará aquí', 'Funnel blueprint will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('funnelBlueprint', content)}
              isLoading={isGenerating}
              blockName="funnelBlueprint"
              language={language}
            />
          )}
        </TabsContent>

        <TabsContent value="funnel" className="mt-4 space-y-4">
          {outputs?.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
            <FunnelBlueprint
              phases={outputs.funnelBlueprint}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<Funnel size={24} weight="duotone" className="text-primary" />}
              title={t('Funnel Blueprint', 'Funnel Blueprint')}
              content={typeof outputs?.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              emptyMessage={t('El funnel blueprint se generará aquí', 'Funnel blueprint will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('funnelBlueprint', content)}
              isLoading={isGenerating}
              blockName="funnelBlueprint"
              language={language}
            />
          )}
        </TabsContent>

        <TabsContent value="paid" className="mt-4 space-y-4">
          {outputs?.paidPack && typeof outputs.paidPack === 'object' ? (
            <PaidPack
              data={outputs.paidPack}
              isLoading={isGenerating}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<Crosshair size={24} weight="duotone" className="text-primary" />}
              title={t('Media Pack', 'Media Pack')}
              content={typeof outputs?.paidPack === 'string' ? outputs.paidPack : ''}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
              emptyMessage={t('El paid pack se generará aquí', 'Paid pack will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
              isLoading={isGenerating}
              blockName="paidPack"
              language={language}
            />
          )}

          {outputs?.landingKit && typeof outputs.landingKit === 'object' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle size={24} weight="duotone" className="text-primary" />
                  <h3 className="text-lg font-bold">
                    {t('Landing Page Kit', 'Landing Page Kit')}
                  </h3>
                </div>
              </div>
              <LandingKitDisplay
                data={outputs.landingKit}
                language={language}
              />
            </div>
          ) : (
            <OutputCard
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              title={t('Landing Page Kit', 'Landing Page Kit')}
              content={typeof outputs?.landingKit === 'string' ? outputs.landingKit : ''}
              onRegenerate={() => onRegenerateBlock?.('landingKit')}
              emptyMessage={t('El landing kit se generará aquí', 'Landing kit will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
              isLoading={isGenerating}
              blockName="landingKit"
              language={language}
            />
          )}
        </TabsContent>

        <TabsContent value="flows" className="mt-4 space-y-4">
          {outputs?.flows && outputs.flows.length > 0 ? (
            <FlowsDisplay flows={outputs.flows} language={language} />
          ) : (
            <>
              <OutputCard
                icon={<ChatCircleDots size={24} weight="duotone" className="text-primary" />}
                title={t('Flow de Email', 'Email Flow')}
                content={outputs?.emailFlow || ''}
                onRegenerate={() => onRegenerateBlock?.('emailFlow')}
                emptyMessage={t('El flow de email se generará aquí', 'Email flow will be generated here')}
                onSaveVersion={(content) => handleSaveVersion('emailFlow', content)}
                isLoading={isGenerating}
                blockName="emailFlow"
                language={language}
              />

              <OutputCard
                icon={<ChatCircleDots size={24} weight="duotone" className="text-primary" />}
                title={t('Flow de WhatsApp', 'WhatsApp Flow')}
                content={outputs?.whatsappFlow || ''}
                onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
                emptyMessage={t('El flow de WhatsApp se generará aquí', 'WhatsApp flow will be generated here')}
                onSaveVersion={(content) => handleSaveVersion('whatsappFlow', content)}
                isLoading={isGenerating}
                blockName="whatsappFlow"
                language={language}
              />
            </>
          )}

          {outputs?.contentCalendar && outputs.contentCalendar.length > 0 ? (
            <ContentCalendarDisplay
              items={outputs.contentCalendar}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<CalendarBlank size={24} weight="duotone" className="text-primary" />}
              title={t('Calendario de Contenido', 'Content Calendar')}
              content={outputs?.experimentPlan || ''}
              onRegenerate={() => onRegenerateBlock?.('contentCalendar')}
              emptyMessage={t('El calendario de contenido se generará aquí', 'Content calendar will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('contentCalendar', content)}
              isLoading={isGenerating}
              blockName="contentCalendar"
              language={language}
            />
          )}

          <OutputCard
            icon={<Lightning size={24} weight="duotone" className="text-primary" />}
            title={t('Plan de Experimentación', 'Experiment Plan')}
            content={outputs?.experimentPlan || ''}
            onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
            emptyMessage={t('El plan de experimentación se generará aquí', 'Experiment plan will be generated here')}
            onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
            isLoading={isGenerating}
            blockName="experimentPlan"
            language={language}
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
              icon={<ChartLine size={24} weight="duotone" className="text-primary" />}
              title={t('Medición & UTMs', 'Measurement & UTMs')}
              content={typeof outputs?.measurementUtms === 'string' ? outputs.measurementUtms : ''}
              onRegenerate={() => onRegenerateBlock?.('measurementUtms')}
              emptyMessage={t('El plan de medición se generará aquí', 'Measurement plan will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('measurementUtms', content)}
              isLoading={isGenerating}
              blockName="measurementUtms"
              language={language}
            />
          )}

          {outputs?.risks && typeof outputs.risks === 'object' ? (
            <RisksAssumptionsDisplay
              data={outputs.risks}
              isLoading={isGenerating}
              language={language}
            />
          ) : (
            <OutputCard
              icon={<Target size={24} weight="duotone" className="text-primary" />}
              title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
              content={typeof outputs?.risks === 'string' ? outputs.risks : ''}
              onRegenerate={() => onRegenerateBlock?.('risks')}
              emptyMessage={t('Los riesgos y supuestos se generarán aquí', 'Risks and assumptions will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('risks', content)}
              isLoading={isGenerating}
              blockName="risks"
              language={language}
            />
          )}

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
              onRegenerate={() => onRegenerateBlock?.('executionChecklist')}
              emptyMessage={t('El checklist de ejecución se generará aquí', 'Execution checklist will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('executionChecklist', content)}
              isLoading={isGenerating}
              blockName="executionChecklist"
              language={language}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
