import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Lightning, 
  Crown,
  Sparkle,
  ChartBar,
  Target,
  Warning
} from '@phosphor-icons/react'

export interface CreativeRoute {
  type: 'safe' | 'bold' | 'premium'
  bigIdea: string
  tagline: string
  hooks: string[]
  adExamples: {
    title: string
    body: string
    cta: string
  }[]
  risk: 'bajo' | 'medio' | 'alto'
  whenToUse: string
  expectedResults: string
}

interface CreativeRoutesDisplayProps {
  routes: CreativeRoute[]
  language: 'es' | 'en'
  isLoading?: boolean
}

export function CreativeRoutesDisplay({ routes, language, isLoading = false }: CreativeRoutesDisplayProps) {
  const t = (es: string, en: string) => language === 'es' ? es : en

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'safe':
        return <Shield size={24} weight="fill" />
      case 'bold':
        return <Lightning size={24} weight="fill" />
      case 'premium':
        return <Crown size={24} weight="fill" />
      default:
        return <Sparkle size={24} weight="fill" />
    }
  }

  const getRouteTitle = (type: string) => {
    switch (type) {
      case 'safe':
        return t('Ruta Segura', 'Safe Route')
      case 'bold':
        return t('Ruta Atrevida', 'Bold Route')
      case 'premium':
        return t('Ruta Premium', 'Premium Route')
      default:
        return type
    }
  }

  const getRouteDescription = (type: string) => {
    switch (type) {
      case 'safe':
        return t('Claridad y enfoque directo', 'Clarity and direct approach')
      case 'bold':
        return t('Hook fuerte y disruptivo', 'Strong and disruptive hook')
      case 'premium':
        return t('Elegante y aspiracional', 'Elegant and aspirational')
      default:
        return ''
    }
  }

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "destructive" => {
    switch (risk) {
      case 'bajo':
        return 'default'
      case 'medio':
        return 'secondary'
      case 'alto':
        return 'destructive'
      default:
        return 'default'
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-panel p-6 border-2">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-8 bg-muted/50 animate-pulse rounded-lg w-1/3" />
              <div className="h-24 bg-muted/50 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!routes || routes.length === 0) {
    return (
      <Card className="glass-panel p-12 border-2">
        <div className="text-center">
          <Sparkle size={48} weight="fill" className="mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground italic">
            {t('Las rutas creativas se generarán aquí', 'Creative routes will be generated here')}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="safe" className="w-full">
        <TabsList className="glass-panel mb-6 border-2 rounded-xl p-1 w-full grid grid-cols-3">
          <TabsTrigger value="safe" className="text-sm font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Shield size={18} weight="fill" className="mr-2" />
            {t('Segura', 'Safe')}
          </TabsTrigger>
          <TabsTrigger value="bold" className="text-sm font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Lightning size={18} weight="fill" className="mr-2" />
            {t('Atrevida', 'Bold')}
          </TabsTrigger>
          <TabsTrigger value="premium" className="text-sm font-bold rounded-lg px-4 py-2 data-[state=active]:neon-glow">
            <Crown size={18} weight="fill" className="mr-2" />
            {t('Premium', 'Premium')}
          </TabsTrigger>
        </TabsList>

        {routes.map((route) => (
          <TabsContent key={route.type} value={route.type} className="mt-0">
            <Card className="glass-panel p-6 border-2 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {getRouteIcon(route.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{getRouteTitle(route.type)}</h2>
                    <p className="text-muted-foreground">{getRouteDescription(route.type)}</p>
                  </div>
                </div>
                <Badge variant={getRiskBadgeVariant(route.risk)} className="text-xs">
                  {t('Riesgo:', 'Risk:')} {route.risk}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkle size={16} weight="fill" className="text-accent" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-accent">
                        {t('Big Idea', 'Big Idea')}
                      </h3>
                    </div>
                    <p className="text-lg font-semibold leading-relaxed">{route.bigIdea}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} weight="fill" className="text-secondary" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-secondary">
                        {t('Tagline', 'Tagline')}
                      </h3>
                    </div>
                    <p className="text-base font-medium italic">&ldquo;{route.tagline}&rdquo;</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ChartBar size={16} weight="fill" className="text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
                        {t('5 Hooks', '5 Hooks')}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {route.hooks.map((hook, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="flex-1 pt-0.5">{hook}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
                      {t('3 Ejemplos de Anuncio', '3 Ad Examples')}
                    </h3>
                    <div className="space-y-3">
                      {route.adExamples.map((ad, idx) => (
                        <Card key={idx} className="p-4 border-2 bg-background/50 space-y-2">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs">
                              {t('Ejemplo', 'Example')} {idx + 1}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm">{ad.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{ad.body}</p>
                          <div className="pt-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                              {ad.cta}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <div className="flex items-start gap-2 mb-2">
                    <Warning size={18} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                    <h4 className="text-sm font-bold text-accent">
                      {t('Cuándo Usarla', 'When to Use')}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed">{route.whenToUse}</p>
                </Card>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-2 mb-2">
                    <ChartBar size={18} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                    <h4 className="text-sm font-bold text-primary">
                      {t('Resultados Esperados', 'Expected Results')}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed">{route.expectedResults}</p>
                </Card>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
