import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Warning, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Language } from '@/lib/i18n'
import type { BrandKit } from '@/lib/types'

interface BrandConsistencyEvaluatorProps {
  content: string
  blockName: string
  language: Language
}

interface ConsistencyResult {
  score: number
  issues: Array<{
    type: 'error' | 'warning' | 'success'
    category: string
    message: string
  }>
  forbiddenWordsFound: string[]
  preferredWordsUsed: string[]
  toneAlignment: number
  formalityAlignment: number
  emojiUsage: 'correct' | 'missing' | 'excessive' | 'unnecessary'
  ctaAlignment: boolean
  claimsIssues: string[]
}

export function BrandConsistencyEvaluator({ content, blockName, language }: BrandConsistencyEvaluatorProps) {
  const [brandKit] = useKV<BrandKit>('brand-kit-v2', {
    tone: 'profesional',
    formality: 3,
    useEmojis: false,
    emojiStyle: 'moderados',
    forbiddenWords: [],
    preferredWords: [],
    allowedClaims: [],
    notAllowedClaims: [],
    brandExamplesYes: [],
    brandExamplesNo: [],
    preferredCTA: 'contacta'
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<ConsistencyResult | null>(null)

  const evaluateConsistency = async () => {
    setIsEvaluating(true)
    
    try {
      const kit = brandKit!
      const issues: ConsistencyResult['issues'] = []
      
      const contentLower = content.toLowerCase()
      
      const forbiddenWordsFound = kit.forbiddenWords.filter(word => 
        contentLower.includes(word.toLowerCase())
      )
      
      const preferredWordsUsed = kit.preferredWords.filter(word =>
        contentLower.includes(word.toLowerCase())
      )
      
      const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
      let emojiUsage: ConsistencyResult['emojiUsage'] = 'correct'
      
      if (kit.useEmojis) {
        if (emojiCount === 0) {
          emojiUsage = 'missing'
          issues.push({
            type: 'warning',
            category: language === 'es' ? 'Emojis' : 'Emojis',
            message: language === 'es' 
              ? 'Tu brand kit requiere emojis pero no se encontraron en el contenido'
              : 'Your brand kit requires emojis but none were found in the content'
          })
        } else {
          const wordCount = content.split(/\s+/).length
          const emojiRatio = emojiCount / wordCount
          
          if (kit.emojiStyle === 'pocos' && emojiRatio > 0.05) {
            emojiUsage = 'excessive'
            issues.push({
              type: 'warning',
              category: language === 'es' ? 'Emojis' : 'Emojis',
              message: language === 'es' 
                ? `Demasiados emojis (${emojiCount}) para el estilo "pocos"`
                : `Too many emojis (${emojiCount}) for "few" style`
            })
          } else if (kit.emojiStyle === 'moderados' && (emojiRatio < 0.02 || emojiRatio > 0.08)) {
            emojiUsage = emojiRatio < 0.02 ? 'missing' : 'excessive'
            issues.push({
              type: 'warning',
              category: language === 'es' ? 'Emojis' : 'Emojis',
              message: language === 'es' 
                ? `Cantidad de emojis no equilibrada para el estilo "moderados"`
                : `Emoji count not balanced for "moderate" style`
            })
          }
        }
      } else if (emojiCount > 0) {
        emojiUsage = 'unnecessary'
        issues.push({
          type: 'warning',
          category: language === 'es' ? 'Emojis' : 'Emojis',
          message: language === 'es' 
            ? 'Tu brand kit no permite emojis pero se encontraron en el contenido'
            : 'Your brand kit does not allow emojis but they were found in the content'
        })
      }
      
      forbiddenWordsFound.forEach(word => {
        issues.push({
          type: 'error',
          category: language === 'es' ? 'Palabra Prohibida' : 'Forbidden Word',
          message: language === 'es' 
            ? `Se encontró la palabra prohibida: "${word}"`
            : `Forbidden word found: "${word}"`
        })
      })
      
      const claimsIssues: string[] = []
      kit.notAllowedClaims.forEach(claim => {
        const claimWords = claim.toLowerCase().split(/\s+/).slice(0, 5)
        const matchCount = claimWords.filter(word => contentLower.includes(word)).length
        if (matchCount >= 3) {
          claimsIssues.push(claim)
          issues.push({
            type: 'error',
            category: language === 'es' ? 'Claim No Permitido' : 'Not Allowed Claim',
            message: language === 'es' 
              ? `Posible claim no permitido detectado: "${claim.substring(0, 50)}..."`
              : `Possible not allowed claim detected: "${claim.substring(0, 50)}..."`
          })
        }
      })
      
      if (preferredWordsUsed.length > 0) {
        issues.push({
          type: 'success',
          category: language === 'es' ? 'Palabras Preferidas' : 'Preferred Words',
          message: language === 'es' 
            ? `Excelente uso de palabras preferidas: ${preferredWordsUsed.slice(0, 3).join(', ')}`
            : `Great use of preferred words: ${preferredWordsUsed.slice(0, 3).join(', ')}`
        })
      }

      const emojiInfo = kit.useEmojis ? `Sí (${kit.emojiStyle})` : 'No'
      const examplesYes = kit.brandExamplesYes.length > 0 
        ? `EJEMPLOS DE COPY QUE SÍ REPRESENTA LA MARCA:\n${kit.brandExamplesYes.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}`
        : ''
      const examplesNo = kit.brandExamplesNo.length > 0
        ? `EJEMPLOS DE COPY QUE NO REPRESENTA LA MARCA:\n${kit.brandExamplesNo.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}`
        : ''
      
      // @ts-expect-error - spark global is provided by runtime
      const prompt = spark.llmPrompt`Eres un experto en análisis de brand voice y consistency. Analiza el siguiente contenido y evalúalo contra las directrices de marca.

BRAND KIT:
- Tono: ${kit.tone}
- Nivel de Formalidad: ${kit.formality}/5
- Emojis: ${emojiInfo}
- CTA Preferido: ${kit.preferredCTA}

${examplesYes}

${examplesNo}

CONTENIDO A EVALUAR:
"""
${content}
"""

Proporciona tu análisis en el siguiente formato JSON:
{
  "toneAlignment": (número 0-100, qué tan bien el contenido se alinea con el tono "${kit.tone}"),
  "formalityAlignment": (número 0-100, qué tan bien se alinea con el nivel de formalidad ${kit.formality}/5),
  "overallAnalysis": "(2-3 oraciones resumiendo la consistencia general)",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["mejora sugerida 1", "mejora sugerida 2"]
}`

      const llmResponse = await spark.llm(prompt, 'gpt-4o', true)
      const analysis = JSON.parse(llmResponse)
      
      if (analysis.strengths && Array.isArray(analysis.strengths)) {
        analysis.strengths.forEach((strength: string) => {
          issues.push({
            type: 'success',
            category: language === 'es' ? 'Fortaleza' : 'Strength',
            message: strength
          })
        })
      }
      
      if (analysis.improvements && Array.isArray(analysis.improvements)) {
        analysis.improvements.forEach((improvement: string) => {
          issues.push({
            type: 'warning',
            category: language === 'es' ? 'Mejora' : 'Improvement',
            message: improvement
          })
        })
      }
      
      const toneAlignment = analysis.toneAlignment || 50
      const formalityAlignment = analysis.formalityAlignment || 50
      
      const errorCount = issues.filter(i => i.type === 'error').length
      const warningCount = issues.filter(i => i.type === 'warning').length
      
      let baseScore = (toneAlignment + formalityAlignment) / 2
      baseScore -= (errorCount * 15)
      baseScore -= (warningCount * 5)
      baseScore = Math.max(0, Math.min(100, baseScore))
      
      const finalResult: ConsistencyResult = {
        score: Math.round(baseScore),
        issues,
        forbiddenWordsFound,
        preferredWordsUsed,
        toneAlignment,
        formalityAlignment,
        emojiUsage,
        ctaAlignment: true,
        claimsIssues
      }
      
      setResult(finalResult)
      
      if (finalResult.score >= 80) {
        toast.success(language === 'es' ? '✅ Excelente consistencia de marca' : '✅ Excellent brand consistency')
      } else if (finalResult.score >= 60) {
        toast.info(language === 'es' ? '⚠️ Buena consistencia con mejoras menores' : '⚠️ Good consistency with minor improvements')
      } else {
        toast.error(language === 'es' ? '❌ Requiere mejoras de consistencia' : '❌ Requires consistency improvements')
      }
      
    } catch (error) {
      console.error('Brand consistency evaluation error:', error)
      toast.error(language === 'es' ? 'Error al evaluar consistencia' : 'Error evaluating consistency')
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !result) {
      evaluateConsistency()
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary'
    if (score >= 60) return 'text-accent'
    return 'text-destructive'
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Sparkle size={16} weight="fill" />
          {language === 'es' ? 'Evaluar Consistencia' : 'Evaluate Consistency'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] glass-panel border-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkle size={24} weight="fill" className="text-primary" />
            {language === 'es' ? 'Evaluación de Consistencia de Marca' : 'Brand Consistency Evaluation'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {blockName}
          </p>
        </DialogHeader>

        {isEvaluating ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="animate-spin">
              <Sparkle size={48} weight="fill" className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'es' ? 'Analizando consistencia de marca...' : 'Analyzing brand consistency...'}
            </p>
          </div>
        ) : result ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              
              {/* Overall Score */}
              <div className="glass-panel p-6 rounded-2xl border-2 text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground">
                    {language === 'es' ? 'Puntuación Total' : 'Overall Score'}
                  </span>
                  <Badge variant={getScoreBadgeVariant(result.score)} className="text-2xl font-bold px-4 py-2">
                    {result.score}/100
                  </Badge>
                </div>
                <Progress value={result.score} className="h-3" />
              </div>

              {/* Alignment Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl border-2 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'es' ? 'Alineación de Tono' : 'Tone Alignment'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={result.toneAlignment} className="h-2" />
                    <span className={`text-lg font-bold ${getScoreColor(result.toneAlignment)}`}>
                      {result.toneAlignment}%
                    </span>
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-2 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'es' ? 'Alineación de Formalidad' : 'Formality Alignment'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress value={result.formalityAlignment} className="h-2" />
                    <span className={`text-lg font-bold ${getScoreColor(result.formalityAlignment)}`}>
                      {result.formalityAlignment}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {result.forbiddenWordsFound.length > 0 && (
                  <div className="glass-panel p-3 rounded-xl border-2 border-destructive/40 text-center">
                    <p className="text-2xl font-bold text-destructive">{result.forbiddenWordsFound.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Palabras prohibidas' : 'Forbidden words'}
                    </p>
                  </div>
                )}
                {result.preferredWordsUsed.length > 0 && (
                  <div className="glass-panel p-3 rounded-xl border-2 border-primary/40 text-center">
                    <p className="text-2xl font-bold text-primary">{result.preferredWordsUsed.length}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'es' ? 'Palabras preferidas' : 'Preferred words'}
                    </p>
                  </div>
                )}
                <div className="glass-panel p-3 rounded-xl border-2 text-center">
                  <p className="text-2xl font-bold">
                    {result.emojiUsage === 'correct' ? '✅' : result.emojiUsage === 'missing' ? '⚠️' : '❌'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'es' ? 'Uso de emojis' : 'Emoji usage'}
                  </p>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {language === 'es' ? 'Detalles del Análisis' : 'Analysis Details'}
                </h3>
                <div className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <div 
                      key={idx}
                      className={`glass-panel p-3 rounded-xl border-2 flex items-start gap-3 ${
                        issue.type === 'error' ? 'border-destructive/40 bg-destructive/5' :
                        issue.type === 'warning' ? 'border-accent/40 bg-accent/5' :
                        'border-primary/40 bg-primary/5'
                      }`}
                    >
                      {issue.type === 'error' && <XCircle size={20} weight="fill" className="text-destructive shrink-0 mt-0.5" />}
                      {issue.type === 'warning' && <Warning size={20} weight="fill" className="text-accent shrink-0 mt-0.5" />}
                      {issue.type === 'success' && <CheckCircle size={20} weight="fill" className="text-primary shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-muted-foreground">{issue.category}</p>
                        <p className="text-sm mt-1">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forbidden Words Found */}
              {result.forbiddenWordsFound.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-destructive">
                    {language === 'es' ? '🚫 Palabras Prohibidas Detectadas' : '🚫 Forbidden Words Detected'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.forbiddenWordsFound.map((word, idx) => (
                      <Badge key={idx} variant="destructive" className="rounded-lg">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Words Used */}
              {result.preferredWordsUsed.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-primary">
                    {language === 'es' ? '⭐ Palabras Preferidas Usadas' : '⭐ Preferred Words Used'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.preferredWordsUsed.map((word, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-lg border-primary text-primary">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
