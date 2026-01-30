import type { BrandKit } from './types'

export interface BrandConsistencyResult {
  score: number
  suggestedChanges: SuggestedChange[]
  riskSignals: RiskSignal[]
  alternativePhrases: AlternativePhrase[]
}

export interface SuggestedChange {
  id: string
  type: 'tone' | 'word' | 'claim' | 'cta' | 'emoji'
  description: string
  original: string
  suggested: string
  reason: string
}

export interface RiskSignal {
  type: 'claim-dudoso' | 'tono-incoherente' | 'exceso-hype' | 'promesa-sin-prueba' | 'palabra-prohibida'
  severity: 'bajo' | 'medio' | 'alto'
  description: string
  location: string
}

export interface AlternativePhrase {
  id: string
  phrase: string
  reason: string
  context: string
}

export async function evaluateBrandConsistency(
  content: string,
  brandKit: BrandKit,
  language: 'es' | 'en' = 'es'
): Promise<BrandConsistencyResult> {
  const isSpanish = language === 'es'
  
  // @ts-expect-error - spark global is provided by runtime
  const prompt = spark.llmPrompt`${isSpanish ? 'Eres un auditor de marca experto. Analiza el siguiente contenido y evalúa su consistencia con el Brand Kit.' : 'You are an expert brand auditor. Analyze the following content and evaluate its consistency with the Brand Kit.'}

BRAND KIT:
- Tono deseado: ${brandKit.tone}
- Formalidad: ${brandKit.formality}/5 (1=muy informal, 5=muy formal)
- Emojis: ${brandKit.useEmojis ? `Sí, estilo ${brandKit.emojiStyle}` : 'No usar'}
${brandKit.forbiddenWords.length > 0 ? `- Palabras PROHIBIDAS: ${brandKit.forbiddenWords.join(', ')}` : ''}
${brandKit.preferredWords.length > 0 ? `- Palabras PREFERIDAS: ${brandKit.preferredWords.join(', ')}` : ''}
${brandKit.allowedClaims.length > 0 ? `- Claims PERMITIDOS: ${brandKit.allowedClaims.join(' | ')}` : ''}
${brandKit.notAllowedClaims.length > 0 ? `- Claims NO PERMITIDOS: ${brandKit.notAllowedClaims.join(' | ')}` : ''}
- CTA preferido: ${brandKit.preferredCTA}
${brandKit.brandExamplesYes.length > 0 ? `\nEjemplos que SÍ representan la marca:\n${brandKit.brandExamplesYes.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}` : ''}
${brandKit.brandExamplesNo.length > 0 ? `\nEjemplos que NO representan la marca:\n${brandKit.brandExamplesNo.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}` : ''}

CONTENIDO A EVALUAR:
${content}

${isSpanish ? 'Devuelve un objeto JSON con la siguiente estructura:' : 'Return a JSON object with the following structure:'}
{
  "score": ${isSpanish ? '(número de 0 a 100, donde 100 = perfecta consistencia)' : '(number from 0 to 100, where 100 = perfect consistency)'},
  "suggestedChanges": [
    {
      "id": "change-1",
      "type": "tone|word|claim|cta|emoji",
      "description": "${isSpanish ? 'Descripción breve del cambio sugerido' : 'Brief description of suggested change'}",
      "original": "${isSpanish ? 'Texto original problemático' : 'Problematic original text'}",
      "suggested": "${isSpanish ? 'Texto sugerido mejorado' : 'Improved suggested text'}",
      "reason": "${isSpanish ? 'Por qué este cambio mejora la consistencia' : 'Why this change improves consistency'}"
    }
  ],
  "riskSignals": [
    {
      "type": "claim-dudoso|tono-incoherente|exceso-hype|promesa-sin-prueba|palabra-prohibida",
      "severity": "bajo|medio|alto",
      "description": "${isSpanish ? 'Descripción del riesgo detectado' : 'Description of detected risk'}",
      "location": "${isSpanish ? 'Dónde aparece en el texto' : 'Where it appears in the text'}"
    }
  ],
  "alternativePhrases": [
    {
      "id": "alt-1",
      "phrase": "${isSpanish ? 'Frase alternativa completa con el tono correcto' : 'Complete alternative phrase with correct tone'}",
      "reason": "${isSpanish ? 'Por qué esta frase se ajusta mejor al Brand Kit' : 'Why this phrase fits better with Brand Kit'}",
      "context": "${isSpanish ? 'Contexto de uso: headline/body/cta/etc' : 'Usage context: headline/body/cta/etc'}"
    }
  ]
}

${isSpanish ? 'CRITERIOS DE EVALUACIÓN:' : 'EVALUATION CRITERIA:'}

${isSpanish ? '1. SCORE BASE (50 puntos):' : '1. BASE SCORE (50 points):'}
   - ${isSpanish ? 'Respeta palabras prohibidas: +10' : 'Respects forbidden words: +10'}
   - ${isSpanish ? 'Usa palabras preferidas: +10' : 'Uses preferred words: +10'}
   - ${isSpanish ? 'Tono coherente con el especificado: +15' : 'Tone coherent with specified: +15'}
   - ${isSpanish ? 'Nivel de formalidad apropiado: +15' : 'Appropriate formality level: +15'}

${isSpanish ? '2. BONUS (hasta +50):' : '2. BONUS (up to +50):'}
   - ${isSpanish ? 'Claims permitidos presentes: +10' : 'Allowed claims present: +10'}
   - ${isSpanish ? 'Claims no permitidos ausentes: +10' : 'Non-allowed claims absent: +10'}
   - ${isSpanish ? 'CTA preferido usado: +10' : 'Preferred CTA used: +10'}
   - ${isSpanish ? 'Uso correcto de emojis según Brand Kit: +10' : 'Correct emoji usage per Brand Kit: +10'}
   - ${isSpanish ? 'Similaridad con ejemplos positivos: +10' : 'Similarity with positive examples: +10'}

${isSpanish ? '3. PENALIZACIONES:' : '3. PENALTIES:'}
   - ${isSpanish ? 'Cada palabra prohibida usada: -15' : 'Each forbidden word used: -15'}
   - ${isSpanish ? 'Cada claim no permitido: -20' : 'Each non-allowed claim: -20'}
   - ${isSpanish ? 'Tono muy diferente al solicitado: -25' : 'Tone very different from requested: -25'}
   - ${isSpanish ? 'Similaridad con ejemplos negativos: -20' : 'Similarity with negative examples: -20'}

${isSpanish ? '4. SEÑALES DE RIESGO A DETECTAR:' : '4. RISK SIGNALS TO DETECT:'}
   - ${isSpanish ? 'claim-dudoso: Claims sin respaldo, superlatividad sin prueba ("el mejor", "único", "revolucionario" sin evidencia)' : 'claim-dudoso: Claims without backing, superlativity without proof'}
   - ${isSpanish ? 'tono-incoherente: Mezcla de registros (ej. muy informal + muy formal), inconsistencia en persona gramatical' : 'tono-incoherente: Mixed registers, grammatical person inconsistency'}
   - ${isSpanish ? 'exceso-hype: Demasiados adjetivos/adverbios intensos, puntuación excesiva (!!!), mayúsculas gritando' : 'exceso-hype: Too many intense adjectives/adverbs, excessive punctuation'}
   - ${isSpanish ? 'promesa-sin-prueba: Promesas de resultados sin datos, testimonios, casos o garantía' : 'promesa-sin-prueba: Result promises without data, testimonials, cases or guarantee'}
   - ${isSpanish ? 'palabra-prohibida: Uso de palabras explícitamente prohibidas en el Brand Kit' : 'palabra-prohibida: Use of explicitly forbidden words in Brand Kit'}

${isSpanish ? '5. FRASES ALTERNATIVAS:' : '5. ALTERNATIVE PHRASES:'}
   - ${isSpanish ? 'Genera EXACTAMENTE 3 frases alternativas completas que transmitan el mismo mensaje pero con el tono correcto del Brand Kit' : 'Generate EXACTLY 3 complete alternative phrases that convey the same message but with the correct Brand Kit tone'}
   - ${isSpanish ? 'Las frases deben ser directamente utilizables (copy listo para usar)' : 'The phrases must be directly usable (ready-to-use copy)'}
   - ${isSpanish ? 'Cada frase debe ejemplificar el tono y estilo deseado' : 'Each phrase must exemplify the desired tone and style'}
   - ${isSpanish ? 'Indica el contexto de uso para cada frase (headline, body text, CTA, etc.)' : 'Indicate usage context for each phrase (headline, body text, CTA, etc.)'}

${isSpanish ? 'IMPORTANTE: Genera exactamente 5 cambios sugeridos priorizando los más impactantes. Genera EXACTAMENTE 3 frases alternativas. Ordena riskSignals por severidad (alto → medio → bajo).' : 'IMPORTANT: Generate exactly 5 suggested changes prioritizing the most impactful. Generate EXACTLY 3 alternative phrases. Order riskSignals by severity (high → medium → low).'}
`

  const resultJson = await spark.llm(prompt, 'gpt-4o', true)
  
  try {
    const parsed = JSON.parse(resultJson)
    
    const suggestedChanges: SuggestedChange[] = (parsed.suggestedChanges || [])
      .slice(0, 5)
      .map((change: any, idx: number) => ({
        id: change.id || `change-${idx}`,
        type: change.type || 'word',
        description: change.description || '',
        original: change.original || '',
        suggested: change.suggested || '',
        reason: change.reason || ''
      }))
    
    const riskSignals: RiskSignal[] = (parsed.riskSignals || []).map((risk: any, idx: number) => ({
      type: risk.type || 'tono-incoherente',
      severity: risk.severity || 'medio',
      description: risk.description || '',
      location: risk.location || ''
    }))
    
    const alternativePhrases: AlternativePhrase[] = (parsed.alternativePhrases || [])
      .slice(0, 3)
      .map((alt: any, idx: number) => ({
        id: alt.id || `alt-${idx}`,
        phrase: alt.phrase || '',
        reason: alt.reason || '',
        context: alt.context || ''
      }))
    
    const score = Math.max(0, Math.min(100, parsed.score || 50))
    
    return {
      score,
      suggestedChanges,
      riskSignals,
      alternativePhrases
    }
  } catch (e) {
    console.error('Failed to parse brand consistency result', e)
    return {
      score: 50,
      suggestedChanges: [],
      riskSignals: [],
      alternativePhrases: []
    }
  }
}
