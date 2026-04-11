import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, FilePdf, FileHtml, Spinner, Sparkle, Lightning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { exportCampaignToPDF } from '@/lib/pdfExport'
import type { CampaignOutput, CampaignBriefData } from '@/lib/types'

interface CampaignExportProps {
  outputs: Partial<CampaignOutput>
  brief?: CampaignBriefData | null
  language: 'es' | 'en'
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ExportSection = {
  id: keyof CampaignOutput
  label: string
  available: boolean
}

export function CampaignExport({ outputs, language, open, onOpenChange }: CampaignExportProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingWord, setIsExportingWord] = useState(false)
  const [isExportingHTML, setIsExportingHTML] = useState(false)
  const [selectedSections, setSelectedSections] = useState<Set<keyof CampaignOutput>>(new Set())

  const t = (es: string, en: string) => language === 'es' ? es : en

  const exportSections: ExportSection[] = [
    { id: 'overview', label: t('Resumen Ejecutivo', 'Executive Summary'), available: !!outputs.overview },
    { id: 'strategy', label: t('Estrategia', 'Strategy'), available: !!outputs.strategy },
    { id: 'creativeRoutes', label: t('Rutas Creativas', 'Creative Routes'), available: !!outputs.creativeRoutes },
    { id: 'funnelBlueprint', label: t('Blueprint de Funnel', 'Funnel Blueprint'), available: !!outputs.funnelBlueprint },
    { id: 'paidPack', label: t('Paid Media Pack', 'Paid Media Pack'), available: !!outputs.paidPack },
    { id: 'landingKit', label: t('Landing Kit', 'Landing Kit'), available: !!outputs.landingKit },
    { id: 'flows', label: t('Flows', 'Flows'), available: !!outputs.flows },
    { id: 'measurementUtms', label: t('Medición y UTMs', 'Measurement & UTMs'), available: !!outputs.measurementUtms },
    { id: 'executionChecklist', label: t('Checklist de Ejecución', 'Execution Checklist'), available: !!outputs.executionChecklist }
  ]

