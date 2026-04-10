import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts'
import { MagnifyingGlassMinus, MagnifyingGlassPlus, ArrowsOut, Funnel, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ChartDataPoint {
  [key: string]: string | number
  category?: string
}

interface InteractiveChartProps {
  data: ChartDataPoint[]
  title: string
  type?: 'bar' | 'line'
  categories?: string[]
  language?: 'es' | 'en'
  enableZoom?: boolean
  enableFilter?: boolean
  xAxisKey?: string
  yAxisKeys?: string[]
  colors?: string[]
}

const DEFAULT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function InteractiveChart({
  data,
  title,
  type = 'bar',
  categories = [],
  language = 'es',
  enableZoom = true,
  enableFilter = true,
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  colors = DEFAULT_COLORS
}: InteractiveChartProps) {
  const isSpanish = language === 'es'
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [brushDomain, setBrushDomain] = useState<[number, number] | null>(null)
  const [chartType, setChartType] = useState<'bar' | 'line'>(type)

  const filteredData = useMemo(() => {
    if (!enableFilter || selectedCategories.length === 0) return data
    
    return data.filter(item => {
      if (!item.category) return true
      return selectedCategories.includes(item.category)
    })
  }, [data, selectedCategories, enableFilter])

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
    setSelectedCategories(categories)
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
          return typeof value === 'string' ? `"${value}"` : value
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
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {zoomedData.length} {isSpanish ? 'puntos de datos' : 'data points'}
            </Badge>
            {brushDomain && (
              <Badge variant="secondary">
                {isSpanish ? 'Vista con zoom activa' : 'Zoomed view active'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={chartType} onValueChange={(v: 'bar' | 'line') => setChartType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">{isSpanish ? 'Barras' : 'Bar'}</SelectItem>
              <SelectItem value="line">{isSpanish ? 'Línea' : 'Line'}</SelectItem>
            </SelectContent>
          </Select>

          {enableZoom && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                title={isSpanish ? 'Alejar' : 'Zoom out'}
              >
                <MagnifyingGlassMinus />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                title={isSpanish ? 'Acercar' : 'Zoom in'}
              >
                <MagnifyingGlassPlus />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetZoom}
                disabled={zoomLevel === 100 && !brushDomain}
                title={isSpanish ? 'Restablecer zoom' : 'Reset zoom'}
              >
                <ArrowsOut />
              </Button>
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={exportChartData}
            title={isSpanish ? 'Exportar datos' : 'Export data'}
          >
            <Download />
          </Button>
        </div>
      </div>

      {enableFilter && categories.length > 0 && (
        <div className="glass-panel p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <span className="text-sm font-semibold">
                {isSpanish ? 'Filtrar por categoría' : 'Filter by category'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSelectAll}
                className="h-7 text-xs"
              >
                {isSpanish ? 'Todas' : 'All'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeselectAll}
                className="h-7 text-xs"
              >
                {isSpanish ? 'Ninguna' : 'None'}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
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
