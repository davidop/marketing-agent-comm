import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkle, Rocket, ShoppingCart, GraduationCap, CheckCircle } from '@phosphor-icons/react'
import { demoBriefs, type DemoBrief } from '@/lib/demoBriefs'
import type { CampaignBriefData, BrandKit } from '@/lib/types'
import { toast } from 'sonner'

interface DemoBriefSelectorProps {
  onBriefSelected: (briefData: CampaignBriefData, brandKit: BrandKit) => void
  language: 'es' | 'en'
}

export default function DemoBriefSelector({ onBriefSelected, language }: DemoBriefSelectorProps) {
  const [, setCurrentBrief] = useKV<CampaignBriefData | null>('current-brief', null)
  const [, setBrandKit] = useKV<BrandKit>('brand-kit-v2', {
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

  const handleLoadDemo = (demo: DemoBrief) => {
    setCurrentBrief(() => demo.briefData)
    setBrandKit(() => demo.brandKit)
    onBriefSelected(demo.briefData, demo.brandKit)
    
    toast.success(
      language === 'es' 
        ? `✨ Brief "${demo.name}" cargado con éxito`
        : `✨ Brief "${demo.name}" loaded successfully`,
      {
        description: language === 'es'
          ? 'Brief y Brand Kit listos. Puedes editarlos antes de generar.'
          : 'Brief and Brand Kit ready. You can edit before generating.'
      }
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'saas-b2b':
        return <Rocket size={24} weight="duotone" />
      case 'ecommerce':
        return <ShoppingCart size={24} weight="duotone" />
      case 'evento-curso':
        return <GraduationCap size={24} weight="duotone" />
      default:
        return <Sparkle size={24} weight="duotone" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'saas-b2b':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'ecommerce':
        return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'evento-curso':
        return 'bg-accent/10 text-accent-foreground border-accent/20'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="p-6 space-y-4 glass-panel">
      <div className="flex items-center gap-2 mb-4">
        <Sparkle size={20} weight="duotone" className="text-primary" />
        <h3 className="text-lg font-bold">
          {language === 'es' ? 'Briefs Demo' : 'Demo Briefs'}
        </h3>
      </div>

      <p className="text-sm text-muted-foreground">
        {language === 'es' 
          ? 'Carga un brief precargado con Brand Kit incluido para explorar la plataforma:'
          : 'Load a pre-filled brief with Brand Kit to explore the platform:'}
      </p>

      <div className="space-y-3">
        {demoBriefs.map((demo) => (
          <Card 
            key={demo.id} 
            className="p-4 hover:border-primary/50 transition-all cursor-pointer group glass-panel-hover"
            onClick={() => handleLoadDemo(demo)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getCategoryColor(demo.category)}`}>
                {getCategoryIcon(demo.category)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {demo.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {demo.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {demo.category === 'saas-b2b' && (language === 'es' ? 'SaaS B2B' : 'SaaS B2B')}
                    {demo.category === 'ecommerce' && (language === 'es' ? 'Ecommerce' : 'Ecommerce')}
                    {demo.category === 'evento-curso' && (language === 'es' ? 'Evento/Curso' : 'Event/Course')}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" className="text-success" />
                    <span>
                      {language === 'es' ? 'Brief completo' : 'Complete brief'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" className="text-success" />
                    <span>
                      {language === 'es' ? 'Brand Kit' : 'Brand Kit'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" className="text-success" />
                    <span>
                      {demo.briefData.proof?.length || 0} {language === 'es' ? 'pruebas' : 'proofs'}
                    </span>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoadDemo(demo)
                  }}
                >
                  <Sparkle size={16} weight="fill" className="mr-2" />
                  {language === 'es' ? 'Cargar brief' : 'Load brief'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
        <strong>{language === 'es' ? '💡 Tip:' : '💡 Tip:'}</strong>{' '}
        {language === 'es' 
          ? 'Estos briefs son ejemplos ficticios pero realistas. Puedes editarlos antes de generar la campaña.'
          : 'These briefs are fictional but realistic examples. You can edit them before generating the campaign.'}
      </div>
    </Card>
  )
}
