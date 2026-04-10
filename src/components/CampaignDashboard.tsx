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
import {
import {
  Funnel,
  ChartLine,
  ChartLine,
  ChatCircleDots,
  Sparkle,
  CheckSquare,
  CalendarBlank,
  Lightning,
  Crosshair,
  Crosshair,
import type { Language } from '@/lib/i18n'
} from '@phosphor-icons/react'
import type { Language } from '@/lib/i18n'
interface CampaignDashboardProps {
  outputs: Partial<CampaignOutput>
interface CampaignDashboardProps {
  onRegenerateBlock?: (blockName: string) => void
}
  language: Language
export function CampaignDashboard({
  isGenerating,
  language,
  onRegenerateBlock
  outputs,
  isGenerating,
  language,
  onRegenerateBlock
  const handleExport = () => {
    console.log('Exporting campaign outputs...')
  const t = (es: string, en: string) => language === 'es' ? es : en

  const handleExport = () => {lockName: string, content: string) => {
    console.log('Exporting campaign outputs...')
  }

  const handleSaveVersion = (blockName: string, content: string) => {
    <div className="space-y-4">
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border-2">
        <h2 className="text-2xl font-bold">
  return (
        </h2>
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border-2">
          variant="outline" 
          size="sm"
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
        </Button>
        >
          <Download size={16} weight="bold" className="mr-2" />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        </Button>
      </div>
            <Eye size={16} weight="fill" className="mr-1" />
            {t('Overview', 'Overview')}
        <TabsList className="glass-panel grid w-full grid-cols-6 gap-1 p-1 border-2">
          <TabsTrigger value="overview" className="text-xs font-bold rounded-lg">
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
          ) : (nera una campaña para ver el overview', 'Generate a campaign to see the overview')}
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
}
              language={language}
            />
          ) : (
              isLoading={isGenerating}
              language={language}
            />
          ) : (iveRoutes : ''}
            <OutputCardutes')}
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              title={t('Rutas Creativas', 'Creative Routes')}', content)}
              content={typeof outputs?.creativeRoutes === 'string' ? outputs.creativeRoutes : ''}
              onRegenerate={() => onRegenerateBlock?.('creativeRoutes')}
              language={language}
            />
              isLoading={isGenerating}
              blockName="creativeRoutes"
          {outputs?.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
            />
          )}

            />
            <FunnelBlueprint
              phases={outputs.funnelBlueprint}
              language={language}lassName="text-primary" />}
            />
          ) : (elBlueprint === 'string' ? outputs.funnelBlueprint : ''}
            <OutputCardBlueprint')}
              icon={<Funnel size={24} weight="duotone" className="text-primary" />}
              title={t('Funnel Blueprint', 'Funnel Blueprint')}, content)}
              content={typeof outputs?.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              language={language}
            />
          )}
        </TabsContent>

            />
          )}elBlueprint) ? (
        </TabsContent>
hases={outputs.funnelBlueprint}
        <TabsContent value="funnel" className="mt-4 space-y-4">
          {outputs?.funnelBlueprint && Array.isArray(outputs.funnelBlueprint) ? (
            <FunnelBlueprint
              phases={outputs.funnelBlueprint}
              icon={<Funnel size={24} weight="duotone" className="text-primary" />}
            />', 'Funnel Blueprint')}
              content={typeof outputs?.funnelBlueprint === 'string' ? outputs.funnelBlueprint : ''}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              emptyMessage={t('El funnel blueprint se generará aquí', 'Funnel blueprint will be generated here')}
              title={t('Funnel Blueprint', 'Funnel Blueprint')}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('funnelBlueprint')}
              language={language}
        <TabsContent value="paid" className="mt-4 space-y-4">
          {outputs?.paidPack && typeof outputs.paidPack === 'object' ? (
            <PaidPack
              language={language}
              isLoading={isGenerating}
          )}
            />
          ) : (
        <TabsContent value="paid" className="mt-4 space-y-4">
          {outputs?.paidPack && typeof outputs.paidPack === 'object' ? (
            <PaidPack
              data={outputs.paidPack}.paidPack : ''}
              onRegenerate={() => onRegenerateBlock?.('paidPack')}
              emptyMessage={t('El paid pack se generará aquí', 'Paid pack will be generated here')}
              onSaveVersion={(content) => handleSaveVersion('paidPack', content)}
          ) : (
              blockName="paidPack"
              icon={<Crosshair size={24} weight="duotone" className="text-primary" />}
              title={t('Media Pack', 'Media Pack')}
              content={typeof outputs?.paidPack === 'string' ? outputs.paidPack : ''}

              emptyMessage={t('El paid pack se generará aquí', 'Paid pack will be generated here')}
            <div className="space-y-3">
              isLoading={isGenerating}
                <div className="flex items-center gap-2">
              language={language}
                  <h3 className="text-lg font-bold">
                    {t('Landing Page Kit', 'Landing Page Kit')}

          {outputs?.landingKit && typeof outputs.landingKit === 'object' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkle size={24} weight="duotone" className="text-primary" />
              />
            </div>
                  </h3>
            <OutputCard
              icon={<Sparkle size={24} weight="duotone" className="text-primary" />}
              <LandingKitDisplayg Page Kit')}
              content={typeof outputs?.landingKit === 'string' ? outputs.landingKit : ''}
                language={language}
              />
            </div>
          ) : (
              blockName="landingKit"
              language={language}
            />
          )}
              onRegenerate={() => onRegenerateBlock?.('landingKit')}

              onSaveVersion={(content) => handleSaveVersion('landingKit', content)}
          {outputs?.flows && outputs.flows.length > 0 ? (
              blockName="landingKit"
          ) : (
                content={outputs?.emailFlow || ''}
          )}.('emailFlow')}
                emptyMessage={t('El flow de email se generará aquí', 'Email flow will be generated here')}
                onSaveVersion={(content) => handleSaveVersion('emailFlow', content)}
        <TabsContent value="flows" className="mt-4 space-y-4">
          {outputs?.flows && outputs.flows.length > 0 ? (
            <FlowsDisplay flows={outputs.flows} language={language} />
          ) : (
            <>
              <OutputCard
                icon={<ChatCircleDots size={24} weight="duotone" className="text-primary" />}
                title={t('Flow de WhatsApp', 'WhatsApp Flow')}
                content={outputs?.emailFlow || ''}
                onRegenerate={() => onRegenerateBlock?.('emailFlow')}
                emptyMessage={t('El flow de WhatsApp se generará aquí', 'WhatsApp flow will be generated here')}
                onSaveVersion={(content) => handleSaveVersion('whatsappFlow', content)}
                isLoading={isGenerating}
                blockName="whatsappFlow"
                language={language}
              />
            </>
              <OutputCard
                icon={<ChatCircleDots size={24} weight="duotone" className="text-primary" />}
          {outputs?.contentCalendar && outputs.contentCalendar.length > 0 ? (
                content={outputs?.whatsappFlow || ''}
                onRegenerate={() => onRegenerateBlock?.('whatsappFlow')}
              language={language}
            />
                isLoading={isGenerating}
            <OutputCard
                language={language}one" className="text-primary" />}
              />de Contenido', 'Content Calendar')}
              content={outputs?.experimentPlan || ''}
              onRegenerate={() => onRegenerateBlock?.('contentCalendar')}
   emptyMessage={t('El calendario de contenido se generará aquí', 'Content calendar will be generated here')}
          {outputs?.contentCalendar && outputs.contentCalendar.length > 0 ? (
            <ContentCalendarDisplay
              items={outputs.contentCalendar}
              language={language}
            />
          )}

          <OutputCard
              title={t('Calendario de Contenido', 'Content Calendar')}
            title={t('Plan de Experimentación', 'Experiment Plan')}
            content={outputs?.experimentPlan || ''}
            onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
              onSaveVersion={(content) => handleSaveVersion('contentCalendar', content)}
            onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
            isLoading={isGenerating}
            blockName="experimentPlan"
            language={language}
          />
        </TabsContent>

        <TabsContent value="measurement" className="mt-4 space-y-4">
          {outputs?.measurementUtms && typeof outputs.measurementUtms === 'object' ? (
            <MeasurementUtmsDisplay
            onRegenerate={() => onRegenerateBlock?.('experimentPlan')}
              language={language}
            onSaveVersion={(content) => handleSaveVersion('experimentPlan', content)}
          ) : (
            blockName="experimentPlan"
              icon={<ChartLine size={24} weight="duotone" className="text-primary" />}
          />
        </TabsContent>
generateBlock?.('measurementUtms')}
              emptyMessage={t('El plan de medición se generará aquí', 'Measurement plan will be generated here')}
          {outputs?.measurementUtms && typeof outputs.measurementUtms === 'object' ? (
            <MeasurementUtmsDisplay

              language={language}
            />
          ) : (
              isLoading={isGenerating}
              icon={<ChartLine size={24} weight="duotone" className="text-primary" />}
              title={t('Medición & UTMs', 'Measurement & UTMs')}
              content={typeof outputs?.measurementUtms === 'string' ? outputs.measurementUtms : ''}
            <OutputCard
              emptyMessage={t('El plan de medición se generará aquí', 'Measurement plan will be generated here')}
              title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
              isLoading={isGenerating}
              onRegenerate={() => onRegenerateBlock?.('risks')}
              language={language}ill be generated here')}
              onSaveVersion={(content) => handleSaveVersion('risks', content)}
              isLoading={isGenerating}
              blockName="risks"
          {outputs?.risks && typeof outputs.risks === 'object' ? (
            <RisksAssumptionsDisplay
              data={outputs.risks}

          {outputs?.executionChecklist && typeof outputs.executionChecklist === 'object' ? (
            <ExecutionChecklistDisplay
              data={outputs.executionChecklist}
              language={language}
              icon={<Target size={24} weight="duotone" className="text-primary" />}
              title={t('Riesgos y Supuestos', 'Risks & Assumptions')}
              content={typeof outputs?.risks === 'string' ? outputs.risks : ''}
              icon={<CheckSquare size={24} weight="duotone" className="text-primary" />}
              title={t('Checklist de Ejecución', 'Execution Checklist')}
              content={typeof outputs?.executionChecklist === 'string' ? outputs.executionChecklist : ''}
              isLoading={isGenerating}
              emptyMessage={t('El checklist de ejecución se generará aquí', 'Execution checklist will be generated here')}
              language={language}('executionChecklist', content)}
            />
          )}

            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
              isLoading={isGenerating}
              language={language}
