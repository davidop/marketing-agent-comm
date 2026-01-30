import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, Warning, Sparkle, ArrowRight, Check, Quotes, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Language } from '@/lib/i18n'
import type { BrandKit } from '@/lib/types'
import { evaluateBrandConsistency, type BrandConsistencyResult, type SuggestedChange, type RiskSignal, type AlternativePhrase } from '@/lib/brandConsistencyChecker'

interface BrandConsistencyEvaluatorProps {
  content: string
  blockName: string
  language: Language
  onApplyChange?: (original: string, suggested: string) => void
}

export function BrandConsistencyEvaluator({ content, blockName, language, onApplyChange }: BrandConsistencyEvaluatorProps) {
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
  const [result, setResult] = useState<BrandConsistencyResult | null>(null)
  const [appliedChanges, setAppliedChanges] = useState<Set<string>>(new Set())

  const evaluateConsistency = async () => {
    setIsEvaluating(true)
    
    try {
      const kit = brandKit!
      const evaluation = await evaluateBrandConsistency(content, kit, language)
      setResult(evaluation)
      
      if (evaluation.score >= 80) {
        toast.success(language === 'es' ? '✅ Excelente consistencia de marca' : '✅ Excellent brand consistency')
      } else if (evaluation.score >= 60) {
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

  const handleApplyChange = (change: SuggestedChange) => {
    if (onApplyChange) {
      onApplyChange(change.original, change.suggested)
      setAppliedChanges(prev => new Set([...prev, change.id]))
      toast.success(language === 'es' ? '✅ Cambio aplicado' : '✅ Change applied')
    } else {
      navigator.clipboard.writeText(change.suggested)
      toast.success(language === 'es' ? '📋 Texto copiado al portapapeles' : '📋 Text copied to clipboard')
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

  const getSeverityColor = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'alto': return 'border-destructive/60 bg-destructive/10'
      case 'medio': return 'border-accent/60 bg-accent/10'
      case 'bajo': return 'border-muted/60 bg-muted/10'
    }
  }

  const getSeverityIcon = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'alto': return <XCircle size={20} weight="fill" className="text-destructive" />
      case 'medio': return <Warning size={20} weight="fill" className="text-accent" />
      case 'bajo': return <Warning size={20} weight="duotone" className="text-muted-foreground" />
    }
  }

  const getRiskTypeLabel = (type: RiskSignal['type'], lang: Language) => {
    const labels = {
      'claim-dudoso': lang === 'es' ? 'Claim Dudoso' : 'Dubious Claim',
      'tono-incoherente': lang === 'es' ? 'Tono Incoherente' : 'Incoherent Tone',
      'exceso-hype': lang === 'es' ? 'Exceso de Hype' : 'Excessive Hype',
      'promesa-sin-prueba': lang === 'es' ? 'Promesa sin Prueba' : 'Promise without Proof',
      'palabra-prohibida': lang === 'es' ? 'Palabra Prohibida' : 'Forbidden Word'
    }
    return labels[type]
  }

  const getChangeTypeLabel = (type: SuggestedChange['type'], lang: Language) => {
    const labels = {
      'tone': lang === 'es' ? 'Tono' : 'Tone',
      'word': lang === 'es' ? 'Palabra' : 'Word',
      'claim': lang === 'es' ? 'Claim' : 'Claim',
      'cta': lang === 'es' ? 'CTA' : 'CTA',
      'emoji': lang === 'es' ? 'Emoji' : 'Emoji'
    }
    return labels[type]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Sparkle size={16} weight="fill" />
          {language === 'es' ? 'Evaluar Consistencia' : 'Evaluate Consistency'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-panel border-2">
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
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4">
              
              {/* Overall Score */}
              <Card className="glass-panel p-6 rounded-2xl border-2 text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'es' ? 'Puntuación de Consistencia' : 'Consistency Score'}
                  </span>
                  <Badge variant={getScoreBadgeVariant(result.score)} className="text-2xl font-bold px-4 py-2">
                    {result.score}/100
                  </Badge>
                </div>
                <Progress value={result.score} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {result.score >= 80 && (language === 'es' ? 'Excelente alineación con tu Brand Kit' : 'Excellent alignment with your Brand Kit')}
                  {result.score >= 60 && result.score < 80 && (language === 'es' ? 'Buena alineación con margen de mejora' : 'Good alignment with room for improvement')}
                  {result.score < 60 && (language === 'es' ? 'Requiere ajustes para alinearse con tu marca' : 'Requires adjustments to align with your brand')}
                </p>
              </Card>

              {/* Suggested Changes */}
              {result.suggestedChanges.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <ArrowRight size={18} weight="bold" />
                    {language === 'es' ? 'Cambios Sugeridos' : 'Suggested Changes'}
                    <Badge variant="secondary" className="ml-auto">
                      {result.suggestedChanges.length}
                    </Badge>
                  </h3>
                  <div className="space-y-3">
                    {result.suggestedChanges.map((change) => (
                      <Card 
                        key={change.id}
                        className="glass-panel p-4 rounded-xl border-2 border-primary/30 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getChangeTypeLabel(change.type, language)}
                            </Badge>
                            <h4 className="text-sm font-semibold">{change.description}</h4>
                          </div>
                          <Button
                            size="sm"
                            variant={appliedChanges.has(change.id) ? "secondary" : "default"}
                            className="rounded-lg shrink-0"
                            onClick={() => handleApplyChange(change)}
                            disabled={appliedChanges.has(change.id)}
                          >
                            {appliedChanges.has(change.id) ? (
                              <>
                                <Check size={14} weight="bold" />
                                {language === 'es' ? 'Aplicado' : 'Applied'}
                              </>
                            ) : (
                              language === 'es' ? 'Aplicar' : 'Apply'
                            )}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-destructive uppercase tracking-wider">
                              {language === 'es' ? '❌ Original' : '❌ Original'}
                            </p>
                            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                              <p className="text-sm font-mono">{change.original}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">
                              {language === 'es' ? '✅ Sugerido' : '✅ Suggested'}
                            </p>
                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                              <p className="text-sm font-mono">{change.suggested}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">{language === 'es' ? 'Por qué:' : 'Why:'}</span> {change.reason}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Signals */}
              {result.riskSignals.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Warning size={18} weight="bold" />
                    {language === 'es' ? 'Señales de Riesgo' : 'Risk Signals'}
                    <Badge variant="destructive" className="ml-auto">
                      {result.riskSignals.filter(r => r.severity === 'alto').length} {language === 'es' ? 'Alto' : 'High'}
                    </Badge>
                  </h3>
                  <div className="space-y-2">
                    {result.riskSignals.map((risk, idx) => (
                      <Card 
                        key={idx}
                        className={`glass-panel p-4 rounded-xl border-2 ${getSeverityColor(risk.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(risk.severity)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getRiskTypeLabel(risk.type, language)}
                              </Badge>
                              <Badge 
                                variant={risk.severity === 'alto' ? 'destructive' : risk.severity === 'medio' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {risk.severity === 'alto' && (language === 'es' ? 'Riesgo Alto' : 'High Risk')}
                                {risk.severity === 'medio' && (language === 'es' ? 'Riesgo Medio' : 'Medium Risk')}
                                {risk.severity === 'bajo' && (language === 'es' ? 'Riesgo Bajo' : 'Low Risk')}
                              </Badge>
                            </div>
                            <p className="text-sm">{risk.description}</p>
                            {risk.location && (
                              <div className="bg-muted/50 rounded-lg p-2 mt-2">
                                <p className="text-xs font-mono text-muted-foreground">
                                  {language === 'es' ? '📍 Ubicación: ' : '📍 Location: '}{risk.location}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative Phrases */}
              {result.alternativePhrases.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Quotes size={18} weight="fill" />
                    {language === 'es' ? 'Frases Alternativas con el Tono Correcto' : 'Alternative Phrases with Correct Tone'}
                    <Badge variant="secondary" className="ml-auto">
                      {result.alternativePhrases.length}
                    </Badge>
                  </h3>
                  <div className="space-y-3">
                    {result.alternativePhrases.map((alt) => (
                      <Card 
                        key={alt.id}
                        className="glass-panel p-4 rounded-xl border-2 border-accent/40 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Badge variant="outline" className="text-xs shrink-0">
                            {alt.context}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg shrink-0"
                            onClick={() => {
                              navigator.clipboard.writeText(alt.phrase)
                              toast.success(language === 'es' ? '📋 Frase copiada' : '📋 Phrase copied')
                            }}
                          >
                            <Copy size={14} weight="bold" />
                            {language === 'es' ? 'Copiar' : 'Copy'}
                          </Button>
                        </div>
                        
                        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                          <p className="text-sm font-medium leading-relaxed">{alt.phrase}</p>
                        </div>
                        
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">{language === 'es' ? 'Por qué funciona:' : 'Why it works:'}</span> {alt.reason}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Issues */}
              {result.suggestedChanges.length === 0 && result.riskSignals.length === 0 && result.alternativePhrases.length === 0 && (
                <Card className="glass-panel p-8 rounded-2xl border-2 border-primary/40 text-center">
                  <CheckCircle size={48} weight="fill" className="text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">
                    {language === 'es' ? '¡Perfecto!' : 'Perfect!'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' 
                      ? 'Este contenido está perfectamente alineado con tu Brand Kit. No se detectaron inconsistencias.' 
                      : 'This content is perfectly aligned with your Brand Kit. No inconsistencies detected.'}
                  </p>
                </Card>
              )}

            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
