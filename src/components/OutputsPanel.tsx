import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChartBar, Calendar, TrendUp, Sparkle } from '@phosphor-icons/react'
import { useTranslation, type Language } from '@/lib/i18n'

interface OutputsPanelProps {
  outputs: {
    strategy: string
    copyA: string
    copyB: string
    calendar: string
    kpis: string
  }
  isGenerating: boolean
  language: Language
}

export function OutputsPanel({ outputs, isGenerating, language }: OutputsPanelProps) {
  const t = useTranslation(language)
  
  return (
    <Card className="glass-panel p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-accent" />
          {t.outputs.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.outputs.subtitle}
        </p>
      </div>

      <Tabs defaultValue="strategy" className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-panel mb-4">
          <TabsTrigger value="strategy" className="text-xs">
            <ChartBar size={16} className="mr-1" />
            {t.outputs.strategy}
          </TabsTrigger>
          <TabsTrigger value="copy" className="text-xs">
            {t.outputs.copy}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs">
            <Calendar size={16} className="mr-1" />
            {t.outputs.calendar}
          </TabsTrigger>
          <TabsTrigger value="kpis" className="text-xs">
            <TrendUp size={16} className="mr-1" />
            {t.outputs.kpis}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="mt-0">
          <ScrollArea className="h-[600px] pr-4">
            {isGenerating && !outputs.strategy ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ) : outputs.strategy ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {outputs.strategy}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.outputs.strategyEmpty}</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="copy" className="mt-0">
          <ScrollArea className="h-[600px] pr-4">
            {isGenerating && !outputs.copyA ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Separator />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ) : outputs.copyA ? (
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-lg neon-border">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-3">
                    {t.outputs.versionA}
                  </h3>
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {outputs.copyA}
                  </div>
                </div>

                <Separator />

                <div className="glass-panel p-4 rounded-lg neon-border">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-accent mb-3">
                    {t.outputs.versionB}
                  </h3>
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {outputs.copyB}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkle size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.outputs.copyEmpty}</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <ScrollArea className="h-[600px] pr-4">
            {isGenerating && !outputs.calendar ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : outputs.calendar ? (
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {outputs.calendar}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.outputs.calendarEmpty}</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="kpis" className="mt-0">
          <ScrollArea className="h-[600px] pr-4">
            {isGenerating && !outputs.kpis ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : outputs.kpis ? (
              <div className="whitespace-pre-wrap text-foreground leading-relaxed mono">
                {outputs.kpis}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TrendUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.outputs.kpisEmpty}</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}