import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Copy,
  ArrowsClockwise,
  Target,
  Users,
  Lightning,
  ChartBar,
  Flask,
  CurrencyEur,
  TrendUp,
  CheckCircle,
  WarningCircle,
  Download,
} from '@phosphor-icons/react'
import { exportSection } from '@/lib/sectionExport'

interface CampaignStructure {
  objective: string
  adsets: Array<{
    name: string
    audience: string
    bidStrategy: string
    budget: string
  }>
}

interface AudienceSegment {
  type: 'cold' | 'lookalike' | 'retargeting'
  name: string
  size: string
  description: string
  criteria: string[]
}

interface CopyVariant {
  hook: string
  headline: string
  description: string
  angle: 'beneficio' | 'urgencia' | 'autoridad' | 'emocion' | 'objeciones'
  risk: 'bajo' | 'medio' | 'alto'
}

interface CreativeAngle {
  angle: 'beneficio' | 'urgencia' | 'autoridad' | 'emocion' | 'objeciones'
  description: string
  whenToUse: string
  examples: string[]
}

interface BudgetPhase {
  phase: string
  percentage: number
  allocation: string
  reasoning: string
}

interface TestPlan {
  priority: number
  testName: string
  hypothesis: string
  variants: string[]
  metric: string
  duration: string
  reasoning: string
}

interface PaidPackData {
  campaignStructure: CampaignStructure[]
  audiences: AudienceSegment[]
  copyVariants: {
    hooks: string[]
    headlines: string[]
    descriptions: string[]
  }
  creativeAngles: CreativeAngle[]
  budgetDistribution: BudgetPhase[]
  testPlan: TestPlan[]
  warnings: string[]
}

interface PaidPackProps {
  data: PaidPackData | null
  isLoading: boolean
  language: 'es' | 'en'
  onRegenerate?: () => void
}

