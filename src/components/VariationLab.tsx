import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Lightning, Copy, Target, Clock, ShieldCheck, Heart, ChatCircle, MagnifyingGlass, Sparkle, Star, SortAscending, Trophy } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { scoreCopyVariations } from '@/lib/copyScoring'
import type { CopyVariation, VariationChannel, VariationObjective, HookType, CopyAngle, BrandKit } from '@/lib/types'

interface VariationLabProps {
  variations: CopyVariation[]
  isGenerating: boolean
  language: 'es' | 'en'
}

type SortOption = 'none' | 'score-desc' | 'score-asc' | 'clarity' | 'specificity' | 'differentiation' | 'audience' | 'brand'

const ANGLE_ICONS = {
  beneficio: <Target size={18} weight="fill" className="text-primary" />,
  urgencia: <Clock size={18} weight="fill" className="text-destructive" />,
  autoridad: <ShieldCheck size={18} weight="fill" className="text-success" />,
  emocion: <Heart size={18} weight="fill" className="text-secondary" />,
  objeciones: <ChatCircle size={18} weight="fill" className="text-accent" />
}

const ANGLE_LABELS = {
  es: {
    beneficio: 'Beneficio',
    urgencia: 'Urgencia',
    autoridad: 'Autoridad',
    emocion: 'Emoción',
    objeciones: 'Objeciones'
  },
  en: {
    beneficio: 'Benefit',
    urgencia: 'Urgency',
    autoridad: 'Authority',
    emocion: 'Emotion',
    objeciones: 'Objections'
  }
}

const HOOK_TYPE_LABELS = {
  es: {
    curiosidad: 'Curiosidad',
    beneficio: 'Beneficio',
    autoridad: 'Autoridad',
    urgencia: 'Urgencia',
    objecion: 'Objeción'
  },
  en: {
    curiosidad: 'Curiosity',
    beneficio: 'Benefit',
    autoridad: 'Authority',
    urgencia: 'Urgency',
    objecion: 'Objection'
  }
}

const RISK_COLORS = {
  bajo: 'text-success border-success bg-success/10',
  medio: 'text-accent border-accent bg-accent/10',
  alto: 'text-destructive border-destructive bg-destructive/10'
}

