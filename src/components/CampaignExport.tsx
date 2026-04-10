import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  DownloadSimple, 
  FilePdf, 
  FileDoc,
  Spinner,
  CheckCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { CampaignOutput } from '@/lib/types'

interface CampaignExportProps {
  outputs: Partial<CampaignOutput>
  language: 'es' | 'en'
}

type ExportSection = {
  id: keyof CampaignOutput
  label: string
  available: boolean
}

export function CampaignExport({ outputs, language }: CampaignExportProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingPPTX, setIsExportingPPTX] = useState(false)
  const [isExportingSlides, setIsExportingSlides] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSections, setSelectedSections] = useState<Set<keyof CampaignOutput>>(new Set())

  const t = (es: string, en: string) => language === 'es' ? es : en

  const exportSections: ExportSection[] = [
    { id: 'overview', label: t('Overview Ejecutivo', 'Executive Overview'), available: !!outputs.overview },
    { id: 'strategy', label: t('Estrategia', 'Strategy'), available: !!outputs.strategy },
    { id: 'creativeRoutes', label: t('Rutas Creativas', 'Creative Routes'), available: !!outputs.creativeRoutes },
    { id: 'funnelBlueprint', label: t('Blueprint del Funnel', 'Funnel Blueprint'), available: !!outputs.funnelBlueprint },
    { id: 'paidPack', label: t('Pack de Paid Media', 'Paid Media Pack'), available: !!outputs.paidPack },
    { id: 'landingKit', label: t('Kit de Landing', 'Landing Kit'), available: !!outputs.landingKit },
    { id: 'contentCalendar', label: t('Calendario de Contenido', 'Content Calendar'), available: !!outputs.contentCalendar },
    { id: 'flows', label: t('Flujos de Email/WhatsApp', 'Email/WhatsApp Flows'), available: !!outputs.flows },
    { id: 'experimentPlan', label: t('Plan de Experimentos', 'Experiment Plan'), available: !!outputs.experimentPlan },
    { id: 'measurementUtms', label: t('Medición y UTMs', 'Measurement & UTMs'), available: !!outputs.measurementUtms },
    { id: 'risks', label: t('Riesgos y Supuestos', 'Risks & Assumptions'), available: !!outputs.risks },
    { id: 'executionChecklist', label: t('Checklist de Ejecución', 'Execution Checklist'), available: !!outputs.executionChecklist }
  ]

  const toggleSection = (sectionId: keyof CampaignOutput) => {
    const newSelected = new Set(selectedSections)
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId)
    } else {
      newSelected.add(sectionId)
    }
    setSelectedSections(newSelected)
  }

  const selectAll = () => {
    const allAvailable = exportSections.filter(s => s.available).map(s => s.id)
    setSelectedSections(new Set(allAvailable))
  }

  const deselectAll = () => {
    setSelectedSections(new Set())
  }

  const exportToPDF = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección para exportar', 'Select at least one section to export'))
      return
    }
    
    setIsExportingPDF(true)
    setDialogOpen(false)
    try {
      const content = generateExportContent(selectedSections)
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: #ffffff;
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      color: #5eb3a1;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      border-bottom: 4px solid #5eb3a1;
      padding-bottom: 16px;
      page-break-after: avoid;
    }
    h2 {
      font-family: 'Space Grotesk', sans-serif;
      color: #2a2a3e;
      font-size: 26px;
      font-weight: 600;
      margin-top: 40px;
      margin-bottom: 20px;
      border-left: 6px solid #f5a962;
      padding-left: 16px;
      page-break-after: avoid;
    }
    h3 {
      font-family: 'Space Grotesk', sans-serif;
      color: #2a2a3e;
      font-size: 20px;
      font-weight: 600;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 14px;
      font-size: 14px;
      line-height: 1.7;
    }
    ul, ol {
      margin-bottom: 18px;
      padding-left: 28px;
      font-size: 14px;
    }
    li {
      margin-bottom: 10px;
      line-height: 1.6;
    }
    .meta {
      color: #666;
      font-size: 13px;
      margin-bottom: 40px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    .section {
      margin-bottom: 48px;
      page-break-inside: avoid;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .badge-primary {
      background: #e8f5f2;
      color: #5eb3a1;
      border: 1px solid #5eb3a1;
    }
    .badge-secondary {
      background: #f9eef6;
      color: #d97ab8;
      border: 1px solid #d97ab8;
    }
    .badge-accent {
      background: #fef3e8;
      color: #f5a962;
      border: 1px solid #f5a962;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      font-size: 13px;
      page-break-inside: avoid;
    }
    th, td {
      padding: 14px;
      text-align: left;
      border: 1px solid #d0d0d0;
    }
    th {
      background: #e8f5f2;
      font-weight: 600;
      color: #2a2a3e;
      font-family: 'Space Grotesk', sans-serif;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    strong {
      color: #2a2a3e;
      font-weight: 600;
    }
    .footer {
      margin-top: 80px;
      padding-top: 24px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
      page-break-inside: avoid;
    }
    .chart-container {
      margin: 28px 0;
      padding: 24px;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      page-break-inside: avoid;
    }
    @media print {
      body {
        padding: 15mm;
        max-width: 100%;
      }
      .section {
        page-break-inside: avoid;
      }
      h1, h2, h3 {
        page-break-after: avoid;
      }
      table {
        page-break-inside: avoid;
      }
      .chart-container {
        page-break-inside: avoid;
      }
    }
    @page {
      margin: 20mm;
      size: A4;
    }
  </style>
</head>
<body>
  ${content}
  <div class="footer">
    <p>${t('Generado con Campaign Impact Hub', 'Generated with Campaign Impact Hub')} • ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
      `
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        toast.success(t('Abriendo vista previa de PDF. Usa "Guardar como PDF" en el diálogo de impresión.', 'Opening PDF preview. Use "Save as PDF" in the print dialog.'))
      } else {
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `campaign-${Date.now()}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success(t('HTML descargado. Ábrelo y usa Ctrl+P para guardar como PDF.', 'HTML downloaded. Open it and use Ctrl+P to save as PDF.'))
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar la campaña', 'Error exporting campaign'))
    } finally {
      setIsExportingPDF(false)
    }
  }

  const exportToWord = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección para exportar', 'Select at least one section to export'))
      return
    }
    
    setIsExportingPPTX(true)
    setDialogOpen(false)
    try {
      const content = generateExportContent(selectedSections)
      
      const wordHtml = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Microsoft Word">
  <meta name="Originator" content="Microsoft Word">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in 1in 1in 1in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000000;
    }
    h1 {
      font-family: 'Calibri', sans-serif;
      font-size: 28pt;
      font-weight: bold;
      color: #5eb3a1;
      margin-top: 0pt;
      margin-bottom: 12pt;
      border-bottom: 3pt solid #5eb3a1;
      padding-bottom: 6pt;
      page-break-after: avoid;
    }
    h2 {
      font-family: 'Calibri', sans-serif;
      font-size: 20pt;
      font-weight: bold;
      color: #2a2a3e;
      margin-top: 24pt;
      margin-bottom: 12pt;
      border-left: 4pt solid #f5a962;
      padding-left: 12pt;
      page-break-after: avoid;
    }
    h3 {
      font-family: 'Calibri', sans-serif;
      font-size: 16pt;
      font-weight: bold;
      color: #2a2a3e;
      margin-top: 18pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }
    p {
      margin-top: 0pt;
      margin-bottom: 10pt;
      font-size: 11pt;
      line-height: 1.5;
    }
    ul, ol {
      margin-top: 0pt;
      margin-bottom: 10pt;
      padding-left: 24pt;
    }
    li {
      margin-bottom: 6pt;
      font-size: 11pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16pt;
      font-size: 10pt;
    }
    th, td {
      border: 1pt solid #d0d0d0;
      padding: 8pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #e8f5f2;
      font-weight: bold;
      color: #2a2a3e;
    }
    tr:nth-child(even) {
      background-color: #fafafa;
    }
    strong {
      font-weight: bold;
      color: #2a2a3e;
    }
    .meta {
      font-size: 10pt;
      color: #666666;
      margin-bottom: 24pt;
      padding-bottom: 12pt;
      border-bottom: 1pt solid #e0e0e0;
    }
    .section {
      margin-bottom: 32pt;
      page-break-inside: avoid;
    }
    .badge {
      display: inline-block;
      padding: 4pt 10pt;
      border-radius: 4pt;
      font-size: 9pt;
      font-weight: bold;
      margin-right: 6pt;
      margin-bottom: 6pt;
    }
    .badge-primary {
      background-color: #e8f5f2;
      color: #5eb3a1;
      border: 1pt solid #5eb3a1;
    }
    .badge-secondary {
      background-color: #f9eef6;
      color: #d97ab8;
      border: 1pt solid #d97ab8;
    }
    .badge-accent {
      background-color: #fef3e8;
      color: #f5a962;
      border: 1pt solid #f5a962;
    }
    .chart-container {
      margin: 16pt 0;
      padding: 16pt;
      background-color: #fafafa;
      border: 1pt solid #e0e0e0;
      page-break-inside: avoid;
    }
    .footer {
      margin-top: 48pt;
      padding-top: 16pt;
      border-top: 2pt solid #e0e0e0;
      text-align: center;
      font-size: 9pt;
      color: #999999;
    }
  </style>
