import type { CopyVariation, BrandKit } from './types'

export interface CopyScoringCriteria {
  clarity: number
  specificity: number
  differentiation: number
  audienceFit: number
  brandVoiceFit: number
}

export function calculateCopyScore(
  variation: CopyVariation,
  brandKit?: BrandKit,
  audienceContext?: string
): CopyScoringCriteria & { total: number } {
  const clarity = evaluateClarity(variation)
  const specificity = evaluateSpecificity(variation)
  const differentiation = evaluateDifferentiation(variation)
  const audienceFit = evaluateAudienceFit(variation, audienceContext)
  const brandVoiceFit = evaluateBrandVoiceFit(variation, brandKit)

  const total = Math.round(clarity + specificity + differentiation + audienceFit + brandVoiceFit)

  return {
    clarity,
    specificity,
    differentiation,
    audienceFit,
    brandVoiceFit,
    total: Math.min(100, Math.max(0, total))
  }
}

function evaluateClarity(variation: CopyVariation): number {
  let score = 25
  const { hook, promise, cta } = variation

  if (!hook || hook.length < 10) {
    score -= 8
  } else if (hook.length > 120) {
    score -= 5
  }

  if (!promise || promise.length < 15) {
    score -= 8
  }

  if (!cta || cta.length < 3) {
    score -= 5
  }

  const wordCount = hook.split(' ').length
  if (wordCount > 15) {
    score -= 4
  }

  const hasJargon = /\b(synergy|leverage|paradigm|holistic|disrupt)\b/i.test(hook + ' ' + promise)
  if (hasJargon) {
    score -= 3
  }

  return Math.max(0, score)
}

function evaluateSpecificity(variation: CopyVariation): number {
  let score = 25
  const { hook, promise, proof } = variation
  const combinedText = `${hook} ${promise}`

  if (proof === 'TBD' || proof.trim().length < 5) {
    score -= 10
  }

  const hasNumbers = /\d+/.test(combinedText)
  if (!hasNumbers) {
    score -= 5
  }

  const hasPercentage = /\d+%/.test(combinedText)
  if (hasPercentage) {
    score += 3
  }

  const hasTimeframe = /\b(\d+\s*(día|días|semana|semanas|mes|meses|hora|horas|minuto|minutos|day|days|week|weeks|month|months|hour|hours|minute|minutes))\b/i.test(combinedText)
  if (hasTimeframe) {
    score += 3
  }

  const vagueWords = ['mejor', 'muchos', 'varios', 'algunos', 'great', 'many', 'several', 'some', 'best']
  const hasVagueWords = vagueWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(combinedText))
  if (hasVagueWords) {
    score -= 4
  }

  const hasConcreteBenefit = /\b(ahorra|reduce|aumenta|genera|elimina|save|reduce|increase|generate|eliminate)\b/i.test(combinedText)
  if (hasConcreteBenefit) {
    score += 3
  }

  return Math.max(0, Math.min(25, score))
}

function evaluateDifferentiation(variation: CopyVariation): number {
  let score = 20
  const { hook, promise } = variation
  const combinedText = `${hook} ${promise}`.toLowerCase()

  const genericPhrases = [
    'mejor solución',
    'líder del mercado',
    'innovador',
    'único',
    'best solution',
    'market leader',
    'innovative',
    'unique',
    'revolucionario',
    'revolutionary'
  ]

  const hasGenericPhrases = genericPhrases.some(phrase => combinedText.includes(phrase.toLowerCase()))
  if (hasGenericPhrases) {
    score -= 8
  }

  const hasDifferentiator = /\b(solo|único que|primero en|exclusivo|only|first to|exclusive|diferente de|unlike)\b/i.test(combinedText)
  if (hasDifferentiator) {
    score += 5
  }

  const hasCompetitorComparison = /\b(vs\.|versus|mejor que|más que|menos que|than|better than|more than|less than)\b/i.test(combinedText)
  if (hasCompetitorComparison) {
    score += 3
  }

  const hasMechanismExplanation = /\b(porque|gracias a|mediante|a través de|con|using|through|with|via|by)\b/i.test(combinedText)
  if (hasMechanismExplanation) {
    score += 2
  }

  return Math.max(0, score)
}