export function PaidPack({ data, isLoading, language, onRegenerate }: PaidPackProps) {
  const [activeTab, setActiveTab] = useState('structure')

  const handleCopy = () => {
    if (!data) return
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(text)
    toast.success(language === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard')
  }

  const handleExport = (format: 'pdf' | 'html' | 'word' | 'json' | 'text') => {
    if (!data) return
    try {
      exportSection({
        sectionName: language === 'es' ? 'Paid Pack' : 'Paid Pack',
        sectionData: data,
        language,
        format
      })
      toast.success(language === 'es' ? 'Sección exportada exitosamente' : 'Section exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error(language === 'es' ? 'Error al exportar' : 'Export error')
    }
  }

  const getAngleColor = (angle: string) => {
    switch (angle) {
      case 'beneficio': return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'urgencia': return 'bg-red-500/10 text-red-700 dark:text-red-400'
      case 'autoridad': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'emocion': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
      case 'objeciones': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'bajo': return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'medio': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'alto': return 'bg-red-500/10 text-red-700 dark:text-red-400'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getAudienceTypeColor = (type: string) => {
    switch (type) {
      case 'cold': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'lookalike': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
      case 'retargeting': return 'bg-green-500/10 text-green-700 dark:text-green-400'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-panel p-6 border-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Target size={24} weight="fill" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {language === 'es' ? 'Paid Pack' : 'Paid Pack'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'es' 
                ? 'Generando estructura de campañas pagadas...' 
                : 'Generating paid campaigns structure...'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="glass-panel p-6 border-2 border-dashed">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted text-muted-foreground">
            <Target size={24} weight="fill" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {language === 'es' ? 'Paid Pack' : 'Paid Pack'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'es'
                ? 'Genera una campaña para ver el Paid Pack'
                : 'Generate a campaign to see the Paid Pack'}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass-panel p-6 border-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Target size={24} weight="fill" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {language === 'es' ? 'Paid Pack' : 'Paid Pack'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'es'
                ? 'Estructura completa de campañas pagadas'
                : 'Complete paid campaigns structure'}
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
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-9 px-3">
            <Copy size={18} className="mr-2" />
            {language === 'es' ? 'Copiar' : 'Copy'}
          </Button>
          <Button size="sm" variant="ghost" onClick={onRegenerate} className="h-9 px-3">
            <ArrowsClockwise size={18} className="mr-2" />
            {language === 'es' ? 'Regenerar' : 'Regenerate'}
          </Button>
        </div>
      </div>

      {data.warnings.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <WarningCircle size={20} weight="fill" className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                {language === 'es' ? 'Advertencias' : 'Warnings'}
              </p>
              <ul className="space-y-1">
                {data.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-400">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-panel mb-6 p-1 w-full grid grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="structure" className="text-xs">
            <Lightning size={14} className="mr-1" />
            {language === 'es' ? 'Estructura' : 'Structure'}
          </TabsTrigger>
          <TabsTrigger value="audiences" className="text-xs">
            <Users size={14} className="mr-1" />
            {language === 'es' ? 'Audiencias' : 'Audiences'}
          </TabsTrigger>
          <TabsTrigger value="copy" className="text-xs">
            <Copy size={14} className="mr-1" />
            {language === 'es' ? 'Copy' : 'Copy'}
          </TabsTrigger>
          <TabsTrigger value="angles" className="text-xs">
            <Target size={14} className="mr-1" />
            {language === 'es' ? 'Ángulos' : 'Angles'}
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs">
            <CurrencyEur size={14} className="mr-1" />
            {language === 'es' ? 'Presupuesto' : 'Budget'}
          </TabsTrigger>
          <TabsTrigger value="tests" className="text-xs">
            <Flask size={14} className="mr-1" />
            {language === 'es' ? 'Tests' : 'Tests'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightning size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? 'Estructura de Campañas/Adsets' : 'Campaign/Adset Structure'}
            </h4>
          </div>

          {data.campaignStructure.map((campaign, idx) => (
            <Card key={idx} className="p-4 bg-muted/30">
              <div className="mb-3">
                <Badge className="mb-2">{language === 'es' ? 'Objetivo' : 'Objective'}</Badge>
                <h5 className="text-base font-bold">{campaign.objective}</h5>
              </div>

              <div className="space-y-2">
                {campaign.adsets.map((adset, adsetIdx) => (
                  <div
                    key={adsetIdx}
                    className="p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'es' ? 'Nombre del Adset' : 'Adset Name'}
                        </p>
                        <p className="text-sm font-semibold">{adset.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'es' ? 'Audiencia' : 'Audience'}
                        </p>
                        <p className="text-sm">{adset.audience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'es' ? 'Estrategia de Puja' : 'Bid Strategy'}
                        </p>
                        <p className="text-sm">{adset.bidStrategy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'es' ? 'Presupuesto' : 'Budget'}
                        </p>
                        <p className="text-sm font-semibold text-primary">{adset.budget}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? 'Segmentos de Audiencia' : 'Audience Segments'}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.audiences.map((audience, idx) => (
              <Card key={idx} className="p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getAudienceTypeColor(audience.type)}>
                        {audience.type === 'cold' && (language === 'es' ? 'Audiencia Fría' : 'Cold Audience')}
                        {audience.type === 'lookalike' && 'Lookalike'}
                        {audience.type === 'retargeting' && 'Retargeting'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {audience.size}
                      </Badge>
                    </div>
                    <h5 className="text-base font-bold mb-1">{audience.name}</h5>
                    <p className="text-sm text-muted-foreground mb-3">{audience.description}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    {language === 'es' ? 'Criterios de Segmentación' : 'Targeting Criteria'}
                  </p>
                  <ul className="space-y-1">
                    {audience.criteria.map((criterion, criterionIdx) => (
                      <li key={criterionIdx} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={16} weight="fill" className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="copy" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Copy size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? 'Copy: Hooks, Headlines y Descripciones' : 'Copy: Hooks, Headlines & Descriptions'}
            </h4>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">10 Hooks</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{language === 'es' ? 'Hook' : 'Hook'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.copyVariants.hooks.map((hook, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="font-medium">{hook}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">10 Headlines</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{language === 'es' ? 'Headline' : 'Headline'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.copyVariants.headlines.map((headline, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="font-medium">{headline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">5 {language === 'es' ? 'Descripciones' : 'Descriptions'}</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>{language === 'es' ? 'Descripción' : 'Description'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.copyVariants.descriptions.map((description, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell>{description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="angles" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? '5 Ángulos Creativos' : '5 Creative Angles'}
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.creativeAngles.map((angle, idx) => (
              <Card key={idx} className="p-4 bg-muted/30">
                <div className="flex items-start gap-3 mb-3">
                  <Badge className={getAngleColor(angle.angle)}>
                    {angle.angle === 'beneficio' && (language === 'es' ? 'Beneficio' : 'Benefit')}
                    {angle.angle === 'urgencia' && (language === 'es' ? 'Urgencia' : 'Urgency')}
                    {angle.angle === 'autoridad' && (language === 'es' ? 'Autoridad' : 'Authority')}
                    {angle.angle === 'emocion' && (language === 'es' ? 'Emoción' : 'Emotion')}
                    {angle.angle === 'objeciones' && (language === 'es' ? 'Objeciones' : 'Objections')}
                  </Badge>
                </div>

                <p className="text-sm mb-3">{angle.description}</p>

                <div className="mb-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    {language === 'es' ? 'Cuándo usar' : 'When to use'}
                  </p>
                  <p className="text-sm">{angle.whenToUse}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    {language === 'es' ? 'Ejemplos' : 'Examples'}
                  </p>
                  <ul className="space-y-1">
                    {angle.examples.map((example, exampleIdx) => (
                      <li key={exampleIdx} className="text-sm pl-3 border-l-2 border-primary/30">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CurrencyEur size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? 'Distribución de Presupuesto por Fase' : 'Budget Distribution by Phase'}
            </h4>
          </div>

          <div className="space-y-4">
            {data.budgetDistribution.map((phase, idx) => (
              <Card key={idx} className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-base font-bold">{phase.phase}</h5>
                  <Badge className="text-base px-3 py-1">
                    {phase.percentage}%
                  </Badge>
                </div>

                <div className="mb-3">
                  <Progress value={phase.percentage} className="h-3" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {language === 'es' ? 'Asignación' : 'Allocation'}
                    </p>
                    <p className="text-sm font-semibold text-primary">{phase.allocation}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {language === 'es' ? 'Razonamiento' : 'Reasoning'}
                    </p>
                    <p className="text-sm">{phase.reasoning}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Flask size={20} weight="fill" className="text-primary" />
            <h4 className="text-lg font-bold">
              {language === 'es' ? 'Plan de Tests Iniciales' : 'Initial Testing Plan'}
            </h4>
          </div>

          <div className="space-y-4">
            {data.testPlan.map((test, idx) => (
              <Card key={idx} className="p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm px-2 py-1">
                      {language === 'es' ? 'Prioridad' : 'Priority'} #{test.priority}
                    </Badge>
                    <h5 className="text-base font-bold">{test.testName}</h5>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                      {language === 'es' ? 'Hipótesis' : 'Hypothesis'}
                    </p>
                    <p className="text-sm">{test.hypothesis}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        {language === 'es' ? 'Variantes a Testear' : 'Variants to Test'}
                      </p>
                      <ul className="space-y-1">
                        {test.variants.map((variant, variantIdx) => (
                          <li key={variantIdx} className="flex items-start gap-2 text-sm">
                            <TrendUp size={14} className="text-primary mt-0.5 flex-shrink-0" />
                            <span>{variant}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          {language === 'es' ? 'Métrica de Éxito' : 'Success Metric'}
                        </p>
                        <p className="text-sm font-semibold">{test.metric}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          {language === 'es' ? 'Duración' : 'Duration'}
                        </p>
                        <p className="text-sm font-semibold">{test.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                      {language === 'es' ? 'Por qué testear esto primero' : 'Why test this first'}
                    </p>
                    <p className="text-sm">{test.reasoning}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