</head>
<body>
  ${content}
  <div class="footer">
    <p>${t('Generado con Campaign Impact Hub', 'Generated with Campaign Impact Hub')} • ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
</body>
</html>
      `
      
      const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-${Date.now()}.doc`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('Documento Word descargado correctamente. Puedes abrirlo con Microsoft Word o Google Docs.', 'Word document downloaded successfully. You can open it with Microsoft Word or Google Docs.'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar la campaña', 'Error exporting campaign'))
    } finally {
      setIsExportingPPTX(false)
    }
  }

  const generateBarChart = (data: Record<string, number>, total: number, labels: Array<{ key: string; label: string; color: string }>): string => {
    const maxBarWidth = 400
    let chart = `<div style="margin: 24px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;">\n`
    
    labels.forEach(({ key, label, color }) => {
      const count = data[key] || 0
      const percentage = total > 0 ? (count / total * 100).toFixed(1) : '0'
      const barWidth = total > 0 ? (count / total * maxBarWidth) : 0
      
      chart += `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 14px; font-weight: 600;">${label}</span>
            <span style="font-size: 14px; color: #666;">${count} (${percentage}%)</span>
          </div>
          <div style="background: #e0e0e0; height: 24px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${color}; height: 100%; width: ${barWidth}px; border-radius: 4px; transition: width 0.3s;"></div>
          </div>
        </div>
      `
    })
    
    chart += `</div>\n`
    return chart
  }

  const generatePieChart = (data: Record<string, number>, total: number, labels: Array<{ key: string; label: string; color: string }>): string => {
    const size = 200
    const center = size / 2
    const radius = size / 2 - 10
    
    let currentAngle = 0
    let paths = ''
    let legendItems = ''
    
    labels.forEach(({ key, label, color }) => {
      const count = data[key] || 0
      const percentage = total > 0 ? (count / total * 100).toFixed(1) : '0'
      const angle = total > 0 ? (count / total) * 360 : 0
      
      if (angle > 0) {
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        
        const startX = center + radius * Math.cos((startAngle - 90) * Math.PI / 180)
        const startY = center + radius * Math.sin((startAngle - 90) * Math.PI / 180)
        const endX = center + radius * Math.cos((endAngle - 90) * Math.PI / 180)
        const endY = center + radius * Math.sin((endAngle - 90) * Math.PI / 180)
        
        const largeArc = angle > 180 ? 1 : 0
        
        paths += `<path d="M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z" fill="${color}" stroke="#fff" stroke-width="2"/>\n`
        
        currentAngle += angle
      }
      
      legendItems += `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 16px; height: 16px; background: ${color}; border-radius: 2px; margin-right: 8px;"></div>
          <span style="font-size: 14px;">${label}: ${count} (${percentage}%)</span>
        </div>
      `
    })
    
    return `
      <div style="display: flex; align-items: center; gap: 32px; margin: 24px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <svg width="${size}" height="${size}" style="flex-shrink: 0;">
          ${paths}
        </svg>
        <div style="flex: 1;">
          ${legendItems}
        </div>
      </div>
    `
  }

  const generateExportContent = (sectionsToInclude?: Set<keyof CampaignOutput>): string => {
    let content = ''

    content += `<h1>${t('Campaña de Marketing', 'Marketing Campaign')}</h1>\n`
    content += `<p class="meta">${t('Generado', 'Generated')}: ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>\n`

    if (outputs.overview && (!sectionsToInclude || sectionsToInclude.has('overview'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Overview Ejecutivo', 'Executive Overview')}</h2>\n`
      
      if (outputs.overview.objective) {
        content += `<h3>${t('Objetivo', 'Objective')}</h3>\n`
        content += `<p>${outputs.overview.objective}</p>\n`
      }
      
      if (outputs.overview.kpi) {
        content += `<h3>KPI ${t('Principal', 'Primary')}</h3>\n`
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
        content += `<h3>${t('Razones para Creer', 'Reasons to Believe')}</h3>\n`
        content += `<ul>\n`
        outputs.overview.rtbs.forEach(rtb => {
          content += `<li>${rtb}</li>\n`
        })
        content += `</ul>\n`
      }
      
      if (outputs.overview.recommendedCTA) {
        content += `<h3>CTA ${t('Recomendado', 'Recommended')}</h3>\n`
        content += `<p>${outputs.overview.recommendedCTA}</p>\n`
      }
      
      if (outputs.overview.launchPriority && outputs.overview.launchPriority.length > 0) {
        content += `<h3>${t('Qué Lanzar Primero', 'What to Launch First')}</h3>\n`
        content += `<ol>\n`
        outputs.overview.launchPriority.forEach(item => {
          content += `<li>${item}</li>\n`
        })
        content += `</ol>\n`
      }
      
      content += `</div>\n`
    }

    if (outputs.strategy && (!sectionsToInclude || sectionsToInclude.has('strategy'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Estrategia de Campaña', 'Campaign Strategy')}</h2>\n`
      content += `<p>${outputs.strategy.replace(/\n/g, '<br>')}</p>\n`
      content += `</div>\n`
    }

    if (Array.isArray(outputs.creativeRoutes) && outputs.creativeRoutes.length > 0 && (!sectionsToInclude || sectionsToInclude.has('creativeRoutes'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Rutas Creativas', 'Creative Routes')}</h2>\n`
      
      outputs.creativeRoutes.forEach((route, idx) => {
        const routeTypeLabel = route.type === 'safe' 
          ? t('Segura', 'Safe') 
          : route.type === 'bold' 
          ? t('Atrevida', 'Bold') 
          : t('Premium', 'Premium')
        
        content += `<h3>${t('Ruta', 'Route')} ${idx + 1}: ${routeTypeLabel}</h3>\n`
        
        if (route.bigIdea) {
          content += `<p><strong>${t('Big Idea', 'Big Idea')}:</strong> ${route.bigIdea}</p>\n`
        }
        
        if (route.tagline) {
          content += `<p><strong>Tagline:</strong> ${route.tagline}</p>\n`
        }
        
        if (route.hooks && route.hooks.length > 0) {
          content += `<p><strong>Hooks:</strong></p>\n<ul>\n`
          route.hooks.forEach(hook => {
            content += `<li>${hook}</li>\n`
          })
          content += `</ul>\n`
        }
        
        if (route.whenToUse) {
          content += `<p><strong>${t('Cuándo usar', 'When to use')}:</strong> ${route.whenToUse}</p>\n`
        }
      })
      
      content += `</div>\n`
    }

    if (Array.isArray(outputs.funnelBlueprint) && outputs.funnelBlueprint.length > 0 && (!sectionsToInclude || sectionsToInclude.has('funnelBlueprint'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Blueprint del Funnel', 'Funnel Blueprint')}</h2>\n`
      
      outputs.funnelBlueprint.forEach(phase => {
        content += `<h3>${phase.phaseLabel}</h3>\n`
        
        if (phase.objective) {
          content += `<p><strong>${t('Objetivo', 'Objective')}:</strong> ${phase.objective}</p>\n`
        }
        
        if (phase.keyMessage) {
          content += `<p><strong>${t('Mensaje Clave', 'Key Message')}:</strong> ${phase.keyMessage}</p>\n`
        }
        
        if (phase.formats && phase.formats.length > 0) {
          content += `<p><strong>${t('Formatos', 'Formats')}:</strong> ${phase.formats.join(', ')}</p>\n`
        }
        
        if (phase.cta) {
          content += `<p><strong>CTA:</strong> ${phase.cta}</p>\n`
        }
      })
      
      content += `</div>\n`
    }

    if (typeof outputs.paidPack === 'object' && outputs.paidPack !== null && (!sectionsToInclude || sectionsToInclude.has('paidPack'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Pack de Paid Media', 'Paid Media Pack')}</h2>\n`
      
      const paidData = outputs.paidPack as any
      
      if (paidData.budgetDistribution && Array.isArray(paidData.budgetDistribution) && paidData.budgetDistribution.length > 0) {
        content += `<h3>${t('Distribución de Presupuesto', 'Budget Distribution')}</h3>\n`
        
        const budgetData: Record<string, number> = {}
        paidData.budgetDistribution.forEach((phase: any) => {
          if (phase.phase && phase.percentage) {
            budgetData[phase.phase] = phase.percentage
          }
        })
        
        const budgetLabels = Object.keys(budgetData).map((key, idx) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          color: ['oklch(0.75 0.12 165)', 'oklch(0.85 0.15 50)', 'oklch(0.88 0.08 340)', 'oklch(0.70 0.12 165)'][idx % 4]
        }))
        
        content += generatePieChart(budgetData, 100, budgetLabels)
        
        content += `<table style="margin-top: 20px;">\n`
        content += `<thead><tr>`
        content += `<th>${t('Fase', 'Phase')}</th>`
        content += `<th>${t('Porcentaje', 'Percentage')}</th>`
        content += `<th>${t('Asignación', 'Allocation')}</th>`
        content += `<th>${t('Justificación', 'Reasoning')}</th>`
        content += `</tr></thead>\n`
        content += `<tbody>\n`
        
        paidData.budgetDistribution.forEach((phase: any) => {
          content += `<tr>`
          content += `<td><strong>${phase.phase || ''}</strong></td>`
          content += `<td>${phase.percentage || 0}%</td>`
          content += `<td>${phase.allocation || ''}</td>`
          content += `<td>${phase.reasoning || ''}</td>`
          content += `</tr>\n`
        })
        
        content += `</tbody></table>\n`
      }
      
      if (paidData.creativeAngles && Array.isArray(paidData.creativeAngles) && paidData.creativeAngles.length > 0) {
        content += `<h3 style="margin-top: 40px;">${t('Ángulos Creativos', 'Creative Angles')}</h3>\n`
        
        const angleCount: Record<string, number> = {}
        paidData.creativeAngles.forEach((angle: any) => {
          if (angle.angle) {
            angleCount[angle.angle] = 1
          }
        })
        
        const angleLabels = [
          { key: 'beneficio', label: t('Beneficio', 'Benefit'), color: 'oklch(0.75 0.12 165)' },
          { key: 'urgencia', label: t('Urgencia', 'Urgency'), color: 'oklch(0.85 0.15 50)' },
          { key: 'autoridad', label: t('Autoridad', 'Authority'), color: 'oklch(0.88 0.08 340)' },
          { key: 'emocion', label: t('Emoción', 'Emotion'), color: 'oklch(0.70 0.12 165)' },
          { key: 'objeciones', label: t('Objeciones', 'Objections'), color: 'oklch(0.65 0.10 200)' }
        ]
        
        content += generateBarChart(angleCount, paidData.creativeAngles.length, angleLabels)
      }
      
      if (paidData.copyVariants) {
        if (paidData.copyVariants.hooks && paidData.copyVariants.hooks.length > 0) {
          content += `<h3 style="margin-top: 40px;">Hooks ${t('(Top 5)', '(Top 5)')}</h3>\n<ul>\n`
          paidData.copyVariants.hooks.slice(0, 5).forEach((hook: string) => {
            content += `<li>${hook}</li>\n`
          })
          content += `</ul>\n`
        }
        
        if (paidData.copyVariants.headlines && paidData.copyVariants.headlines.length > 0) {
          content += `<h3>Headlines ${t('(Top 5)', '(Top 5)')}</h3>\n<ul>\n`
          paidData.copyVariants.headlines.slice(0, 5).forEach((headline: string) => {
            content += `<li>${headline}</li>\n`
          })
          content += `</ul>\n`
        }
      }
      
      if (paidData.audiences && Array.isArray(paidData.audiences) && paidData.audiences.length > 0) {
        content += `<h3 style="margin-top: 40px;">${t('Audiencias', 'Audiences')}</h3>\n`
        content += `<table>\n`
        content += `<thead><tr>`
        content += `<th>${t('Tipo', 'Type')}</th>`
        content += `<th>${t('Nombre', 'Name')}</th>`
        content += `<th>${t('Tamaño', 'Size')}</th>`
        content += `<th>${t('Descripción', 'Description')}</th>`
        content += `</tr></thead>\n`
        content += `<tbody>\n`
        
        paidData.audiences.forEach((audience: any) => {
          content += `<tr>`
          content += `<td><span class="badge badge-primary">${audience.type || ''}</span></td>`
          content += `<td><strong>${audience.name || ''}</strong></td>`
          content += `<td>${audience.size || ''}</td>`
          content += `<td>${audience.description || ''}</td>`
          content += `</tr>\n`
        })
        
        content += `</tbody></table>\n`
      }
      
      content += `</div>\n`
    }

    if (Array.isArray(outputs.contentCalendar) && outputs.contentCalendar.length > 0 && (!sectionsToInclude || sectionsToInclude.has('contentCalendar'))) {
      content += `<div class="section">\n`
      content += `<h2>${t('Calendario de Contenido', 'Content Calendar')}</h2>\n`
      
      const categoryCount: Record<string, number> = {}
      const channelCount: Record<string, number> = {}
      const funnelPhaseCount: Record<string, number> = {}
      
      outputs.contentCalendar.forEach(item => {
        if (item.categoria) {
          categoryCount[item.categoria] = (categoryCount[item.categoria] || 0) + 1
        }
        if (item.canal) {
          channelCount[item.canal] = (channelCount[item.canal] || 0) + 1
        }
        if (item.funnelPhase) {
          funnelPhaseCount[item.funnelPhase] = (funnelPhaseCount[item.funnelPhase] || 0) + 1
        }
      })
      
      const total = outputs.contentCalendar.length
      
      content += `<h3>${t('Distribución por Categoría', 'Distribution by Category')}</h3>\n`
      content += generateBarChart(categoryCount, total, [
        { key: 'educacion', label: t('Educación', 'Education'), color: 'oklch(0.75 0.12 165)' },
        { key: 'prueba-social', label: t('Prueba Social', 'Social Proof'), color: 'oklch(0.85 0.15 50)' },
        { key: 'venta', label: t('Venta', 'Sales'), color: 'oklch(0.88 0.08 340)' },
        { key: 'comunidad', label: t('Comunidad', 'Community'), color: 'oklch(0.70 0.12 165)' }
      ])
      
      content += `<h3 style="margin-top: 40px;">${t('Distribución por Canal', 'Distribution by Channel')}</h3>\n`
      content += generateBarChart(channelCount, total, Object.keys(channelCount).map((key, idx) => ({
        key,
        label: key,
        color: ['oklch(0.75 0.12 165)', 'oklch(0.85 0.15 50)', 'oklch(0.88 0.08 340)', 'oklch(0.70 0.12 165)', 'oklch(0.65 0.10 200)'][idx % 5]
      })))
      
      content += `<h3 style="margin-top: 40px;">${t('Calendario Detallado', 'Detailed Calendar')}</h3>\n`
      content += `<table>\n`
      content += `<thead><tr>`
      content += `<th>${t('Fecha', 'Date')}</th>`
      content += `<th>${t('Canal', 'Channel')}</th>`
      content += `<th>${t('Formato', 'Format')}</th>`
      content += `<th>${t('Fase', 'Phase')}</th>`
      content += `<th>${t('Objetivo', 'Objective')}</th>`
      content += `</tr></thead>\n`
      content += `<tbody>\n`
      
      outputs.contentCalendar.slice(0, 15).forEach(item => {
        content += `<tr>`
        content += `<td>${item.date || ''}</td>`
        content += `<td>${item.canal || ''}</td>`
        content += `<td>${item.formato || ''}</td>`
        content += `<td>${item.funnelPhase || ''}</td>`
        content += `<td>${item.objetivo || ''}</td>`
        content += `</tr>\n`
      })
      
      content += `</tbody></table>\n`
      content += `</div>\n`
    }

    if (!outputs.overview && !outputs.strategy && !outputs.creativeRoutes) {
      content += `<div class="section">\n`
      content += `<p>${t('No hay contenido de campaña para exportar. Genera una campaña primero.', 'No campaign content to export. Generate a campaign first.')}</p>\n`
      content += `</div>\n`
    }

    return content
  }

  const exportToHTML = async () => {
    if (selectedSections.size === 0) {
      toast.error(t('Selecciona al menos una sección para exportar', 'Select at least one section to export'))
      return
    }
    
    setIsExportingSlides(true)
    setDialogOpen(false)
    try {
      const content = generateExportContent(selectedSections)
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 40px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .container {
      background: #ffffff;
      border-radius: 16px;
      padding: 60px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      color: #5eb3a1;
      margin-bottom: 12px;
      font-weight: 700;
      border-bottom: 4px solid #5eb3a1;
      padding-bottom: 16px;
    }
    h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px;
      color: #2a2a3e;
      margin-top: 60px;
      margin-bottom: 24px;
      font-weight: 600;
      border-left: 6px solid #f5a962;
      padding-left: 20px;
    }
    h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      color: #2a2a3e;
      margin-top: 36px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    p {
      font-size: 16px;
      margin-bottom: 16px;
      line-height: 1.7;
    }
    ul, ol {
      font-size: 16px;
      margin-bottom: 20px;
      padding-left: 32px;
      line-height: 1.7;
    }
    li {
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #d0d0d0;
      padding: 16px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #e8f5f2;
      font-weight: 700;
      color: #2a2a3e;
      font-family: 'Space Grotesk', sans-serif;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    strong {
      color: #2a2a3e;
      font-weight: 600;
    }
    .meta {
      font-size: 14px;
      color: #666;
      margin-bottom: 48px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .section {
      margin-bottom: 60px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .badge-primary {
      background: #e8f5f2;
      color: #5eb3a1;
      border: 1px solid #5eb3a1;
    }
    .badge-secondary {
      background: #f9eef6;
      color: #d97ab8;
      border: 1px solid #d97ab8;
    }
    .badge-accent {
      background: #fef3e8;
      color: #f5a962;
      border: 1px solid #f5a962;
    }
    .chart-container {
      margin: 28px 0;
      padding: 24px;
      background: #fafafa;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
    }
    .footer {
      margin-top: 80px;
      padding-top: 24px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 13px;
      color: #999;
    }
    @media print {
      body {
        background: #fff;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>${t('Generado con Campaign Impact Hub', 'Generated with Campaign Impact Hub')} • ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>
      `
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-${Date.now()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('Campaña exportada en HTML. Abre el archivo para visualizarlo en tu navegador.', 'Campaign exported in HTML. Open the file to view it in your browser.'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar la campaña', 'Error exporting campaign'))
    } finally {
      setIsExportingSlides(false)
    }
  }

  const hasCampaignData = outputs.overview || outputs.strategy || outputs.creativeRoutes || outputs.funnelBlueprint

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!hasCampaignData}
          variant="default"
          size="sm"
          className="gap-2"
        >
          <DownloadSimple size={16} weight="fill" />
          {t('Exportar Campaña', 'Export Campaign')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('Exportar Campaña', 'Export Campaign')}
          </DialogTitle>
          <DialogDescription>
            {t('Selecciona las secciones que deseas incluir en la exportación', 'Select the sections you want to include in the export')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedSections.size} {t('de', 'of')} {exportSections.filter(s => s.available).length} {t('secciones seleccionadas', 'sections selected')}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs"
              >
                {t('Seleccionar todo', 'Select all')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                className="text-xs"
              >
                {t('Deseleccionar todo', 'Deselect all')}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {exportSections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    section.available 
                      ? 'border-border hover:border-primary/50 cursor-pointer transition-colors' 
                      : 'border-border/50 opacity-50 cursor-not-allowed'
                  } ${selectedSections.has(section.id) ? 'bg-primary/5 border-primary' : ''}`}
                  onClick={() => section.available && toggleSection(section.id)}
                >
                  <Checkbox
                    id={section.id}
                    checked={selectedSections.has(section.id)}
                    disabled={!section.available}
                    onCheckedChange={() => section.available && toggleSection(section.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={section.id}
                      className={`text-sm font-medium cursor-pointer ${
                        section.available ? '' : 'cursor-not-allowed'
                      }`}
                    >
                      {section.label}
                    </Label>
                    {!section.available && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('No disponible - genera esta sección primero', 'Not available - generate this section first')}
                      </p>
                    )}
                  </div>
                  {selectedSections.has(section.id) && (
                    <CheckCircle size={20} weight="fill" className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="text-sm font-semibold">
              {t('Formato de exportación', 'Export format')}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={exportToHTML}
                disabled={isExportingSlides || selectedSections.size === 0}
                variant="outline"
                className="gap-2 h-auto py-3 flex-col"
              >
                {isExportingSlides ? (
                  <Spinner size={24} className="animate-spin" />
                ) : (
                  <DownloadSimple size={24} weight="fill" />
                )}
                <span className="text-xs font-medium">
                  HTML
                </span>
              </Button>
              
              <Button
                onClick={exportToWord}
                disabled={isExportingPPTX || selectedSections.size === 0}
                variant="outline"
                className="gap-2 h-auto py-3 flex-col"
              >
                {isExportingPPTX ? (
                  <Spinner size={24} className="animate-spin" />
                ) : (
                  <FileDoc size={24} weight="fill" />
                )}
                <span className="text-xs font-medium">
                  {t('Word', 'Word')}
                </span>
              </Button>
              
              <Button
                onClick={exportToPDF}
                disabled={isExportingPDF || selectedSections.size === 0}
                variant="outline"
                className="gap-2 h-auto py-3 flex-col"
              >
                {isExportingPDF ? (
                  <Spinner size={24} className="animate-spin" />
                ) : (
                  <FilePdf size={24} weight="fill" />
                )}
                <span className="text-xs font-medium">
                  {t('PDF/HTML', 'PDF/HTML')}
                </span>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {t('Los archivos se descargarán en formato HTML optimizado para cada plataforma. Puedes abrirlos directamente o importarlos a tu herramienta preferida.', 'Files will be downloaded in HTML format optimized for each platform. You can open them directly or import them into your preferred tool.')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