function evaluateAudienceFit(variation: CopyVariation, audienceContext?: string): number {
  let score = 20
  const { hook, promise, angle } = variation
  const combinedText = `${hook} ${promise}`.toLowerCase()

  if (variation.channel === 'LinkedIn' && angle === 'autoridad') {
    score += 3
  }

  if ((variation.channel === 'Instagram' || variation.channel === 'Reels') && combinedText.length < 100) {
    score += 2
  }

  if (variation.objective === 'leads' && /\b(descubre|aprende|download|descargar|learn|discover)\b/i.test(combinedText)) {
    score += 3
  }

  if (variation.objective === 'ventas' && /\b(compra|ahorra|obtén|buy|save|get)\b/i.test(combinedText)) {
    score += 3
  }

  if (audienceContext) {
    const audienceLower = audienceContext.toLowerCase()
    if (audienceLower.includes('ceo') || audienceLower.includes('director')) {
      if (/\b(ROI|retorno|inversión|resultados|eficiencia|return|investment|results|efficiency)\b/i.test(combinedText)) {
        score += 3
      }
    }

    if (audienceLower.includes('joven') || audienceLower.includes('young')) {
      if (combinedText.length < 80) {
        score += 2
      }
    }
  }

  if (angle === 'urgencia' && /\b(ahora|hoy|limitado|últimas|now|today|limited|last)\b/i.test(combinedText)) {
    score += 3
  }

  if (angle === 'autoridad' && /\b(experto|líder|certificado|validado|expert|leader|certified|validated)\b/i.test(combinedText)) {
    score += 3
  }

  return Math.max(0, Math.min(20, score))
}

function evaluateBrandVoiceFit(variation: CopyVariation, brandKit?: BrandKit): number {
  if (!brandKit) {
    return 10
  }

  let score = 10
  const { hook, promise, cta } = variation
  const combinedText = `${hook} ${promise} ${cta}`.toLowerCase()

  if (brandKit.forbiddenWords && brandKit.forbiddenWords.length > 0) {
    const hasForbiddenWords = brandKit.forbiddenWords.some(word => 
      new RegExp(`\\b${word.toLowerCase()}\\b`, 'i').test(combinedText)
    )
    if (hasForbiddenWords) {
      score -= 5
    }
  }

  if (brandKit.preferredWords && brandKit.preferredWords.length > 0) {
    const hasPreferredWords = brandKit.preferredWords.some(word => 
      new RegExp(`\\b${word.toLowerCase()}\\b`, 'i').test(combinedText)
    )
    if (hasPreferredWords) {
      score += 2
    }
  }

  if (variation.tone && brandKit.tone && variation.tone === brandKit.tone) {
    score += 2
  }

  if (brandKit.useEmojis === false) {
    const hasEmojis = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(combinedText)
    if (hasEmojis) {
      score -= 3
    }
  }

  if (brandKit.formality >= 4) {
    const hasInformalWords = /\b(guay|mola|flipas|wow|cool|awesome)\b/i.test(combinedText)
    if (hasInformalWords) {
      score -= 2
    }
  }

  if (brandKit.formality <= 2) {
    const hasFormalWords = /\b(proceder|ejecutar|implementar|proceed|execute|implement)\b/i.test(combinedText)
    if (hasFormalWords) {
      score -= 2
    }
  }

  return Math.max(0, score)
}

export function scoreCopyVariations(
  variations: CopyVariation[],
  brandKit?: BrandKit,
  audienceContext?: string
): CopyVariation[] {
  return variations.map(variation => {
    const scoring = calculateCopyScore(variation, brandKit, audienceContext)
    return {
      ...variation,
      scoring
    }
  })
}
