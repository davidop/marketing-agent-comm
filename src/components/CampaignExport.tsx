import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, FilePdf, FileHtml, Spinner } from '@phosphor-icons/react'
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

  const buildContent = () => {
    let content = ''
    content += `<h1>${t('Campaña de Marketing', 'Marketing Campaign')}</h1>\n`

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
      content += `</div>\n`
    }

    if (selectedSections.has('strategy') && outputs.strategy) {
      content += `<div class="section">\n`
      content += `<h2>${t('Estrategia', 'Strategy')}</h2>\n`
      content += `<p>${outputs.strategy}</p>\n`
      content += `</div>\n`
    }

    if (selectedSections.has('creativeRoutes') && outputs.creativeRoutes && Array.isArray(outputs.creativeRoutes)) {
      content += `<div class="section">\n`
      content += `<h2>${t('Rutas Creativas', 'Creative Routes')}</h2>\n`
      outputs.creativeRoutes.forEach((route: any, idx: number) => {
        content += `<h3>${t('Ruta', 'Route')} ${idx + 1}</h3>\n`
        if (route.bigIdea) content += `<p><strong>${t('Gran Idea', 'Big Idea')}:</strong> ${route.bigIdea}</p>\n`
        if (route.tagline) content += `<p><strong>Tagline:</strong> ${route.tagline}</p>\n`
      })
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
      const wordHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="UTF-8">
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
</head>
<body>
  ${content}
</body>
</html>
      `
      const blob = new Blob([wordHtml], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'campaign-export.doc'
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
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${t('Campaña de Marketing', 'Marketing Campaign')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.8; max-width: 1200px; margin: 0 auto; padding: 60px 40px; background: #fafafa; }
    .container { background: white; padding: 60px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    h1 { font-size: 48px; color: #5eb3a1; font-weight: 700; margin-bottom: 32px; }
    h2 { font-size: 32px; margin-top: 60px; margin-bottom: 24px; color: #2a2a3e; border-left: 6px solid #5eb3a1; padding-left: 20px; }
    h3 { font-size: 24px; margin-top: 32px; margin-bottom: 16px; font-weight: 600; }
    p { margin-bottom: 16px; color: #333; }
    ul { padding-left: 32px; margin-bottom: 24px; }
    .section { margin-bottom: 60px; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
      `
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'campaign-export.html'
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
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('Selecciona las secciones a exportar', 'Select sections to export')}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {t('Seleccionar todo', 'Select all')}
              </Button>
              <Button
                onClick={handleDeselectAll}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {t('Deseleccionar todo', 'Deselect all')}
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