  const handleSectionToggle = (sectionId: keyof CampaignOutput) => {
    const newSelected = new Set(selectedSections)
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId)
    } else {
      newSelected.add(sectionId)
    }
    setSelectedSections(newSelected)
  }

  const handleSelectAll = () => {
    const allAvailable = exportSections.filter(s => s.available).map(s => s.id)
    setSelectedSections(new Set(allAvailable))
  }

  const handleDeselectAll = () => {
    setSelectedSections(new Set())
  }

  const handleQuickPreset = (preset: 'executive' | 'creative' | 'tactical' | 'complete') => {
    const newSelected = new Set<keyof CampaignOutput>()
    
    switch (preset) {
      case 'executive':
        if (outputs.overview) newSelected.add('overview')
        if (outputs.strategy) newSelected.add('strategy')
        if (outputs.measurementUtms) newSelected.add('measurementUtms')
        break
      case 'creative':
        if (outputs.overview) newSelected.add('overview')
        if (outputs.creativeRoutes) newSelected.add('creativeRoutes')
        if (outputs.landingKit) newSelected.add('landingKit')
        break
      case 'tactical':
        if (outputs.funnelBlueprint) newSelected.add('funnelBlueprint')
        if (outputs.paidPack) newSelected.add('paidPack')
        if (outputs.flows) newSelected.add('flows')
        if (outputs.executionChecklist) newSelected.add('executionChecklist')
        break
      case 'complete':
        exportSections.filter(s => s.available).forEach(s => newSelected.add(s.id))
        break
    }
    
    setSelectedSections(newSelected)
  }

  const buildContent = () => {
    let content = ''
    content += `<h1>${t('Campaña de Marketing', 'Marketing Campaign')}</h1>\n`
    content += `<p class="subtitle">${t('Exportado desde War Room Command Center', 'Exported from War Room Command Center')}</p>\n`

    if (selectedSections.has('overview') && outputs.overview) {
      content += `<div class="section">\n`
      content += `<h2>${t('Resumen Ejecutivo', 'Executive Summary')}</h2>\n`
      if (outputs.overview.objective) {
        content += `<h3>${t('Objetivo', 'Objective')}</h3>\n`
        content += `<p>${outputs.overview.objective}</p>\n`
      }
      if (outputs.overview.kpi) {
        content += `<h3>KPI</h3>\n`
        content += `<p>${outputs.overview.kpi}</p>\n`
      }
      if (outputs.overview.primaryAudience) {
        content += `<h3>${t('Audiencia Primaria', 'Primary Audience')}</h3>\n`
        content += `<p>${outputs.overview.primaryAudience}</p>\n`
      }
      if (outputs.overview.valueProposition) {
        content += `<h3>${t('Propuesta de Valor', 'Value Proposition')}</h3>\n`
        content += `<p>${outputs.overview.valueProposition}</p>\n`
      }
      if (outputs.overview.mainMessage) {
        content += `<h3>${t('Mensaje Principal', 'Main Message')}</h3>\n`
        content += `<p>${outputs.overview.mainMessage}</p>\n`
      }
      if (outputs.overview.rtbs && outputs.overview.rtbs.length > 0) {
        content += `<h3>RTBs</h3>\n<ul>\n`
        outputs.overview.rtbs.forEach(rtb => {
          content += `<li>${rtb}</li>\n`
        })
        content += `</ul>\n`
      }
      if (outputs.overview.recommendedCTA) {
        content += `<h3>${t('CTA Recomendado', 'Recommended CTA')}</h3>\n`
        content += `<p>${outputs.overview.recommendedCTA}</p>\n`
      }
      if (outputs.overview.launchPriority && outputs.overview.launchPriority.length > 0) {
        content += `<h3>${t('Qué Lanzar Primero', 'Launch Priority')}</h3>\n<ol>\n`
        outputs.overview.launchPriority.forEach(item => {
          content += `<li>${item}</li>\n`
        })
        content += `</ol>\n`
      }
      if (outputs.overview.alerts) {
        if (outputs.overview.alerts.tbds && outputs.overview.alerts.tbds.length > 0) {
          content += `<h3>TBDs</h3>\n<ul>\n`
          outputs.overview.alerts.tbds.forEach(tbd => {
            content += `<li>${tbd}</li>\n`
          })
          content += `</ul>\n`
        }
        if (outputs.overview.alerts.risks && outputs.overview.alerts.risks.length > 0) {
          content += `<h3>${t('Riesgos', 'Risks')}</h3>\n<ul>\n`
          outputs.overview.alerts.risks.forEach(risk => {
            content += `<li>${risk}</li>\n`
          })
          content += `</ul>\n`
        }
      }
      content += `</div>\n`
    }

    if (selectedSections.has('strategy') && outputs.strategy) {
      content += `<div class="section">\n`
      content += `<h2>${t('Estrategia de Comunicación', 'Communication Strategy')}</h2>\n`
      const strategyText = typeof outputs.strategy === 'string' ? outputs.strategy : JSON.stringify(outputs.strategy, null, 2)
      content += `<div class="content-text">${strategyText.replace(/\n/g, '<br>')}</div>\n`
      content += `</div>\n`
    }

    if (selectedSections.has('creativeRoutes') && outputs.creativeRoutes) {
      content += `<div class="section">\n`
      content += `<h2>${t('Rutas Creativas', 'Creative Routes')}</h2>\n`
      if (Array.isArray(outputs.creativeRoutes)) {
        outputs.creativeRoutes.forEach((route: any, idx: number) => {
          content += `<div class="subsection">\n`
          content += `<h3>${t('Ruta', 'Route')} ${idx + 1}</h3>\n`
          if (route.bigIdea) content += `<p><strong>${t('Gran Idea', 'Big Idea')}:</strong> ${route.bigIdea}</p>\n`
          if (route.tagline) content += `<p><strong>Tagline:</strong> ${route.tagline}</p>\n`
          if (route.keyMessage) content += `<p><strong>${t('Mensaje Clave', 'Key Message')}:</strong> ${route.keyMessage}</p>\n`
          if (route.visualStyle) content += `<p><strong>${t('Estilo Visual', 'Visual Style')}:</strong> ${route.visualStyle}</p>\n`
          if (route.format) content += `<p><strong>Format:</strong> ${route.format}</p>\n`
          content += `</div>\n`
        })
      } else {
        const routesText = typeof outputs.creativeRoutes === 'string' ? outputs.creativeRoutes : JSON.stringify(outputs.creativeRoutes, null, 2)
        content += `<div class="content-text">${routesText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    if (selectedSections.has('funnelBlueprint') && outputs.funnelBlueprint) {
      content += `<div class="section">\n`
      content += `<h2>${t('Blueprint de Funnel', 'Funnel Blueprint')}</h2>\n`
      if (Array.isArray(outputs.funnelBlueprint)) {
        outputs.funnelBlueprint.forEach((phase: any, idx: number) => {
          content += `<div class="subsection">\n`
          content += `<h3>${phase.name || `${t('Fase', 'Phase')} ${idx + 1}`}</h3>\n`
          if (phase.goal) content += `<p><strong>${t('Objetivo', 'Goal')}:</strong> ${phase.goal}</p>\n`
          if (phase.tactics && Array.isArray(phase.tactics)) {
            content += `<p><strong>${t('Tácticas', 'Tactics')}:</strong></p>\n<ul>\n`
            phase.tactics.forEach((tactic: string) => {
              content += `<li>${tactic}</li>\n`
            })
            content += `</ul>\n`
          }
          if (phase.content && Array.isArray(phase.content)) {
            content += `<p><strong>${t('Contenido', 'Content')}:</strong></p>\n<ul>\n`
            phase.content.forEach((item: string) => {
              content += `<li>${item}</li>\n`
            })
            content += `</ul>\n`
          }
          if (phase.kpi) content += `<p><strong>KPI:</strong> ${phase.kpi}</p>\n`
          content += `</div>\n`
        })
      } else {
        const funnelText = typeof outputs.funnelBlueprint === 'string' ? outputs.funnelBlueprint : JSON.stringify(outputs.funnelBlueprint, null, 2)
        content += `<div class="content-text">${funnelText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    if (selectedSections.has('paidPack') && outputs.paidPack) {
      content += `<div class="section">\n`
      content += `<h2>${t('Paid Media Pack', 'Paid Media Pack')}</h2>\n`
      if (typeof outputs.paidPack === 'object' && !Array.isArray(outputs.paidPack)) {
        const pack: any = outputs.paidPack
        if (pack.channels && Array.isArray(pack.channels)) {
          pack.channels.forEach((channel: any) => {
            content += `<div class="subsection">\n`
            content += `<h3>${channel.name || channel.channel}</h3>\n`
            if (channel.budget) content += `<p><strong>${t('Presupuesto', 'Budget')}:</strong> ${channel.budget}</p>\n`
            if (channel.objective) content += `<p><strong>${t('Objetivo', 'Objective')}:</strong> ${channel.objective}</p>\n`
            if (channel.targeting) content += `<p><strong>Targeting:</strong> ${channel.targeting}</p>\n`
            if (channel.formats && Array.isArray(channel.formats)) {
              content += `<p><strong>${t('Formatos', 'Formats')}:</strong></p>\n<ul>\n`
              channel.formats.forEach((format: string) => {
                content += `<li>${format}</li>\n`
              })
              content += `</ul>\n`
            }
            content += `</div>\n`
          })
        }
      } else {
        const paidText = typeof outputs.paidPack === 'string' ? outputs.paidPack : JSON.stringify(outputs.paidPack, null, 2)
        content += `<div class="content-text">${paidText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    if (selectedSections.has('landingKit') && outputs.landingKit) {
      content += `<div class="section">\n`
      content += `<h2>${t('Landing Page Kit', 'Landing Page Kit')}</h2>\n`
      if (typeof outputs.landingKit === 'object' && !Array.isArray(outputs.landingKit)) {
        const kit: any = outputs.landingKit
        if (kit.sections && Array.isArray(kit.sections)) {
          content += `<h3>${t('Secciones', 'Sections')}</h3>\n`
          kit.sections.forEach((section: any) => {
            content += `<div class="subsection">\n`
            content += `<h4>${section.name}</h4>\n`
            if (section.headline) content += `<p><strong>Headline:</strong> ${section.headline}</p>\n`
            if (section.subheadline) content += `<p><strong>Subheadline:</strong> ${section.subheadline}</p>\n`
            if (section.copy) content += `<p>${section.copy}</p>\n`
            content += `</div>\n`
          })
        }
        if (kit.formMicrocopy) {
          content += `<h3>${t('Microcopy del Formulario', 'Form Microcopy')}</h3>\n`
          const micro: any = kit.formMicrocopy
          if (micro.submit) content += `<p><strong>Submit:</strong> ${micro.submit}</p>\n`
          if (micro.privacy) content += `<p><strong>Privacy:</strong> ${micro.privacy}</p>\n`
        }
      } else {
        const landingText = typeof outputs.landingKit === 'string' ? outputs.landingKit : JSON.stringify(outputs.landingKit, null, 2)
        content += `<div class="content-text">${landingText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    if (selectedSections.has('flows') && outputs.flows && Array.isArray(outputs.flows)) {
      content += `<div class="section">\n`
      content += `<h2>${t('Secuencias de Automatización', 'Automation Flows')}</h2>\n`
      outputs.flows.forEach((flow: any) => {
        content += `<div class="subsection">\n`
        content += `<h3>${flow.name}</h3>\n`
        if (flow.description) content += `<p>${flow.description}</p>\n`
        if (flow.messages && Array.isArray(flow.messages)) {
          content += `<p><strong>${t('Total de mensajes', 'Total messages')}:</strong> ${flow.messages.length}</p>\n`
          flow.messages.forEach((msg: any, idx: number) => {
            content += `<div class="message">\n`
            content += `<p><strong>${t('Mensaje', 'Message')} ${idx + 1}</strong> (${msg.channel || 'email'})</p>\n`
            if (msg.subject) content += `<p><strong>Subject:</strong> ${msg.subject}</p>\n`
            if (msg.firstLine) content += `<p><strong>${t('Primera línea', 'First line')}:</strong> ${msg.firstLine}</p>\n`
            if (msg.timing) content += `<p><strong>Timing:</strong> ${msg.timing}</p>\n`
            content += `</div>\n`
          })
        }
        content += `</div>\n`
      })
      content += `</div>\n`
    }

    if (selectedSections.has('measurementUtms') && outputs.measurementUtms) {
      content += `<div class="section">\n`
      content += `<h2>${t('Medición y UTMs', 'Measurement & UTMs')}</h2>\n`
      if (typeof outputs.measurementUtms === 'object' && !Array.isArray(outputs.measurementUtms)) {
        const measurement: any = outputs.measurementUtms
        if (measurement.kpisByPhase) {
          content += `<h3>KPIs ${t('por Fase', 'by Phase')}</h3>\n`
          const kpiText = typeof measurement.kpisByPhase === 'string' ? measurement.kpisByPhase : JSON.stringify(measurement.kpisByPhase, null, 2)
          content += `<div class="content-text">${kpiText.replace(/\n/g, '<br>')}</div>\n`
        }
        if (measurement.utmTemplate) {
          content += `<h3>${t('Plantilla de UTMs', 'UTM Template')}</h3>\n`
          const utmText = typeof measurement.utmTemplate === 'string' ? measurement.utmTemplate : JSON.stringify(measurement.utmTemplate, null, 2)
          content += `<div class="content-text">${utmText.replace(/\n/g, '<br>')}</div>\n`
        }
      } else {
        const measurementText = typeof outputs.measurementUtms === 'string' ? outputs.measurementUtms : JSON.stringify(outputs.measurementUtms, null, 2)
        content += `<div class="content-text">${measurementText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    if (selectedSections.has('executionChecklist') && outputs.executionChecklist) {
      content += `<div class="section">\n`
      content += `<h2>${t('Checklist de Ejecución', 'Execution Checklist')}</h2>\n`
      if (typeof outputs.executionChecklist === 'object' && !Array.isArray(outputs.executionChecklist)) {
        const checklist: any = outputs.executionChecklist
        if (checklist.phases && Array.isArray(checklist.phases)) {
          checklist.phases.forEach((phase: any) => {
            content += `<div class="subsection">\n`
            content += `<h3>${phase.name}</h3>\n`
            if (phase.tasks && Array.isArray(phase.tasks)) {
              content += `<ul class="checklist">\n`
              phase.tasks.forEach((task: any) => {
                const taskText = typeof task === 'string' ? task : task.name || task.task
                content += `<li>☐ ${taskText}</li>\n`
              })
              content += `</ul>\n`
            }
            content += `</div>\n`
          })
        }
      } else {
        const checklistText = typeof outputs.executionChecklist === 'string' ? outputs.executionChecklist : JSON.stringify(outputs.executionChecklist, null, 2)
        content += `<div class="content-text">${checklistText.replace(/\n/g, '<br>')}</div>\n`
      }
      content += `</div>\n`
    }

    return content
  }

  const exportToPDF = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección', 'Select at least one section'))
      return
    }
    setIsExportingPDF(true)
    try {
      const filteredOutputs: Partial<CampaignOutput> = {}
      selectedSections.forEach(section => {
        if (outputs[section]) {
          (filteredOutputs as any)[section] = outputs[section]
        }
      })
      
      exportCampaignToPDF({
        outputs: filteredOutputs,
        language
      })
      
      toast.success(t('PDF exportado exitosamente', 'PDF exported successfully'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar', 'Export error'))
    } finally {
      setIsExportingPDF(false)
    }
  }

  const exportToWord = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección', 'Select at least one section'))
      return
    }
    setIsExportingWord(true)
    try {
      const content = buildContent()
      const timestamp = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="UTF-8">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <style>
    body { 
      font-family: 'Calibri', 'Arial', sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 40px;
    }
    h1 { 
      font-size: 36pt; 
      color: #5eb3a1; 
      font-weight: bold; 
      margin-bottom: 12pt;
      border-bottom: 3pt solid #5eb3a1;
      padding-bottom: 8pt;
    }
    h2 { 
      font-size: 24pt; 
      color: #2a2a3e; 
      font-weight: bold; 
      margin-top: 36pt; 
      margin-bottom: 16pt;
      border-left: 6pt solid #5eb3a1;
      padding-left: 12pt;
    }
    h3 { 
      font-size: 18pt; 
      font-weight: bold; 
      margin-top: 24pt; 
      margin-bottom: 12pt;
      color: #3d3d4e;
    }
    h4 { 
      font-size: 14pt; 
      font-weight: bold; 
      margin-top: 16pt; 
      margin-bottom: 8pt;
      color: #5eb3a1;
    }
    p { 
      margin-bottom: 12pt; 
      font-size: 11pt;
    }
    ul, ol { 
      margin-left: 24pt; 
      margin-bottom: 12pt; 
    }
    li { 
      margin-bottom: 6pt; 
    }
    .subtitle {
      font-size: 10pt;
      color: #888;
      font-style: italic;
      margin-bottom: 6pt;
    }
    .section {
      page-break-inside: avoid;
      margin-bottom: 36pt;
    }
    .subsection {
      margin-top: 16pt;
      margin-bottom: 16pt;
      padding: 12pt;
      background-color: #f9fdfc;
      border-left: 3pt solid #dceee9;
    }
  </style>
</head>
<body>
  <p class="subtitle">${t('Exportado el', 'Exported on')} ${timestamp}</p>
  ${content}
</body>
</html>
      `
      const blob = new Blob([wordHtml], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-export-${Date.now()}.doc`
      link.click()
      URL.revokeObjectURL(url)
      toast.success(t('Exportado a Word', 'Exported to Word'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar', 'Export error'))
    } finally {
      setIsExportingWord(false)
    }
  }

  const exportToHTML = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección', 'Select at least one section'))
      return
    }
    setIsExportingHTML(true)
    try {
      const content = buildContent()
      const timestamp = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      line-height: 1.7; 
      max-width: 1400px; 
      margin: 0 auto; 
      padding: 60px 40px; 
      background: linear-gradient(135deg, #f8fcfb 0%, #f6faf9 50%, #fdf8fa 100%);
      color: #333;
    }
    .container { 
      background: white; 
      padding: 80px; 
      box-shadow: 0 8px 32px rgba(94, 179, 161, 0.15); 
      border-radius: 16px;
      border: 1px solid rgba(94, 179, 161, 0.2);
    }
    .header { 
      border-bottom: 3px solid #5eb3a1; 
      padding-bottom: 32px; 
      margin-bottom: 48px; 
    }
    h1 { 
      font-family: 'Space Grotesk', sans-serif;
      font-size: 56px; 
      color: #5eb3a1; 
      font-weight: 700; 
      margin-bottom: 16px; 
      letter-spacing: -1px;
    }
    .subtitle {
      font-size: 14px;
      color: #888;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .timestamp {
      font-size: 14px;
      color: #666;
      font-style: italic;
    }
    h2 { 
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px; 
      margin-top: 64px; 
      margin-bottom: 32px; 
      color: #2a2a3e; 
      border-left: 6px solid #5eb3a1; 
      padding-left: 24px;
      font-weight: 600;
    }
    h3 { 
      font-size: 24px; 
      margin-top: 40px; 
      margin-bottom: 20px; 
      font-weight: 600; 
      color: #3d3d4e;
    }
    h4 { 
      font-size: 18px; 
      margin-top: 24px; 
      margin-bottom: 12px; 
      font-weight: 600; 
      color: #5eb3a1;
    }
    p { 
      margin-bottom: 20px; 
      color: #444; 
      font-size: 16px;
      line-height: 1.8;
    }
    strong {
      color: #2a2a3e;
      font-weight: 600;
    }
    ul, ol { 
      padding-left: 40px; 
      margin-bottom: 24px; 
    }
    li { 
      margin-bottom: 12px; 
      color: #444;
      line-height: 1.6;
    }
    .section { 
      margin-bottom: 80px; 
      page-break-inside: avoid;
    }
    .subsection { 
      margin-top: 32px; 
      margin-bottom: 32px;
      padding: 24px;
      background: #f9fdfc;
      border-left: 3px solid #dceee9;
      border-radius: 8px;
    }
    .message {
      margin: 16px 0;
      padding: 16px;
      background: #fafafa;
      border-radius: 6px;
      border-left: 2px solid #e0b560;
    }
    .content-text {
      white-space: pre-wrap;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      background: #f4f4f4;
      padding: 24px;
      border-radius: 8px;
      line-height: 1.6;
      margin: 20px 0;
      overflow-x: auto;
    }
    ul.checklist {
      list-style: none;
      padding-left: 0;
    }
    ul.checklist li {
      padding: 8px 12px;
      margin: 6px 0;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-family: monospace;
    }
    @media print {
      body { 
        padding: 0; 
        background: white; 
      }
      .container { 
        box-shadow: none; 
        border: none;
        padding: 40px;
      }
      .section { 
        page-break-after: always; 
      }
    }
    @media (max-width: 768px) {
      body { 
        padding: 20px; 
      }
      .container { 
        padding: 32px 24px; 
      }
      h1 { 
        font-size: 36px; 
      }
      h2 { 
        font-size: 28px; 
      }
      h3 { 
        font-size: 20px; 
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${content.includes('<h1>') ? '' : `<h1>${t('Campaña de Marketing', 'Marketing Campaign')}</h1>`}
      <div class="timestamp">${t('Exportado el', 'Exported on')} ${timestamp}</div>
    </div>
    ${content}
  </div>
</body>
</html>
      `
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-export-${Date.now()}.html`
      link.click()
      URL.revokeObjectURL(url)
      toast.success(t('Exportado a HTML', 'Exported to HTML'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar', 'Export error'))
    } finally {
      setIsExportingHTML(false)
    }
  }

  const hasCampaignData = outputs.overview || outputs.strategy || outputs.creativeRoutes

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('Exportar Campaña', 'Export Campaign')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t('Presets rápidos', 'Quick Presets')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleQuickPreset('executive')}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                <FileText size={14} weight="fill" className="mr-2" />
                {t('Ejecutivo', 'Executive')}
              </Button>
              <Button
                onClick={() => handleQuickPreset('creative')}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                <Sparkle size={14} weight="fill" className="mr-2" />
                {t('Creativo', 'Creative')}
              </Button>
              <Button
                onClick={() => handleQuickPreset('tactical')}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                <Lightning size={14} weight="fill" className="mr-2" />
                {t('Táctico', 'Tactical')}
              </Button>
              <Button
                onClick={() => handleQuickPreset('complete')}
                variant="outline"
                size="sm"
                className="text-xs justify-start"
              >
                <FilePdf size={14} weight="fill" className="mr-2" />
                {t('Completo', 'Complete')}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('Selecciona las secciones a exportar', 'Select sections to export')}
              <span className="ml-2 text-xs font-mono">
                ({selectedSections.size} {t('seleccionadas', 'selected')})
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAll}
                variant="ghost"
                size="sm"
                className="text-xs h-7"
              >
                {t('Todas', 'All')}
              </Button>
              <Button
                onClick={handleDeselectAll}
                variant="ghost"
                size="sm"
                className="text-xs h-7"
              >
                {t('Ninguna', 'None')}
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-2">
              {exportSections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                    section.available
                      ? 'border-border hover:border-primary/50 cursor-pointer'
                      : 'border-border opacity-50 cursor-not-allowed'
                  } ${selectedSections.has(section.id) ? 'bg-primary/5 border-primary' : ''}`}
                  onClick={() => section.available && handleSectionToggle(section.id)}
                >
                  <Checkbox
                    checked={selectedSections.has(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                    disabled={!section.available}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={section.id}
                      className={`font-medium ${section.available ? '' : 'cursor-not-allowed'}`}
                    >
                      {section.label}
                    </Label>
                    {!section.available && (
                      <p className="text-xs text-muted-foreground">
                        {t('No disponible', 'Not available')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-sm font-semibold mb-2">HTML</div>
              <Button
                onClick={exportToHTML}
                disabled={isExportingHTML || selectedSections.size === 0}
                className="w-full gap-2 h-auto py-3 flex-col"
              >
                {isExportingHTML ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <FileHtml size={20} weight="fill" />
                )}
                <span className="text-xs">{t('Exportar', 'Export')}</span>
              </Button>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Word</div>
              <Button
                onClick={exportToWord}
                disabled={isExportingWord || selectedSections.size === 0}
                className="w-full gap-2 h-auto py-3 flex-col"
              >
                {isExportingWord ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <FileText size={20} weight="fill" />
                )}
                <span className="text-xs">{t('Exportar', 'Export')}</span>
              </Button>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">PDF</div>
              <Button
                onClick={exportToPDF}
                disabled={isExportingPDF || selectedSections.size === 0}
                className="w-full gap-2 h-auto py-3 flex-col"
              >
                {isExportingPDF ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <FilePdf size={20} weight="fill" />
                )}
                <span className="text-xs">{t('Exportar', 'Export')}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
