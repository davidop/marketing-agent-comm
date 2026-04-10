import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts'
import { ArrowsOut, ArrowsIn, ArrowClockwise, DownloadSimple, Funnel } from '@phosphor-icons/react'

interface ChartDataPoint {
  [key: string]: string | number
}

interface InteractiveChartProps {
  title: string
  data: ChartDataPoint[]
  type?: 'bar' | 'line'
  xAxisKey?: string
  yAxisKeys?: string[]
  colors?: string[]
  categories?: string[]
  enableZoom?: boolean
  enableFilter?: boolean
  language?: 'es' | 'en'
}

const DEFAULT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function InteractiveChart({
  title,
  data,
  type = 'bar',
  xAxisKey = 'name',
  yAxisKeys = [],
  colors = DEFAULT_COLORS,
  categories = [],
  enableZoom = false,
  enableFilter = false,
  language = 'es'
}: InteractiveChartProps) {
  const isSpanish = language === 'es'
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
  const [brushDomain, setBrushDomain] = useState<[number, number] | null>(null)
  const [zoomLevel, setZoomLevel] = useState(100)

  const filteredData = useMemo(() => {
    if (!enableFilter || categories.length === 0) return data
    return data.filter((item) => {
      const categoryValue = String(item.category || '')
      return selectedCategories.includes(categoryValue)
    })
  }, [data, selectedCategories, enableFilter, categories])

  const zoomedData = useMemo(() => {
    if (!brushDomain) return filteredData
    const [startIndex, endIndex] = brushDomain
    return filteredData.slice(startIndex, endIndex + 1)
  }, [filteredData, brushDomain])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 50))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
    setBrushDomain(null)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedCategories([...categories])
  }

  const handleDeselectAll = () => {
    setSelectedCategories([])
  }

  const exportChartData = () => {
    const headers = [xAxisKey, ...yAxisKeys]
    const csvContent = [
      headers.join(','),
      ...zoomedData.map(item => {
        return headers.map(header => {
          const value = item[header]
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        }).join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `chart-${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success(isSpanish ? 'Datos exportados' : 'Data exported')
  }

  const chartHeight = Math.floor((zoomLevel / 100) * 400)

  return (
    <Card className="glass-panel p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {isSpanish
              ? `${zoomedData.length} registros mostrados`
              : `${zoomedData.length} records shown`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enableZoom && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
              >
                <ArrowsOut />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
              >
                <ArrowsIn />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
              >
                <ArrowClockwise />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={exportChartData}
          >
            <DownloadSimple />
          </Button>
        </div>
      </div>

      {enableFilter && categories.length > 0 && (
        <div className="glass-panel p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Funnel size={16} weight="fill" />
              <span className="text-sm font-semibold">
                {isSpanish ? 'Filtrar por categoría' : 'Filter by category'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {isSpanish ? 'Todas' : 'All'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                className="text-xs"
              >
                {isSpanish ? 'Ninguna' : 'None'}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer>
          {type === 'bar' ? (
            <BarChart
              data={zoomedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxisKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
              {enableZoom && filteredData.length > 10 && (
                <Brush
                  dataKey={xAxisKey}
                  height={30}
                  stroke="#10b981"
                  onChange={(domain: any) => {
                    if (domain?.startIndex !== undefined && domain?.endIndex !== undefined) {
                      setBrushDomain([domain.startIndex, domain.endIndex])
                    }
                  }}
                />
              )}
            </BarChart>
          ) : (
            <LineChart
              data={zoomedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxisKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
              {enableZoom && filteredData.length > 10 && (
                <Brush
                  dataKey={xAxisKey}
                  height={30}
                  stroke="#10b981"
                  onChange={(domain: any) => {
                    if (domain?.startIndex !== undefined && domain?.endIndex !== undefined) {
                      setBrushDomain([domain.startIndex, domain.endIndex])
                    }
                  }}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {selectedCategories.length === 0 && categories.length > 0 && (
        <div className="glass-panel p-4 rounded-lg border-2 border-orange-500/50">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            {isSpanish
              ? '⚠️ No hay categorías seleccionadas. Selecciona al menos una categoría para ver los datos.'
              : '⚠️ No categories selected. Select at least one category to view data.'}
          </p>
        </div>
      )}
    </Card>
  )
}
