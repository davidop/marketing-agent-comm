import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Funnel, Target, Lightbulb, ShoppingCart, Heart, TrendUp, Download } from '@phosphor-icons/react'
import { exportSection } from '@/lib/sectionExport'
import { toast } from 'sonner'
import type { Language } from '@/lib/i18n'

export interface FunnelPhase {
  phase: 'awareness' | 'consideration' | 'conversion' | 'retention'
  phaseLabel: string
  objective: string
  keyMessage: string
  formats: string[]
  cta: string
  kpis: string[]
  examples: {
    title: string
    description: string
    format: string
  }[]
}

interface FunnelBlueprintProps {
  phases?: FunnelPhase[]
  language?: Language
}

const defaultPhasesES: FunnelPhase[] = [
  {
    phase: 'awareness',
    phaseLabel: 'Awareness',
    objective: 'Generar conocimiento de marca y captar atención del público objetivo',
    keyMessage: 'Existe una solución para tu problema',
    formats: ['Video corto', 'Infografía', 'Post en redes', 'Display ads', 'Artículo blog'],
    cta: 'Descubre más',
    kpis: ['Impresiones', 'Alcance', 'Engagement rate', 'CTR', 'Brand recall'],
    examples: [
      {
        title: '¿Sabías que el 70% de las empresas pierden datos críticos?',
        description: 'Video de 30 segundos mostrando el problema sin solución explícita, generando curiosidad',
        format: 'Video corto'
      },
      {
        title: 'Infografía: Las 5 señales de que tu infraestructura necesita modernización',
        description: 'Contenido educativo compartible que posiciona la marca como experta',
        format: 'Infografía'
      }
    ]
  },
  {
    phase: 'consideration',
    phaseLabel: 'Consideración',
    objective: 'Educar sobre la solución y demostrar valor diferencial',
    keyMessage: 'Nuestra solución es la mejor opción para ti',
    formats: ['Webinar', 'Caso de estudio', 'Guía descargable', 'Demo en video', 'Comparativa'],
    cta: 'Ver caso de éxito',
    kpis: ['Tiempo en página', 'Descargas', 'Registros', 'Video completion rate', 'Lead score'],
    examples: [
      {
        title: 'Caso de éxito: Cómo empresa X redujo costos 40% con nuestra solución',
        description: 'PDF descargable con datos reales, testimonios y ROI demostrado',
        format: 'Caso de estudio'
      },
      {
        title: 'Webinar: Azure ARC vs. soluciones tradicionales',
        description: 'Sesión educativa de 45 min con demo en vivo y Q&A',
        format: 'Webinar'
      }
    ]
  },
  {
    phase: 'conversion',
    phaseLabel: 'Conversión',
    objective: 'Impulsar la decisión de compra y eliminar objeciones',
    keyMessage: 'Es el momento perfecto para actuar',
    formats: ['Landing page', 'Free trial', 'Demo personalizada', 'Consulta gratuita', 'Oferta limitada'],
    cta: 'Agenda tu demo',
    kpis: ['Conversion rate', 'CPA', 'ROAS', 'Form completion rate', 'Cost per lead'],
    examples: [
      {
        title: 'Landing: Implementa Azure ARC en 30 días o te devolvemos tu inversión',
        description: 'Página optimizada con garantía, social proof, FAQ y formulario simple',
        format: 'Landing page'
      },
      {
        title: 'Email de urgencia: Últimas 48h para acceder a implementación sin costo adicional',
        description: 'Secuencia automatizada con countdown timer y testimonios',
        format: 'Email'
      }
    ]
  },
  {
    phase: 'retention',
    phaseLabel: 'Retención',
    objective: 'Fidelizar clientes y generar advocacy',
    keyMessage: 'Eres parte de una comunidad de éxito',
    formats: ['Newsletter', 'Programa de lealtad', 'Comunidad exclusiva', 'Contenido premium', 'Referral program'],
    cta: 'Únete a la comunidad',
    kpis: ['Retention rate', 'NPS', 'LTV', 'Referral rate', 'Upsell/Cross-sell rate'],
    examples: [
      {
        title: 'Newsletter mensual: Novedades, tips avanzados y casos exclusivos',
        description: 'Contenido de valor continuo que mantiene engagement',
        format: 'Newsletter'
      },
      {
        title: 'Programa de referidos: Gana créditos por cada cliente que traigas',
        description: 'Sistema de incentivos para convertir clientes en embajadores',
        format: 'Referral program'
      }
    ]
  }
]