const RISK_LABELS = {
  es: { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' },
  en: { bajo: 'Low', medio: 'Medium', alto: 'High' }
}

const CHANNEL_OPTIONS: VariationChannel[] = ['LinkedIn', 'Instagram', 'Reels', 'Ads', 'Email', 'Landing']
const OBJECTIVE_OPTIONS: VariationObjective[] = ['leads', 'ventas']

export function VariationLab({ variations: initialVariations, isGenerating, language }: VariationLabProps) {
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

  const [favorites, setFavorites] = useKV<string[]>('copy-favorites', [])
  const [scoredVariations, setScoredVariations] = useState<CopyVariation[]>([])

  const [selectedChannel, setSelectedChannel] = useState<VariationChannel | 'all'>('all')
  const [selectedObjective, setSelectedObjective] = useState<VariationObjective | 'all'>('all')
  const [selectedAngle, setSelectedAngle] = useState<CopyAngle | 'all'>('all')
  const [selectedHookType, setSelectedHookType] = useState<HookType | 'all'>('all')
  const [selectedRisk, setSelectedRisk] = useState<'bajo' | 'medio' | 'alto' | 'all'>('all')
  const [selectedTone, setSelectedTone] = useState<'cercano' | 'profesional' | 'premium' | 'canalla' | 'tech' | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('score-desc')
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  useEffect(() => {
    if (initialVariations.length > 0) {
      const scored = scoreCopyVariations(initialVariations, brandKit)
      const withFavorites = scored.map(v => ({
        ...v,
        isFavorite: favorites ? favorites.includes(v.id) : false
      }))
      setScoredVariations(withFavorites)
    }
  }, [initialVariations, brandKit, favorites])

  const toggleFavorite = (id: string) => {
    setFavorites(currentFavs => {
      const favs = currentFavs || []
      const isFav = favs.includes(id)
      if (isFav) {
        return favs.filter(fid => fid !== id)
      } else {
        return [...favs, id]
      }
    })
  }

  const filteredVariations = scoredVariations.filter(v => {
    const channelMatch = selectedChannel === 'all' || v.channel === selectedChannel
    const objectiveMatch = selectedObjective === 'all' || v.objective === selectedObjective
    const angleMatch = selectedAngle === 'all' || v.angle === selectedAngle
    const hookTypeMatch = selectedHookType === 'all' || v.hookType === selectedHookType
    const riskMatch = selectedRisk === 'all' || v.risk === selectedRisk
    const toneMatch = selectedTone === 'all' || v.tone === selectedTone
    const favoriteMatch = !showOnlyFavorites || v.isFavorite
    return channelMatch && objectiveMatch && angleMatch && hookTypeMatch && riskMatch && toneMatch && favoriteMatch
  })

  const sortedVariations = [...filteredVariations].sort((a, b) => {
    if (sortBy === 'none') return 0
    if (sortBy === 'score-desc') {
      return (b.scoring?.total || 0) - (a.scoring?.total || 0)
    }
    if (sortBy === 'score-asc') {
      return (a.scoring?.total || 0) - (b.scoring?.total || 0)
    }
    if (sortBy === 'clarity') {
      return (b.scoring?.clarity || 0) - (a.scoring?.clarity || 0)
    }
    if (sortBy === 'specificity') {
      return (b.scoring?.specificity || 0) - (a.scoring?.specificity || 0)
    }
    if (sortBy === 'differentiation') {
      return (b.scoring?.differentiation || 0) - (a.scoring?.differentiation || 0)
    }
    if (sortBy === 'audience') {
      return (b.scoring?.audienceFit || 0) - (a.scoring?.audienceFit || 0)
    }
    if (sortBy === 'brand') {
      return (b.scoring?.brandVoiceFit || 0) - (a.scoring?.brandVoiceFit || 0)
    }
    return 0
  })

  const copyVariation = (variation: CopyVariation) => {
    const text = `Hook (${variation.hookType}): ${variation.hook}\nPromesa: ${variation.promise}\nPrueba: ${variation.proof}\nCTA: ${variation.cta}\nRiesgo: ${variation.risk} (${variation.riskReason})\nScore: ${variation.scoring?.total || 0}/100`
    navigator.clipboard.writeText(text)
    toast.success(language === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard')
  }

  const groupedByAngle = sortedVariations.reduce((acc, v) => {
    if (!acc[v.angle]) acc[v.angle] = []
    acc[v.angle].push(v)
    return acc
  }, {} as Record<string, CopyVariation[]>)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-primary'
    if (score >= 40) return 'text-accent'
    return 'text-destructive'
  }

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'outline'
  }

  return (
    <Card className="glass-panel p-6 border-2 marketing-shine">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Lightning size={32} weight="fill" className="text-accent sparkle-animate" />
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Variation Lab
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {language === 'es' 
                ? 'Scoring automático (0-100) por claridad, especificidad, diferenciación, audiencia y brand voice' 
                : 'Automatic scoring (0-100) by clarity, specificity, differentiation, audience fit and brand voice'}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            {favorites && favorites.length > 0 && (
              <Badge variant="secondary" className="text-xs font-bold flex items-center gap-1">
                <Star size={14} weight="fill" className="text-accent" />
                {favorites.length} {language === 'es' ? 'favoritos' : 'favorites'}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs font-bold">
              {sortedVariations.length} {language === 'es' ? 'mostradas' : 'shown'}
            </Badge>
            {scoredVariations.length > 0 && (
              <Badge variant="secondary" className="text-xs font-bold">
                {scoredVariations.length} {language === 'es' ? 'total' : 'total'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 glass-panel p-4 border-2 rounded-xl space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <MagnifyingGlass size={20} weight="bold" className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            {language === 'es' ? 'Filtros y Ordenación' : 'Filters & Sorting'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Canal' : 'Channel'}
            </label>
            <Select value={selectedChannel} onValueChange={(v) => setSelectedChannel(v as any)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                {CHANNEL_OPTIONS.map(ch => (
                  <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Objetivo' : 'Objective'}
            </label>
            <Select value={selectedObjective} onValueChange={(v) => setSelectedObjective(v as any)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="ventas">{language === 'es' ? 'Ventas' : 'Sales'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Ángulo' : 'Angle'}
            </label>
            <Select value={selectedAngle} onValueChange={(v) => setSelectedAngle(v as any)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="beneficio">{ANGLE_LABELS[language].beneficio}</SelectItem>
                <SelectItem value="urgencia">{ANGLE_LABELS[language].urgencia}</SelectItem>
                <SelectItem value="autoridad">{ANGLE_LABELS[language].autoridad}</SelectItem>
                <SelectItem value="emocion">{ANGLE_LABELS[language].emocion}</SelectItem>
                <SelectItem value="objeciones">{ANGLE_LABELS[language].objeciones}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Riesgo' : 'Risk'}
            </label>
            <Select value={selectedRisk} onValueChange={(v) => setSelectedRisk(v as any)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="bajo">{RISK_LABELS[language].bajo}</SelectItem>
                <SelectItem value="medio">{RISK_LABELS[language].medio}</SelectItem>
                <SelectItem value="alto">{RISK_LABELS[language].alto}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <SortAscending size={16} weight="bold" />
              {language === 'es' ? 'Ordenar por' : 'Sort by'}
            </label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{language === 'es' ? 'Sin orden' : 'No sorting'}</SelectItem>
                <SelectItem value="score-desc">{language === 'es' ? 'Score Total (Mayor primero)' : 'Total Score (Highest first)'}</SelectItem>
                <SelectItem value="score-asc">{language === 'es' ? 'Score Total (Menor primero)' : 'Total Score (Lowest first)'}</SelectItem>
                <SelectItem value="clarity">{language === 'es' ? 'Claridad (25)' : 'Clarity (25)'}</SelectItem>
                <SelectItem value="specificity">{language === 'es' ? 'Especificidad (25)' : 'Specificity (25)'}</SelectItem>
                <SelectItem value="differentiation">{language === 'es' ? 'Diferenciación (20)' : 'Differentiation (20)'}</SelectItem>
                <SelectItem value="audience">{language === 'es' ? 'Ajuste Audiencia (20)' : 'Audience Fit (20)'}</SelectItem>
                <SelectItem value="brand">{language === 'es' ? 'Ajuste Brand Voice (10)' : 'Brand Voice Fit (10)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Tono (Brand Kit)' : 'Tone (Brand Kit)'}
            </label>
            <Select value={selectedTone} onValueChange={(v) => setSelectedTone(v as any)}>
              <SelectTrigger className="border-2 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                <SelectItem value="cercano">{language === 'es' ? 'Cercano' : 'Close'}</SelectItem>
                <SelectItem value="profesional">{language === 'es' ? 'Profesional' : 'Professional'}</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="canalla">{language === 'es' ? 'Canalla' : 'Edgy'}</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <Star size={16} weight="fill" className="text-accent" />
              {language === 'es' ? 'Favoritos' : 'Favorites'}
            </label>
            <Button
              variant={showOnlyFavorites ? 'default' : 'outline'}
              className="w-full border-2 font-bold"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            >
              {showOnlyFavorites 
                ? (language === 'es' ? 'Mostrar todos' : 'Show all')
                : (language === 'es' ? 'Solo favoritos' : 'Only favorites')}
            </Button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="text-center py-12">
          <Sparkle size={48} weight="fill" className="text-primary mx-auto mb-4 sparkle-animate" />
          <p className="text-sm text-muted-foreground font-medium">
            {language === 'es' ? 'Generando variaciones...' : 'Generating variations...'}
          </p>
        </div>
      )}

      {!isGenerating && sortedVariations.length === 0 && (
        <div className="text-center py-12">
          <Lightning size={48} weight="fill" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-medium">
            {language === 'es' 
              ? 'No hay variaciones que mostrar. Genera una campaña para ver opciones.' 
              : 'No variations to display. Generate a campaign to see options.'}
          </p>
        </div>
      )}

      {!isGenerating && sortedVariations.length > 0 && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="glass-panel border-2 mb-6">
            <TabsTrigger value="all" className="font-bold">
              {language === 'es' ? 'Todas' : 'All'} ({sortedVariations.length})
            </TabsTrigger>
            {Object.keys(groupedByAngle).map(angle => (
              <TabsTrigger key={angle} value={angle} className="font-bold">
                {ANGLE_LABELS[language][angle as CopyAngle]} ({groupedByAngle[angle].length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {sortedVariations.map((variation, idx) => (
                  <VariationCard
                    key={variation.id}
                    variation={variation}
                    language={language}
                    onCopy={() => copyVariation(variation)}
                    onToggleFavorite={() => toggleFavorite(variation.id)}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {Object.keys(groupedByAngle).map(angle => (
            <TabsContent key={angle} value={angle}>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {groupedByAngle[angle].map((variation, idx) => (
                    <VariationCard
                      key={variation.id}
                      variation={variation}
                      language={language}
                      onCopy={() => copyVariation(variation)}
                      onToggleFavorite={() => toggleFavorite(variation.id)}
                      rank={idx + 1}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  )
}

interface VariationCardProps {
  variation: CopyVariation
  language: 'es' | 'en'
  onCopy: () => void
  onToggleFavorite: () => void
  rank: number
}

function VariationCard({ variation, language, onCopy, onToggleFavorite, rank }: VariationCardProps) {
  const score = variation.scoring?.total || 0
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-success'
    if (s >= 60) return 'text-primary'
    if (s >= 40) return 'text-accent'
    return 'text-destructive'
  }

  return (
    <Card className={cn(
      "glass-panel-hover border-2 p-5 transition-all",
      variation.isFavorite && "border-accent shadow-lg"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {rank <= 3 && (
            <Trophy size={24} weight="fill" className={cn(
              rank === 1 && "text-accent",
              rank === 2 && "text-primary",
              rank === 3 && "text-secondary"
            )} />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {ANGLE_ICONS[variation.angle]}
              <Badge variant="outline" className="text-xs font-bold">
                {ANGLE_LABELS[language][variation.angle]}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {HOOK_TYPE_LABELS[language][variation.hookType]}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold">{variation.channel}</span>
              <span>•</span>
              <span>{variation.objective}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={variation.isFavorite ? "default" : "ghost"}
            onClick={onToggleFavorite}
            className="border-2"
          >
            <Star size={18} weight={variation.isFavorite ? "fill" : "regular"} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onCopy} className="border-2">
            <Copy size={18} weight="bold" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase">
            {language === 'es' ? 'Score Total' : 'Total Score'}
          </h4>
          <span className={cn("text-2xl font-bold", getScoreColor(score))}>
            {score}/100
          </span>
        </div>
        <Progress value={score} className="h-2 mb-3" />
        
        <div className="grid grid-cols-5 gap-2 text-center">
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-1">
              {language === 'es' ? 'Claridad' : 'Clarity'}
            </div>
            <div className="text-sm font-bold">{variation.scoring?.clarity || 0}/25</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-1">
              {language === 'es' ? 'Especific.' : 'Specific.'}
            </div>
            <div className="text-sm font-bold">{variation.scoring?.specificity || 0}/25</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-1">
              {language === 'es' ? 'Diferenc.' : 'Differ.'}
            </div>
            <div className="text-sm font-bold">{variation.scoring?.differentiation || 0}/20</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-1">
              {language === 'es' ? 'Audiencia' : 'Audience'}
            </div>
            <div className="text-sm font-bold">{variation.scoring?.audienceFit || 0}/20</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-1">
              {language === 'es' ? 'Brand' : 'Brand'}
            </div>
            <div className="text-sm font-bold">{variation.scoring?.brandVoiceFit || 0}/10</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase">Hook:</span>
          <p className="text-sm font-semibold mt-1">{variation.hook}</p>
        </div>

        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase">
            {language === 'es' ? 'Promesa' : 'Promise'}:
          </span>
          <p className="text-sm mt-1">{variation.promise}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase">
              {language === 'es' ? 'Prueba' : 'Proof'}:
            </span>
            <p className="text-sm mt-1">{variation.proof}</p>
          </div>

          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase">CTA:</span>
            <p className="text-sm mt-1 font-semibold">{variation.cta}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Badge className={cn("text-xs font-bold", RISK_COLORS[variation.risk])}>
            {RISK_LABELS[language][variation.risk]} {language === 'es' ? 'Riesgo' : 'Risk'}
          </Badge>
          <span className="text-xs text-muted-foreground">{variation.riskReason}</span>
        </div>
      </div>
    </Card>
  )
}
