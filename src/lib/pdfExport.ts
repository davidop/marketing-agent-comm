import jsPDF from 'jspdf'
import type { CampaignOutput, CampaignBriefData } from './types'

interface ExportOptions {
  outputs: Partial<CampaignOutput>
  brief?: CampaignBriefData | null
  language: 'es' | 'en'
}

export const exportCampaignToPDF = ({ outputs, brief, language }: ExportOptions) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - (margin * 2)
  let yPosition = margin

  const addPageIfNeeded = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      addPageIfNeeded()
      doc.text(line, margin, yPosition)
      yPosition += fontSize * 0.5
    })
    yPosition += 3
  }

  const addSection = (title: string, content: string | any) => {
    addPageIfNeeded(30)
    yPosition += 5
    addText(title, 14, true, [41, 128, 185])
    yPosition += 2
    
    doc.setDrawColor(41, 128, 185)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8

    if (typeof content === 'string') {
      addText(content, 10, false)
    } else if (typeof content === 'object' && content !== null) {
      addText(JSON.stringify(content, null, 2), 9, false)
    }
    yPosition += 5
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(41, 128, 185)
  doc.text(language === 'es' ? 'Reporte de Campaña' : 'Campaign Report', margin, yPosition)
  yPosition += 15

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(new Date().toLocaleDateString(), margin, yPosition)
  yPosition += 15

  if (brief) {
    addSection(
      language === 'es' ? '📋 Brief Original' : '📋 Original Brief',
      `${language === 'es' ? 'Producto' : 'Product'}: ${brief.product}\n` +
      `${language === 'es' ? 'Audiencia' : 'Audience'}: ${brief.audience}\n` +
      `${language === 'es' ? 'Objetivos' : 'Goals'}: ${brief.goals}\n` +
      `${language === 'es' ? 'Presupuesto' : 'Budget'}: ${brief.budget}\n` +
      `${language === 'es' ? 'Canales' : 'Channels'}: ${brief.channels.join(', ')}`
    )
  }

  if (outputs.overview) {
    const overview = outputs.overview
    addSection(
      language === 'es' ? '🎯 Overview Estratégico' : '🎯 Strategic Overview',
      `${language === 'es' ? 'Objetivo' : 'Objective'}: ${overview.objective}\n` +
      `${language === 'es' ? 'KPI' : 'KPI'}: ${overview.kpi}\n` +
      `${language === 'es' ? 'Audiencia Primaria' : 'Primary Audience'}: ${overview.primaryAudience}\n` +
      `${language === 'es' ? 'Propuesta de Valor' : 'Value Proposition'}: ${overview.valueProposition}\n` +
      `${language === 'es' ? 'Mensaje Principal' : 'Main Message'}: ${overview.mainMessage}\n` +
      `${language === 'es' ? 'CTA Recomendado' : 'Recommended CTA'}: ${overview.recommendedCTA}`
    )

    if (overview.rtbs && overview.rtbs.length > 0) {
      addText(`${language === 'es' ? 'RTBs (Reasons to Believe)' : 'RTBs (Reasons to Believe)'}:`, 11, true)
      overview.rtbs.forEach((rtb, idx) => {
        addText(`${idx + 1}. ${rtb}`, 10, false)
      })
      yPosition += 3
    }

    if (overview.launchPriority && overview.launchPriority.length > 0) {
      addText(`${language === 'es' ? 'Prioridades de Lanzamiento' : 'Launch Priorities'}:`, 11, true)
      overview.launchPriority.forEach((item, idx) => {
        addText(`${idx + 1}. ${item}`, 10, false)
      })
      yPosition += 3
    }
  }

  if (outputs.strategy) {
    addSection(
      language === 'es' ? '📊 Estrategia de Comunicación' : '📊 Communication Strategy',
      outputs.strategy
    )
  }

  if (outputs.creativeRoutes) {
    addSection(
      language === 'es' ? '🎨 Rutas Creativas' : '🎨 Creative Routes',
      outputs.creativeRoutes
    )
  }

  if (outputs.funnelBlueprint) {
    addSection(
      language === 'es' ? '🔄 Blueprint del Funnel' : '🔄 Funnel Blueprint',
      outputs.funnelBlueprint
    )
  }

  if (outputs.paidPack) {
    addSection(
      language === 'es' ? '💰 Paid Media Pack' : '💰 Paid Media Pack',
      outputs.paidPack
    )
  }

  if (outputs.landingKit) {
    addSection(
      language === 'es' ? '🌐 Landing Kit' : '🌐 Landing Kit',
      outputs.landingKit
    )
  }

  if (outputs.contentCalendar && Array.isArray(outputs.contentCalendar) && outputs.contentCalendar.length > 0) {
    addSection(
      language === 'es' ? '📅 Calendario de Contenidos' : '📅 Content Calendar',
      outputs.contentCalendar.map((item: any) => 
        `${item.date || item.week || item.day || ''}: ${item.content || item.title || JSON.stringify(item)}`
      ).join('\n')
    )
  }

  if (outputs.flows && Array.isArray(outputs.flows) && outputs.flows.length > 0) {
    outputs.flows.forEach((flow: any) => {
      addSection(
        `${language === 'es' ? '✉️ Flujo' : '✉️ Flow'}: ${flow.name}`,
        `${language === 'es' ? 'Tipo' : 'Type'}: ${flow.type}\n` +
        `${language === 'es' ? 'Descripción' : 'Description'}: ${flow.description}\n` +
        `${language === 'es' ? 'Total Mensajes' : 'Total Messages'}: ${flow.totalMessages}`
      )
    })
  }

  if (outputs.experimentPlan) {
    addSection(
      language === 'es' ? '🧪 Plan de Experimentación' : '🧪 Experiment Plan',
      outputs.experimentPlan
    )
  }

  if (outputs.measurementUtms) {
    addSection(
      language === 'es' ? '📈 Medición y UTMs' : '📈 Measurement & UTMs',
      outputs.measurementUtms
    )
  }

  if (outputs.risks) {
    addSection(
      language === 'es' ? '⚠️ Riesgos y Supuestos' : '⚠️ Risks & Assumptions',
      outputs.risks
    )
  }

  if (outputs.executionChecklist) {
    addSection(
      language === 'es' ? '✅ Checklist de Ejecución' : '✅ Execution Checklist',
      outputs.executionChecklist
    )
  }

  addPageIfNeeded(30)
  yPosition += 10
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    language === 'es' 
      ? 'Generado por War Room Command Center' 
      : 'Generated by War Room Command Center',
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  )

  const fileName = `campaign-report-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
