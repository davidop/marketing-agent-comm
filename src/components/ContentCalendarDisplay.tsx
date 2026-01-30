import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ContentCalendarItem } from '@/lib/types'

interface ContentCalendarDisplayProps {
  items: ContentCalendarItem[]
  language?: 'es' | 'en'
}

const CATEGORY_COLORS = {
  educacion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'prueba-social': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  venta: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  comunidad: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
}

const FUNNEL_COLORS = {
  awareness: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  consideration: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  conversion: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  retention: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
}

export function ContentCalendarDisplay({ items, language = 'es' }: ContentCalendarDisplayProps) {
  const isSpanish = language === 'es'

  const calculateMixHealth = () => {
    if (!items || items.length === 0) {
      return {
        educacion: 0,
        pruebaSocial: 0,
        venta: 0,
        comunidad: 0,
        isHealthy: false,
        warnings: []
      }
    }

    const total = items.length
    const counts = {
      educacion: items.filter(i => i.categoria === 'educacion').length,
      pruebaSocial: items.filter(i => i.categoria === 'prueba-social').length,
      venta: items.filter(i => i.categoria === 'venta').length,
      comunidad: items.filter(i => i.categoria === 'comunidad').length
    }

    const percentages = {
      educacion: (counts.educacion / total) * 100,
      pruebaSocial: (counts.pruebaSocial / total) * 100,
      venta: (counts.venta / total) * 100,
      comunidad: (counts.comunidad / total) * 100
    }

    const warnings: string[] = []
    let isHealthy = true

    if (percentages.venta > 40) {
      warnings.push(
        isSpanish
          ? '⚠️ Demasiado contenido de venta (>40%). Puede cansar a la audiencia.'
          : '⚠️ Too much sales content (>40%). May tire the audience.'
      )
      isHealthy = false
    }

    if (percentages.venta > 50) {
      warnings.push(
        isSpanish
          ? '🚨 CRÍTICO: Más del 50% es contenido de venta. Riesgo alto de fatiga y unfollow.'
          : '🚨 CRITICAL: Over 50% is sales content. High risk of fatigue and unfollow.'
      )
      isHealthy = false
    }

    if (percentages.educacion < 30) {
      warnings.push(
        isSpanish
          ? '⚠️ Poco contenido educativo (<30%). Añade más valor para construir confianza.'
          : '⚠️ Low educational content (<30%). Add more value to build trust.'
      )
      isHealthy = false
    }

    if (percentages.pruebaSocial < 10) {
      warnings.push(
        isSpanish
          ? '💡 Bajo en prueba social (<10%). Considera añadir testimonios o casos de éxito.'
          : '💡 Low on social proof (<10%). Consider adding testimonials or success cases.'
      )
      isHealthy = false
    }

    if (percentages.comunidad === 0) {
      warnings.push(
        isSpanish
          ? '💬 Sin contenido de comunidad. Añade piezas que generen conversación o engagement.'
          : '💬 No community content. Add pieces that generate conversation or engagement.'
      )
      isHealthy = false
    }

    const hasAllCategories = Object.values(counts).every(c => c > 0)
    if (!hasAllCategories) {
      warnings.push(
        isSpanish
          ? '📊 Falta diversidad: no todas las categorías están representadas.'
          : '📊 Lacks diversity: not all categories are represented.'
      )
      isHealthy = false
    }

    if (warnings.length === 0) {
      isHealthy = true
    }

    return {
      ...percentages,
      isHealthy,
      warnings
    }
  }

  const mixHealth = calculateMixHealth()

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, { es: string; en: string }> = {
      educacion: { es: 'Educación', en: 'Education' },
      'prueba-social': { es: 'Prueba Social', en: 'Social Proof' },
      venta: { es: 'Venta', en: 'Sales' },
      comunidad: { es: 'Comunidad', en: 'Community' }
    }
    return labels[cat]?.[language] || cat
  }

  const getFunnelLabel = (phase: string) => {
    const labels: Record<string, { es: string; en: string }> = {
      awareness: { es: 'Awareness', en: 'Awareness' },
      consideration: { es: 'Consideración', en: 'Consideration' },
      conversion: { es: 'Conversión', en: 'Conversion' },
      retention: { es: 'Retención', en: 'Retention' }
    }
    return labels[phase]?.[language] || phase
  }

  if (!items || items.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">
            {isSpanish ? 'Calendario de Contenido' : 'Content Calendar'}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {isSpanish
            ? 'Genera una campaña para ver el calendario de contenido.'
            : 'Generate a campaign to see the content calendar.'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">
            {isSpanish ? 'Mix Saludable de Contenido' : 'Healthy Content Mix'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'educacion', label: getCategoryLabel('educacion'), icon: '📚' },
            { key: 'pruebaSocial', label: getCategoryLabel('prueba-social'), icon: '⭐' },
            { key: 'venta', label: getCategoryLabel('venta'), icon: '💰' },
            { key: 'comunidad', label: getCategoryLabel('comunidad'), icon: '💬' }
          ].map(({ key, label, icon }) => {
            const value = mixHealth[key as keyof typeof mixHealth] as number
            return (
              <div key={key} className="text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {value.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
              </div>
            )
          })}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex gap-2 h-6 rounded-lg overflow-hidden">
            {[
              { key: 'educacion', color: 'bg-blue-500' },
              { key: 'pruebaSocial', color: 'bg-green-500' },
              { key: 'venta', color: 'bg-orange-500' },
              { key: 'comunidad', color: 'bg-purple-500' }
            ].map(({ key, color }) => {
              const value = mixHealth[key as keyof typeof mixHealth] as number
              if (value === 0) return null
              return (
                <div
                  key={key}
                  className={`${color} transition-all`}
                  style={{ width: `${value}%` }}
                  title={`${getCategoryLabel(key)}: ${value.toFixed(1)}%`}
                />
              )
            })}
          </div>
        </div>

        {mixHealth.isHealthy ? (
          <Alert className="border-green-500/50 bg-green-50 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              {isSpanish
                ? '✅ Mix saludable: buena distribución de contenido.'
                : '✅ Healthy mix: good content distribution.'}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-orange-700 dark:text-orange-300">
                  {isSpanish ? 'Mix desequilibrado:' : 'Unbalanced mix:'}
                </p>
                <ul className="space-y-1 text-sm text-orange-600 dark:text-orange-400">
                  {mixHealth.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">
            {isSpanish ? 'Calendario de Contenido' : 'Content Calendar'}
          </h3>
          <Badge variant="secondary" className="ml-auto">
            {items.length} {isSpanish ? 'piezas' : 'pieces'}
          </Badge>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 flex-shrink-0">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    {isSpanish ? 'Fecha' : 'Date'}
                  </div>
                  <div className="font-bold text-primary">{item.date}</div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="font-semibold">
                      {item.canal}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {item.formato}
                    </Badge>
                    <Badge className={FUNNEL_COLORS[item.funnelPhase]}>
                      {getFunnelLabel(item.funnelPhase)}
                    </Badge>
                    <Badge className={CATEGORY_COLORS[item.categoria]}>
                      {getCategoryLabel(item.categoria)}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        {isSpanish ? 'Objetivo:' : 'Objective:'}
                      </span>
                      <p className="mt-1">{item.objetivo}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        {isSpanish ? 'CTA:' : 'CTA:'}
                      </span>
                      <p className="mt-1 font-medium text-primary">{item.cta}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground text-sm">
                      {isSpanish ? 'Idea Visual:' : 'Visual Idea:'}
                    </span>
                    <p className="mt-1 text-sm italic">{item.ideaVisual}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground text-sm">
                      {isSpanish ? 'Copy Base:' : 'Base Copy:'}
                    </span>
                    <p className="mt-1 text-sm">{item.copyBase}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <span className="font-semibold text-muted-foreground">
                      {isSpanish ? 'KPI Sugerido:' : 'Suggested KPI:'}
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {item.kpiSugerido}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
