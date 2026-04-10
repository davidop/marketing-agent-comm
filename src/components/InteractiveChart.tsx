import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowsOut, ArrowsIn, ArrowClockwise, DownloadSimple, Funnel } from '@phosphor-icons/react'

interface InteractiveChartProps {
  title?: string
  data: any[]
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
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)

  const zoomedData = useMemo(() => {
    const percentage = zoomLevel / 100
    const itemCount = Math.max(1, Math.floor(data.length * percentage))
    return data.slice(0, itemCount)
  }, [data, zoomLevel])

  const filteredData = useMemo(() => {
    if (!enableFilter || selectedCategories.length === 0) {
      return zoomedData
    }
    return zoomedData.filter(item => 
      selectedCategories.includes(item.category)
    )
  }, [zoomedData, selectedCategories, enableFilter])

  const chartHeight = 400

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(100, prev + 10))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(50, prev - 10))
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSelectAll = () => {
    setSelectedCategories(categories)
  }

  const handleDeselectAll = () => {
    setSelectedCategories([])
  }

  const exportChartData = () => {
    const csvContent = [
      [xAxisKey, ...yAxisKeys].join(','),
      ...filteredData.map(item => {
        return [item[xAxisKey], ...yAxisKeys.map(key => item[key])].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `chart-data-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(isSpanish ? 'Datos exportados' : 'Data exported')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <p className="text-xs text-muted-foreground">
            {isSpanish
              ? `${filteredData.length} registros mostrados`
              : `${filteredData.length} records shown`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enableZoom && (
            <>
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
                onClick={handleZoomIn}
                disabled={zoomLevel >= 100}
              >
                <ArrowsOut />
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
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                angle={-45}
                textAnchor="end"
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
            </BarChart>
          ) : (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={xAxisKey}
                angle={-45}
                textAnchor="end"
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
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
