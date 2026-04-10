import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DownloadSimple, 
  FilePdf, 
  FileDoc,
  Spinner
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { CampaignOutput } from '@/lib/types'

interface CampaignExportProps {
  outputs: Partial<CampaignOutput>
  language: 'es' | 'en'
}

export function CampaignExport({ outputs, language }: CampaignExportProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingPPTX, setIsExportingPPTX] = useState(false)

  const t = (es: string, en: string) => language === 'es' ? es : en

  const exportToPDF = async () => {
    setIsExportingPDF(true)
    try {
      const content = generateExportContent()
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      font-family: 'Space Grotesk', sans-serif;
      color: oklch(0.75 0.12 165);
      font-size: 32px;
      margin-bottom: 8px;
      border-bottom: 3px solid oklch(0.75 0.12 165);
      padding-bottom: 12px;
    }
    h2 {
      font-family: 'Space Grotesk', sans-serif;
      color: oklch(0.25 0.03 240);
      font-size: 24px;
      margin-top: 32px;
      margin-bottom: 16px;
      border-left: 4px solid oklch(0.85 0.15 50);
      padding-left: 12px;
    }
    h3 {
      font-family: 'Space Grotesk', sans-serif;
      color: oklch(0.25 0.03 240);
      font-size: 18px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 12px;
    }
    ul, ol {
      margin-bottom: 16px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
    .meta {
      color: #666;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .badge-primary {
      background: oklch(0.75 0.12 165 / 0.15);
      color: oklch(0.75 0.12 165);
    }
    .badge-secondary {
      background: oklch(0.88 0.08 340 / 0.15);
      color: oklch(0.88 0.08 340);
    }
    .badge-accent {
      background: oklch(0.85 0.15 50 / 0.15);
      color: oklch(0.85 0.15 50);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    th {
      background: oklch(0.75 0.12 165 / 0.1);
      font-weight: 600;
      color: oklch(0.25 0.03 240);
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body {
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
      h1, h2 {
        page-break-after: avoid;
      }
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
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-${Date.now()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('Campaña exportada correctamente', 'Campaign exported successfully'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar la campaña', 'Error exporting campaign'))
    } finally {
      setIsExportingPDF(false)
    }
  }

  const exportToPowerPoint = async () => {
    setIsExportingPPTX(true)
    try {
      const content = generateExportContent()
      
      const markdownContent = `# ${t('Campaña de Marketing', 'Marketing Campaign')}

${t('Generado', 'Generated')}: ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

${content}

---

${t('Generado con Campaign Impact Hub', 'Generated with Campaign Impact Hub')}
`
      
      const blob = new Blob([markdownContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-${Date.now()}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('Campaña exportada correctamente. Importa el archivo .md en PowerPoint usando un convertidor.', 'Campaign exported successfully. Import the .md file into PowerPoint using a converter.'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('Error al exportar la campaña', 'Error exporting campaign'))
    } finally {
      setIsExportingPPTX(false)
    }
  }

  const generateExportContent = (): string => {
    let content = ''

    content += `<h1>${t('Campaña de Marketing', 'Marketing Campaign')}</h1>\n`
    content += `<p class="meta">${t('Generado', 'Generated')}: ${new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>\n`

    if (outputs.overview) {
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

    if (outputs.strategy) {
      content += `<div class="section">\n`
      content += `<h2>${t('Estrategia de Campaña', 'Campaign Strategy')}</h2>\n`
      content += `<p>${outputs.strategy.replace(/\n/g, '<br>')}</p>\n`
      content += `</div>\n`
    }

    if (Array.isArray(outputs.creativeRoutes) && outputs.creativeRoutes.length > 0) {
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

    if (Array.isArray(outputs.funnelBlueprint) && outputs.funnelBlueprint.length > 0) {
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

    if (typeof outputs.paidPack === 'object' && outputs.paidPack !== null) {
      content += `<div class="section">\n`
      content += `<h2>${t('Pack de Paid Media', 'Paid Media Pack')}</h2>\n`
      
      const paidData = outputs.paidPack as any
      
      if (paidData.copyVariants) {
        if (paidData.copyVariants.hooks && paidData.copyVariants.hooks.length > 0) {
          content += `<h3>Hooks</h3>\n<ul>\n`
          paidData.copyVariants.hooks.slice(0, 5).forEach((hook: string) => {
            content += `<li>${hook}</li>\n`
          })
          content += `</ul>\n`
        }
        
        if (paidData.copyVariants.headlines && paidData.copyVariants.headlines.length > 0) {
          content += `<h3>Headlines</h3>\n<ul>\n`
          paidData.copyVariants.headlines.slice(0, 5).forEach((headline: string) => {
            content += `<li>${headline}</li>\n`
          })
          content += `</ul>\n`
        }
      }
      
      content += `</div>\n`
    }

    if (Array.isArray(outputs.contentCalendar) && outputs.contentCalendar.length > 0) {
      content += `<div class="section">\n`
      content += `<h2>${t('Calendario de Contenido', 'Content Calendar')}</h2>\n`
      content += `<table>\n`
      content += `<thead><tr>`
      content += `<th>${t('Fecha', 'Date')}</th>`
      content += `<th>${t('Canal', 'Channel')}</th>`
      content += `<th>${t('Formato', 'Format')}</th>`
      content += `<th>${t('Objetivo', 'Objective')}</th>`
      content += `</tr></thead>\n`
      content += `<tbody>\n`
      
      outputs.contentCalendar.slice(0, 10).forEach(item => {
        content += `<tr>`
        content += `<td>${item.date || ''}</td>`
        content += `<td>${item.canal || ''}</td>`
        content += `<td>${item.formato || ''}</td>`
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

  const hasCampaignData = outputs.overview || outputs.strategy || outputs.creativeRoutes || outputs.funnelBlueprint

  return (
    <div className="flex gap-3">
      <Button
        onClick={exportToPDF}
        disabled={isExportingPDF || !hasCampaignData}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isExportingPDF ? (
          <Spinner size={16} className="animate-spin" />
        ) : (
          <FilePdf size={16} weight="fill" />
        )}
        {t('Exportar a PDF', 'Export to PDF')}
      </Button>

      <Button
        onClick={exportToPowerPoint}
        disabled={isExportingPPTX || !hasCampaignData}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isExportingPPTX ? (
          <Spinner size={16} className="animate-spin" />
        ) : (
          <FileDoc size={16} weight="fill" />
        )}
        {t('Exportar a PowerPoint', 'Export to PowerPoint')}
      </Button>
    </div>
  )
}
