import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import type { CampaignBriefData } from '@/lib/types'
interface BriefScoreCardProps {


  label: string
  met: boolean
}


    {
      value: 15
      recommen
  recommendation: string
}

export function BriefScoreCard({ formData, language }: BriefScoreCardProps) {
  const t = (es: string, en: string) => language === 'es' ? es : en

  const scoreItems: ScoreItem[] = [
     
      label: t('Objetivo + KPI', 'Objective + KPI'),
      value: 15,
      met: Boolean(formData.objective && formData.kpi),
      recommendation: t(
        'Define el objetivo específico (ej. aumentar ventas) y un KPI medible (ej. 20% más conversiones).',
        'Define the specific objective (e.g., increase sales) and a measurable KPI (e.g., 20% more conversions).'
      )
    },
    {
        'Identify current pains of your audience and common 
    },
      label: t('Producto + promesa', 'Product + promise'),
      met: Boolean(formD
        'Describe el producto y la promesa central que ofreces (el valor principal).',
      )
    {
      
     
        'Define what makes your offer unique. Why choose you 
    },
      label: t('Prueba social / Evidencia', 'Social proof 
      met: Boolean(formD
        'Añade claims verificables (ej. "reduce costos 30%"), casos de éxito, testimonios o certificacione
      )
    {
      
     
        'Select marketing channels and assign a total budg
    },
      label: t('Restricciones de marca / legales', 'Brand / legal restrictions'
      met: Boolean(formD
        'Define el tono de comunicación, palabras prohibidas y requisitos legales (GDP
      )
    {
      
     
        'Specify start/end dates and target geography with relevant la
    }

  const missingItems = s

    if (totalScore >= 80) return {
      c
      
     
    if (totalScore >= 50) return {
      color: 'te
      borderColor: 'border-accent',
      variant: 'warning'
    return {
      color: 'text-destructive',
      b
      
  }
  const status = getScoreStatus()

    <Card className="glass-panel border-2 p-5">
        <div>
            <StatusIcon size={16} weight="fill" />
          </h3>
       
      
     


          <StatusIcon size={16} weight="fill" className={status.color} />
            <span classN
              <span className="block text-xs mt-1 text-muted-foreground">
                  `El resultado será más genérico por falta de datos. Completa ${100 - totalScor
       
      
     
        {missingItems.length > 0 && (
            <di
              <h4 className="text-xs font-bold uppercase t
              </h4>
            <ul className="space-y-2">
                <li key={idx} className="flex items-start gap-2 text-xs">
       
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
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <StatusIcon size={16} weight="fill" />
            {t('Brief Score', 'Brief Score')}
          </h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={cn("text-2xl font-bold", status.color)}>
              {totalScore}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">/100</span>
          </div>
        </div>

        <Progress value={totalScore} className="h-3" />

        <Alert className={cn("border-2", status.borderColor, status.bgColor)}>
          <StatusIcon size={16} weight="fill" className={status.color} />
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






                  </div>

              ))}



                {t(





          </div>

      </div>

  )