const defaultPhasesEN: FunnelPhase[] = [
  {
    phase: 'awareness',
    phaseLabel: 'Awareness',
    objective: 'Generate brand awareness and capture target audience attention',
    keyMessage: 'There is a solution for your problem',
    formats: ['Short video', 'Infographic', 'Social post', 'Display ads', 'Blog article'],
    cta: 'Learn more',
    kpis: ['Impressions', 'Reach', 'Engagement rate', 'CTR', 'Brand recall'],
    examples: [
      {
        title: 'Did you know 70% of companies lose critical data?',
        description: '30-second video showing the problem without explicit solution, generating curiosity',
        format: 'Short video'
      },
      {
        title: 'Infographic: 5 signs your infrastructure needs modernization',
        description: 'Shareable educational content positioning the brand as expert',
        format: 'Infographic'
      }
    ]
  },
  {
    phase: 'consideration',
    phaseLabel: 'Consideration',
    objective: 'Educate about the solution and demonstrate differential value',
    keyMessage: 'Our solution is the best option for you',
    formats: ['Webinar', 'Case study', 'Downloadable guide', 'Video demo', 'Comparison'],
    cta: 'See success story',
    kpis: ['Time on page', 'Downloads', 'Registrations', 'Video completion rate', 'Lead score'],
    examples: [
      {
        title: 'Success story: How company X reduced costs 40% with our solution',
        description: 'Downloadable PDF with real data, testimonials and proven ROI',
        format: 'Case study'
      },
      {
        title: 'Webinar: Azure ARC vs. traditional solutions',
        description: '45-min educational session with live demo and Q&A',
        format: 'Webinar'
      }
    ]
  },
  {
    phase: 'conversion',
    phaseLabel: 'Conversion',
    objective: 'Drive purchase decision and eliminate objections',
    keyMessage: 'Now is the perfect time to act',
    formats: ['Landing page', 'Free trial', 'Personalized demo', 'Free consultation', 'Limited offer'],
    cta: 'Schedule your demo',
    kpis: ['Conversion rate', 'CPA', 'ROAS', 'Form completion rate', 'Cost per lead'],
    examples: [
      {
        title: 'Landing: Implement Azure ARC in 30 days or get your money back',
        description: 'Optimized page with guarantee, social proof, FAQ and simple form',
        format: 'Landing page'
      },
      {
        title: 'Urgency email: Last 48h to access implementation at no extra cost',
        description: 'Automated sequence with countdown timer and testimonials',
        format: 'Email'
      }
    ]
  },
  {
    phase: 'retention',
    phaseLabel: 'Retention',
    objective: 'Build customer loyalty and generate advocacy',
    keyMessage: 'You are part of a successful community',
    formats: ['Newsletter', 'Loyalty program', 'Exclusive community', 'Premium content', 'Referral program'],
    cta: 'Join the community',
    kpis: ['Retention rate', 'NPS', 'LTV', 'Referral rate', 'Upsell/Cross-sell rate'],
    examples: [
      {
        title: 'Monthly newsletter: News, advanced tips and exclusive cases',
        description: 'Continuous value content that maintains engagement',
        format: 'Newsletter'
      },
      {
        title: 'Referral program: Earn credits for each client you bring',
        description: 'Incentive system to turn customers into ambassadors',
        format: 'Referral program'
      }
    ]
  }
]

const getPhaseIcon = (phase: string) => {
  switch (phase) {
    case 'awareness':
      return <Lightbulb size={24} weight="fill" className="text-accent" />
    case 'consideration':
      return <Target size={24} weight="fill" className="text-primary" />
    case 'conversion':
      return <ShoppingCart size={24} weight="fill" className="text-success" />
    case 'retention':
      return <Heart size={24} weight="fill" className="text-secondary" />
    default:
      return <Funnel size={24} weight="fill" />
  }
}

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'awareness':
      return 'bg-accent/10 border-accent/30'
    case 'consideration':
      return 'bg-primary/10 border-primary/30'
    case 'conversion':
      return 'bg-success/10 border-success/30'
    case 'retention':
      return 'bg-secondary/10 border-secondary/30'
    default:
      return 'bg-muted border-border'
  }
}

export default function FunnelBlueprint({ phases, language = 'es' }: FunnelBlueprintProps) {
  const defaultPhases = language === 'es' ? defaultPhasesES : defaultPhasesEN
  const finalPhases = phases || defaultPhases

  const labels = {
    es: {
      title: 'Funnel Blueprint',
      objective: 'Objetivo',
      keyMessage: 'Mensaje Clave',
      formats: 'Formatos Recomendados',
      cta: 'CTA',
      kpis: 'KPIs',
      examples: 'Piezas Tipo',
      format: 'Formato'
    },
    en: {
      title: 'Funnel Blueprint',
      objective: 'Objective',
      keyMessage: 'Key Message',
      formats: 'Recommended Formats',
      cta: 'CTA',
      kpis: 'KPIs',
      examples: 'Example Pieces',
      format: 'Format'
    }
  }

  const t = labels[language]

  const handleExport = (format: 'pdf' | 'html' | 'word' | 'json' | 'text') => {
    try {
      exportSection({
        sectionName: t.title,
        sectionData: finalPhases,
        language,
        format
      })
      toast.success(language === 'es' ? 'Sección exportada exitosamente' : 'Section exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error(language === 'es' ? 'Error al exportar' : 'Export error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Funnel size={28} weight="fill" className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-sm text-muted-foreground">
              {language === 'es' ? '4 fases estratégicas del customer journey' : '4 strategic phases of the customer journey'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleExport('pdf')} className="h-9 px-3">
            <Download size={16} className="mr-2" />
            PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport('html')} className="h-9 px-3">
            <Download size={16} className="mr-2" />
            HTML
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport('json')} className="h-9 px-3">
            <Download size={16} className="mr-2" />
            JSON
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {finalPhases.map((phase, index) => (
          <Card key={phase.phase} className={`p-6 space-y-4 glass-panel-hover border-2 ${getPhaseColor(phase.phase)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getPhaseIcon(phase.phase)}
                <div>
                  <h3 className="text-xl font-bold">{phase.phaseLabel}</h3>
                  <Badge variant="outline" className="mt-1">
                    {language === 'es' ? 'Fase' : 'Phase'} {index + 1}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendUp size={20} weight="bold" />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t.objective}</h4>
                <p className="text-base">{phase.objective}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t.keyMessage}</h4>
                <p className="text-base font-medium italic text-primary">"{phase.keyMessage}"</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t.formats}</h4>
                <div className="flex flex-wrap gap-2">
                  {phase.formats.map((format, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t.cta}</h4>
                  <Badge className="text-sm font-semibold px-4 py-1">{phase.cta}</Badge>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">{t.kpis}</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.kpis.map((kpi, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mono">
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">{t.examples}</h4>
              <div className="space-y-3">
                {phase.examples.map((example, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background/60 border border-border/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-semibold text-sm leading-tight flex-1">{example.title}</h5>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {example.format}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
