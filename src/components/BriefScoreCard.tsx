import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Warning, XCircle, Lightbulb, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { CampaignBriefData } from '@/lib/types'

interface BriefScoreCardProps {
  formData: CampaignBriefData
  language: 'es' | 'en'
}

interface ScoreItem {
  label: string
  value: number
  met: boolean
  field: keyof CampaignBriefData | 'multi'
  checkFn?: (data: CampaignBriefData) => boolean
  recommendation: string
}

export function BriefScoreCard({ formData, language }: BriefScoreCardProps) {
  const t = (es: string, en: string) => language === 'es' ? es : en

  const scoreItems: ScoreItem[] = [
    {
      label: t('Objetivo claro', 'Clear objective'),
      value: 15,
      field: 'multi',
      checkFn: (data) => Boolean(data.objective && data.kpi),
      met: Boolean(formData.objective && formData.kpi),
      recommendation: t(
        'Define el objetivo específico (leads, ventas, awareness) y un KPI medible con números concretos.',
        'Define the specific objective (leads, sales, awareness) and a measurable KPI with concrete numbers.'
      )
    },
    {
      label: t('Audiencia concreta', 'Concrete audience'),
      value: 20,
      field: 'multi',
      checkFn: (data) => Boolean(data.segments && data.pains),
      met: Boolean(formData.segments && formData.pains),
      recommendation: t(
        'Describe el segmento de audiencia con cargo, tamaño de empresa, sector e industria. Incluye los principales dolores (pains) que enfrenta.',
        'Describe the audience segment with title, company size, sector and industry. Include the main pain points they face.'
      )
    },
    {
      label: t('Oferta + precio', 'Offer + price'),
      value: 15,
      field: 'multi',
      checkFn: (data) => Boolean(data.product && data.price),
      met: Boolean(formData.product && formData.price),
      recommendation: t(
        'Especifica el producto/servicio y su precio. Incluye promociones o garantías si las hay.',
        'Specify the product/service and its price. Include promotions or guarantees if available.'
      )
    },
    {
      label: t('USP / Diferenciador', 'USP / Differentiator'),
      value: 15,
      field: 'usp',
      met: Boolean(formData.usp && formData.usp.length > 20),
      recommendation: t(
        'Define qué hace única tu oferta. ¿Por qué elegirte vs competidores? Sé específico.',
        'Define what makes your offer unique. Why choose you vs competitors? Be specific.'
      )
    },
    {
      label: t('Prueba social / Evidencia', 'Social proof / Evidence'),
      value: 10,
      field: 'multi',
      checkFn: (data) => Boolean(data.allowedClaims || data.availableAssets),
      met: Boolean(formData.allowedClaims || formData.availableAssets),
      recommendation: t(
        'Añade claims verificables (ej. "reduce costos 30%"), casos de éxito, testimonios o certificaciones.',
        'Add verifiable claims (e.g., "reduces costs 30%"), case studies, testimonials or certifications.'
      )
    },
    {
      label: t('Canales + presupuesto', 'Channels + budget'),
      value: 10,
      field: 'multi',
      checkFn: (data) => Boolean(data.channels.length > 0 && data.budget),
      met: Boolean(formData.channels.length > 0 && formData.budget),
      recommendation: t(
        'Selecciona los canales de marketing y asigna un presupuesto total con duración.',
        'Select marketing channels and assign a total budget with duration.'
      )
    },
    {
      label: t('Restricciones de marca / legales', 'Brand / legal restrictions'),
      value: 10,
      field: 'multi',
      checkFn: (data) => Boolean(data.tone || data.legalRequirements || data.forbiddenWords),
      met: Boolean(formData.tone || formData.legalRequirements || formData.forbiddenWords),
      recommendation: t(
        'Define el tono de comunicación, palabras prohibidas y requisitos legales (GDPR, términos, etc.).',
        'Define communication tone, forbidden words and legal requirements (GDPR, terms, etc.).'
      )
    },
    {
      label: t('Timing / Geografía', 'Timing / Geography'),
      value: 5,
      field: 'multi',
      checkFn: (data) => Boolean(data.timing || data.geography),
      met: Boolean(formData.timing || formData.geography),
      recommendation: t(
        'Especifica fechas de inicio/fin y geografía objetivo con idiomas relevantes.',
        'Specify start/end dates and target geography with relevant languages.'
      )
    }
  ]

  const totalScore = scoreItems.reduce((sum, item) => sum + (item.met ? item.value : 0), 0)
  const missingItems = scoreItems.filter(item => !item.met)
  const completedItems = scoreItems.filter(item => item.met)

  const getScoreStatus = () => {
    if (totalScore >= 80) return {
      label: t('Listo para generar', 'Ready to generate'),
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      icon: CheckCircle,
      variant: 'success' as const
    }
    if (totalScore >= 50) return {
      label: t('Casi listo', 'Almost ready'),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent',
      icon: Warning,
      variant: 'warning' as const
    }
    return {
      label: t('Necesita completar datos', 'Needs more data'),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive',
      icon: XCircle,
      variant: 'destructive' as const
    }
  }

  const status = getScoreStatus()
  const StatusIcon = status.icon

  return (
    <Card className="glass-panel border-2 p-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Sparkle size={18} weight="fill" className="text-accent" />
            {t('Brief Score', 'Brief Score')}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-bold", status.color)}>
              {totalScore}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">/100</span>
          </div>
        </div>

        <Progress value={totalScore} className="h-3" />

        <Alert className={cn("border-2", status.borderColor, status.bgColor)}>
          <StatusIcon size={20} weight="fill" className={status.color} />
          <AlertDescription className="ml-2">
            <span className={cn("font-bold", status.color)}>{status.label}</span>
            {totalScore < 80 && (
              <span className="block text-xs mt-1 text-muted-foreground">
                {t(
                  `El resultado será más genérico por falta de datos. Completa ${100 - totalScore} puntos más para una campaña optimizada.`,
                  `The result will be more generic due to missing data. Complete ${100 - totalScore} more points for an optimized campaign.`
                )}
              </span>
            )}
          </AlertDescription>
        </Alert>

        {missingItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <XCircle size={16} weight="fill" className="text-destructive" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive">
                {t('Qué falta', 'What\'s missing')} ({missingItems.length})
              </h4>
            </div>
            <ul className="space-y-2">
              {missingItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <div className={cn(
                    "min-w-[32px] h-5 rounded-md flex items-center justify-center font-bold text-[10px]",
                    "bg-destructive/20 text-destructive"
                  )}>
                    +{item.value}
                  </div>
                  <span className="text-foreground/80 font-medium leading-5">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {completedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-success" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-success">
                {t('Completado', 'Completed')} ({completedItems.length})
              </h4>
            </div>
            <ul className="space-y-2">
              {completedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs">
                  <div className={cn(
                    "min-w-[32px] h-5 rounded-md flex items-center justify-center font-bold text-[10px]",
                    "bg-success/20 text-success"
                  )}>
                    {item.value}
                  </div>
                  <span className="text-foreground/70 font-medium leading-5">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {missingItems.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} weight="fill" className="text-accent" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                {t('Cómo mejorarlo', 'How to improve')}
              </h4>
            </div>
            <ul className="space-y-3">
              {missingItems.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs space-y-1">
                  <div className="font-bold text-primary">{item.label}</div>
                  <div className="text-muted-foreground leading-relaxed pl-3 border-l-2 border-accent/30">
                    {item.recommendation}
                  </div>
                </li>
              ))}
            </ul>
            {missingItems.length > 3 && (
              <p className="text-xs text-muted-foreground italic">
                {t(
                  `+ ${missingItems.length - 3} recomendaciones más...`,
                  `+ ${missingItems.length - 3} more recommendations...`
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
