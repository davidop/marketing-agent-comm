import type { CampaignBriefData, BrandKit } from './types'

export interface BriefScoreBreakdown {
  objectiveClear: number
  audienceConcrete: number
  offerAndPrice: number
  usp: number
  proofEvidence: number
  channelsAndBudget: number
  brandRestrictions: number
  timingGeography: number
}

export interface BriefAnalysisResult {
  score: number
  breakdown: BriefScoreBreakdown
  missing: string[]
  recommendations: string[]
  criticalQuestions: CriticalQuestion[]
  risks: string[]
  status: 'ready' | 'needs-improvement'
  statusText: string
}

export interface CriticalQuestion {
  id: string
  priority: 'critical' | 'high' | 'medium'
  question: string
  why: string
  suggestedAnswers?: string[]
  fieldToUpdate: keyof CampaignBriefData
  impact: string
}

export function analyzeBrief(
  briefData: Partial<CampaignBriefData>,
  brandKit?: BrandKit
): BriefAnalysisResult {
  const breakdown: BriefScoreBreakdown = {
    objectiveClear: 0,
    audienceConcrete: 0,
    offerAndPrice: 0,
    usp: 0,
    proofEvidence: 0,
    channelsAndBudget: 0,
    brandRestrictions: 0,
    timingGeography: 0,
  }

  const missing: string[] = []
  const recommendations: string[] = []
  const criticalQuestions: CriticalQuestion[] = []
  const risks: string[] = []

  // 1. Objetivo claro (15 puntos)
  if (briefData.objective && briefData.objective.length > 10) {
    breakdown.objectiveClear += 10
    if (briefData.kpi && briefData.kpi.length > 3) {
      breakdown.objectiveClear += 5
    } else {
      missing.push('KPI principal')
      recommendations.push('Define un KPI específico y medible (ej: 500 leads, ROAS 3:1, 100 ventas)')
      criticalQuestions.push({
        id: 'kpi',
        priority: 'critical',
        question: '¿Cuál es el KPI principal que medirá el éxito de esta campaña?',
        why: 'Sin un KPI claro, no podrás optimizar la campaña ni medir ROI',
        suggestedAnswers: [
          'Leads cualificados (CPL objetivo: €X)',
          'Ventas directas (CPA objetivo: €X)',
          'ROAS (retorno mínimo esperado: X:1)',
          'Brand awareness (impresiones/alcance)',
        ],
        fieldToUpdate: 'kpi',
        impact: 'Impacta distribución de presupuesto, copy y selección de canales',
      })
    }
  } else {
    missing.push('Objetivo de campaña')
    recommendations.push('Define un objetivo claro: ¿buscas awareness, leads, ventas o retención?')
    breakdown.objectiveClear += 0
  }

  // 2. Audiencia concreta (20 puntos)
  let audienceScore = 0
  if (briefData.segments && briefData.segments.length > 10) {
    audienceScore += 7
  } else {
    missing.push('Segmentos de audiencia')
    recommendations.push(
      'Especifica quién es tu audiencia: cargo, sector, edad, ubicación, nivel de conocimiento del problema'
    )
    criticalQuestions.push({
      id: 'segments',
      priority: 'critical',
      question: '¿Quién es tu audiencia prioritaria? Sé específico.',
      why: 'Copy genérico no convierte. Necesitamos saber a quién le hablamos',
      suggestedAnswers: [
        'CEOs y CTOs de empresas tech 50-500 empleados',
        'Marketing managers en ecommerce',
        'Emprendedores en fase de validación (0-2 años)',
        'Responsables IT en banca/seguros',
      ],
      fieldToUpdate: 'segments',
      impact: 'Define tono, canales, ángulos creativos y mensaje',
    })
  }

  if (briefData.pains && briefData.pains.length > 10) {
    audienceScore += 7
  } else {
    missing.push('Pains de audiencia')
    recommendations.push('¿Qué problema/frustración tiene tu audiencia que tu producto resuelve?')
  }

  if (briefData.objections && briefData.objections.length > 10) {
    audienceScore += 6
  } else {
    missing.push('Objeciones')
    recommendations.push('Identifica las 2-3 objeciones principales (precio, tiempo, complejidad, alternativas)')
  }

  breakdown.audienceConcrete = audienceScore

  // 3. Oferta + precio (15 puntos)
  if (briefData.product && briefData.product.length > 10) {
    breakdown.offerAndPrice += 7
  } else {
    missing.push('Producto/servicio')
    recommendations.push('Describe qué vendes de forma concreta')
  }

  if (briefData.price && briefData.price.length > 0) {
    breakdown.offerAndPrice += 8
  } else {
    missing.push('Precio')
    recommendations.push('Añade el precio o rango de precio (es crítico para copy, targeting y expectativa de conversión)')
    criticalQuestions.push({
      id: 'price',
      priority: 'critical',
      question: '¿Cuál es el precio del producto/servicio?',
      why: 'El precio define todo: audiencia, canales, copy, expectativa de conversión y presupuesto viable',
      suggestedAnswers: [
        'Precio fijo: €X',
        'Desde €X/mes',
        'Rango: €X - €Y',
        'A consultar (indicar ticket medio esperado)',
      ],
      fieldToUpdate: 'price',
      impact: 'Sin precio, el copy será genérico y no atraerás al buyer persona correcto',
    })
    risks.push('Sin precio: imposible calcular CPA objetivo, filtrar leads por capacidad de pago, o ajustar copy')
  }

  // 4. USP / diferenciador (15 puntos)
  if (briefData.usp && briefData.usp.length > 15) {
    breakdown.usp += 15
  } else {
    missing.push('USP o diferenciador')
    recommendations.push('¿Por qué elegir tu producto vs. alternativas? Define tu ventaja única')
    criticalQuestions.push({
      id: 'usp',
      priority: 'high',
      question: '¿Qué hace único a tu producto vs. competencia?',
      why: 'Sin diferenciación, tu copy sonará como todos los demás',
      suggestedAnswers: [
        'Más rápido: implementación en X días vs. X meses',
        'Más fácil: no requiere conocimiento técnico',
        'Más completo: incluye X que otros cobran aparte',
        'Más confiable: usado por X empresas líderes',
      ],
      fieldToUpdate: 'usp',
      impact: 'Define ángulo creativo, headline principal y razones para creer',
    })
  }

  // 5. Prueba social / evidencia (10 puntos)
  if (briefData.proof && briefData.proof.length > 0 && briefData.proof[0]) {
    breakdown.proofEvidence += 10
  } else {
    missing.push('Prueba social o evidencia')
    recommendations.push(
      'Añade: testimonios, cifras (X clientes, Y% mejora), caso de éxito, garantía, certificaciones'
    )
    criticalQuestions.push({
      id: 'proof',
      priority: 'high',
      question: '¿Qué evidencia tienes de que tu producto funciona?',
      why: 'Sin prueba, las promesas suenan huecas. La prueba social aumenta conversión 20-40%',
      suggestedAnswers: [
        'X clientes activos / Y% crecimiento',
        'Caso de éxito: cliente Z logró resultado concreto',
        'Rating 4.8/5 en plataforma, X reviews',
        'Garantía de devolución / prueba gratis',
      ],
      fieldToUpdate: 'proof',
      impact: 'Impacta landing, anuncios, objeciones y tasa de conversión',
    })
    risks.push('Sin prueba social: baja credibilidad, especialmente en audiencias frías')
  }

  // 6. Canales + presupuesto (10 puntos)
  if (briefData.channels && briefData.channels.length > 0) {
    breakdown.channelsAndBudget += 5
  } else {
    missing.push('Canales de marketing')
    recommendations.push('Define canales: paid (Meta, Google), email, LinkedIn, orgánico, etc.')
  }

  if (briefData.budget && briefData.budget.length > 0) {
    breakdown.channelsAndBudget += 5

    const budgetNum = parseFloat(briefData.budget.replace(/[^\d.]/g, ''))
    const isPaid = briefData.channels?.some((ch) =>
      ['Google', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube'].includes(ch)
    )

    if (isPaid && budgetNum < 1000) {
      risks.push(
        'Presupuesto <€1000 en paid: será difícil salir de fase de testing. Considera aumentar o enfocarte en orgánico/email'
      )
    }

    if (isPaid && (!briefData.kpi || !briefData.price)) {
      criticalQuestions.push({
        id: 'cpa-target',
        priority: 'critical',
        question: '¿Cuál es tu CPA (coste por adquisición) máximo viable?',
        why: 'Con paid media, necesitas saber cuánto puedes pagar por lead/cliente para no quemar presupuesto',
        suggestedAnswers: [
          'CPA máximo: €X (basado en margen)',
          'CPL aceptable: €X (para leads que cierran a Y%)',
          'ROAS mínimo: X:1',
        ],
        fieldToUpdate: 'kpi',
        impact: 'Define si el canal es viable y cómo distribuir presupuesto',
      })
    }
  } else {
    missing.push('Presupuesto')
    recommendations.push('Define presupuesto total o mensual (incluye paid, producción creativa, herramientas)')
  }

  // 7. Restricciones de marca / legales (10 puntos)
  let brandScore = 0

  if (brandKit) {
    brandScore += 3
    if (brandKit.forbiddenWords.length > 0) brandScore += 2
    if (brandKit.allowedClaims.length > 0 || brandKit.notAllowedClaims.length > 0) brandScore += 3
    if (brandKit.brandExamplesYes.length > 0) brandScore += 2
  }

  if (briefData.brandVoice && briefData.brandVoice.length > 10) {
    brandScore += 3
  } else if (!brandKit) {
    missing.push('Brand voice')
    recommendations.push('Define el tono de marca: ¿formal, cercano, técnico, disruptivo?')
  }

  if (briefData.legalRequirements && briefData.legalRequirements.length > 5) {
    brandScore += 2
  }

  breakdown.brandRestrictions = Math.min(10, brandScore)

  // 8. Timing / geografía (5 puntos)
  if (briefData.timing && briefData.timing.length > 5) {
    breakdown.timingGeography += 2
  } else {
    missing.push('Timing')
    recommendations.push('¿Cuándo lanzas? Define fechas clave o urgencia')
  }

  if (briefData.geography && briefData.geography.length > 2) {
    breakdown.timingGeography += 2
  } else {
    missing.push('Geografía')
    recommendations.push('Define mercado objetivo: país, región, ciudad')
  }

  if (briefData.language && briefData.language.length > 1) {
    breakdown.timingGeography += 1
  }

  // Calcular score total
  const totalScore =
    breakdown.objectiveClear +
    breakdown.audienceConcrete +
    breakdown.offerAndPrice +
    breakdown.usp +
    breakdown.proofEvidence +
    breakdown.channelsAndBudget +
    breakdown.brandRestrictions +
    breakdown.timingGeography

  // Validaciones adicionales y riesgos contextuales
  if (briefData.segments && briefData.segments.split(/,|y|\//).length > 4) {
    risks.push(
      'Audiencia demasiado amplia: el mensaje será genérico. Prioriza 1-2 segmentos para esta campaña'
    )
    criticalQuestions.push({
      id: 'segment-priority',
      priority: 'high',
      question: 'Tienes varios segmentos. ¿Cuál es el prioritario para esta campaña?',
      why: 'Un mensaje para todos es un mensaje para nadie. Mejor enfocarse en 1-2 segmentos',
      suggestedAnswers: briefData.segments.split(/,|y|\//).slice(0, 4),
      fieldToUpdate: 'segments',
      impact: 'Define creatividades, canales y copy específico',
    })
  }

  // Si es B2B pero no menciona sector regulado
  const isB2B =
    briefData.segments?.toLowerCase().includes('ceo') ||
    briefData.segments?.toLowerCase().includes('cto') ||
    briefData.segments?.toLowerCase().includes('director') ||
    briefData.segments?.toLowerCase().includes('responsable')

  if (isB2B && !briefData.legalRequirements) {
    recommendations.push(
      'Si tu sector es regulado (salud, finanzas, legal), especifica claims prohibidos y requisitos legales'
    )
  }

  // Si no hay garantía ni prueba
  if (!briefData.guarantee && (!briefData.proof || briefData.proof.length === 0)) {
    recommendations.push(
      'Considera añadir una garantía (devolución, prueba gratis, demo) para reducir fricción en conversión'
    )
  }

  // Si no hay competidores mencionados
  if (!briefData.competitors || briefData.competitors.length === 0) {
    recommendations.push(
      'Identifica 2-3 competidores principales. Ayudará a definir diferenciación y objeciones'
    )
  }

  // Status y mensaje final
  const isCriticalDataMissing = criticalQuestions.filter((q) => q.priority === 'critical').length > 0

  let status: 'ready' | 'needs-improvement' = 'ready'
  let statusText = ''

  if (totalScore >= 80) {
    status = 'ready'
    statusText = '✅ Brief completo - Listo para generar campaña de alta calidad'
  } else if (totalScore >= 60) {
    status = isCriticalDataMissing ? 'needs-improvement' : 'ready'
    statusText = isCriticalDataMissing
      ? '⚠️ Brief aceptable pero faltan datos críticos - La campaña será genérica sin completarlos'
      : '⚠️ Brief aceptable - Puedes generar, pero considera completar para mejor resultado'
  } else {
    status = 'needs-improvement'
    statusText = `❌ Brief incompleto (${missing.length} campos críticos) - Completa antes de generar`
  }

  return {
    score: totalScore,
    breakdown,
    missing,
    recommendations,
    criticalQuestions: criticalQuestions.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }),
    risks,
    status,
    statusText,
  }
}

export function formatBreakdownForDisplay(breakdown: BriefScoreBreakdown): Array<{
  label: string
  score: number
  max: number
  percentage: number
}> {
  return [
    {
      label: 'Objetivo claro',
      score: breakdown.objectiveClear,
      max: 15,
      percentage: (breakdown.objectiveClear / 15) * 100,
    },
    {
      label: 'Audiencia concreta',
      score: breakdown.audienceConcrete,
      max: 20,
      percentage: (breakdown.audienceConcrete / 20) * 100,
    },
    {
      label: 'Oferta + precio',
      score: breakdown.offerAndPrice,
      max: 15,
      percentage: (breakdown.offerAndPrice / 15) * 100,
    },
    {
      label: 'USP / diferenciador',
      score: breakdown.usp,
      max: 15,
      percentage: (breakdown.usp / 15) * 100,
    },
    {
      label: 'Prueba social',
      score: breakdown.proofEvidence,
      max: 10,
      percentage: (breakdown.proofEvidence / 10) * 100,
    },
    {
      label: 'Canales + presupuesto',
      score: breakdown.channelsAndBudget,
      max: 10,
      percentage: (breakdown.channelsAndBudget / 10) * 100,
    },
    {
      label: 'Restricciones de marca',
      score: breakdown.brandRestrictions,
      max: 10,
      percentage: (breakdown.brandRestrictions / 10) * 100,
    },
    {
      label: 'Timing / geografía',
      score: breakdown.timingGeography,
      max: 5,
      percentage: (breakdown.timingGeography / 5) * 100,
    },
  ]
}
