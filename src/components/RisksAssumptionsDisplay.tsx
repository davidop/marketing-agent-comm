import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Warning, 
  CheckCircle, 
  Question, 
  ShieldCheck, 
  Clock,
  Target,
  TrendUp,
  WarningCircle
} from '@phosphor-icons/react'
import type { RisksAssumptionsData } from '@/lib/types'

interface RisksAssumptionsDisplayProps {
  data: RisksAssumptionsData
  language: 'es' | 'en'
  isLoading?: boolean
}

export function RisksAssumptionsDisplay({ 
  data, 
  language, 
  isLoading = false 
}: RisksAssumptionsDisplayProps) {
  const t = (es: string, en: string) => language === 'es' ? es : en

  const getImpactColor = (impact: 'alto' | 'medio' | 'bajo') => {
    switch (impact) {
      case 'alto':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medio':
        return 'bg-accent/10 text-accent-foreground border-accent/20'
      case 'bajo':
        return 'bg-success/10 text-success-foreground border-success/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getProbabilityColor = (prob: 'alta' | 'media' | 'baja') => {
    switch (prob) {
      case 'alta':
        return 'destructive'
      case 'media':
        return 'secondary'
      case 'baja':
        return 'outline'
      default:
        return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-panel p-6 border-2">
            <div className="h-32 bg-muted/50 animate-pulse rounded-lg" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel p-6 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <Question size={28} weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">
              {t('Supuestos', 'Assumptions')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Lo que estamos asumiendo del brief y del contexto de campaña',
                'What we are assuming from the brief and campaign context'
              )}
            </p>
            
            {data.assumptions && data.assumptions.length > 0 ? (
              <div className="space-y-3">
                {data.assumptions.map((assumption, idx) => (
                  <Alert key={idx} className="border-2">
                    <CheckCircle size={18} weight="fill" className="text-primary" />
                    <AlertDescription className="text-sm ml-2">
                      {assumption}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('No hay supuestos registrados', 'No assumptions recorded')}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-panel p-6 border-2 border-destructive/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive shrink-0">
            <Warning size={28} weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">
              {t('Riesgos', 'Risks')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Por qué podría fallar la campaña y qué factores podrían impactar negativamente',
                'Why the campaign could fail and what factors could negatively impact'
              )}
            </p>
            
            {data.risks && data.risks.length > 0 ? (
              <div className="space-y-4">
                {data.risks.map((risk, idx) => (
                  <Card key={idx} className="p-4 border-2">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">
                            {risk.description}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge 
                            variant={getProbabilityColor(risk.probability)}
                            className="text-xs"
                          >
                            {t('Prob:', 'Prob:')} {risk.probability}
                          </Badge>
                          <Badge 
                            className={`text-xs border ${getImpactColor(risk.impact)}`}
                          >
                            {t('Impacto:', 'Impact:')} {risk.impact}
                          </Badge>
                        </div>
                      </div>
                      
                      {risk.reasoning && (
                        <p className="text-sm text-muted-foreground">
                          {risk.reasoning}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('No hay riesgos identificados', 'No risks identified')}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-panel p-6 border-2 border-success/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-success/10 text-success-foreground shrink-0">
            <ShieldCheck size={28} weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">
              {t('Mitigaciones', 'Mitigations')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Qué hacer para reducir cada riesgo y cómo prepararse',
                'What to do to reduce each risk and how to prepare'
              )}
            </p>
            
            {data.mitigations && data.mitigations.length > 0 ? (
              <div className="space-y-4">
                {data.mitigations.map((mitigation, idx) => (
                  <Card key={idx} className="p-4 border-2 bg-success/5">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <TrendUp size={20} weight="fill" className="text-success-foreground mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">
                            {mitigation.risk}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {mitigation.action}
                          </p>
                          
                          {mitigation.priority && (
                            <Badge 
                              variant={
                                mitigation.priority === 'alta' 
                                  ? 'destructive' 
                                  : mitigation.priority === 'media' 
                                  ? 'secondary' 
                                  : 'outline'
                              }
                              className="text-xs"
                            >
                              <Target size={12} weight="fill" className="mr-1" />
                              {t('Prioridad:', 'Priority:')} {mitigation.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('No hay mitigaciones definidas', 'No mitigations defined')}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-panel p-6 border-2 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent/10 text-accent-foreground shrink-0">
            <Clock size={28} weight="fill" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">
              {t('TBDs (Por Definir)', 'TBDs (To Be Defined)')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t(
                'Datos o información que faltan y necesitan validarse antes del lanzamiento',
                'Missing data or information that needs validation before launch'
              )}
            </p>
            
            {data.tbds && data.tbds.length > 0 ? (
              <div className="space-y-3">
                {data.tbds.map((tbd, idx) => (
                  <Card key={idx} className="p-4 border-2 border-accent/30 bg-accent/5">
                    <div className="flex items-start gap-3">
                      <WarningCircle 
                        size={20} 
                        weight="fill" 
                        className="text-accent-foreground mt-0.5 shrink-0" 
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          {tbd.item}
                        </h3>
                        {tbd.why && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {tbd.why}
                          </p>
                        )}
                        {tbd.suggestion && (
                          <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded border">
                            💡 {t('Sugerencia:', 'Suggestion:')} {tbd.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('No hay TBDs pendientes', 'No pending TBDs')}
              </p>
            )}
          </div>
        </div>
      </Card>

      {(data.recommendations && data.recommendations.length > 0) && (
        <>
          <Separator className="my-6" />
          
          <Card className="glass-panel p-6 border-2">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <CheckCircle size={28} weight="fill" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">
                  {t('Recomendaciones Generales', 'General Recommendations')}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t(
                    'Mejores prácticas y sugerencias para aumentar las probabilidades de éxito',
                    'Best practices and suggestions to increase success probability'
                  )}
                </p>
                
                <ul className="space-y-2">
                  {data.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={18} weight="fill" className="text-primary mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
