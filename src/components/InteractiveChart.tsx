import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowsOut, ArrowsIn, ArrowClockwise, DownloadSimple, Funnel } from '@phosphor-icons/react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

interface InteractiveChartProps {
  title?: string
  data: any[]
  colors?: string[]
  type?: 'bar' | 'line'
  xAxisKey?: string
  yAxisKeys?: string[]
  categories?: string[]
  enableZoom?: boolean
  enableFilter?: boolean
  isSpanish?: boolean
}

export function InteractiveChart({
  title,
  data,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
  type = 'bar',
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  categories = [],
  enableZoom = true,
  enableFilter = false,
  isSpanish = false
}: InteractiveChartProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)

  const zoomedData = useMemo(() => {
    const percentage = zoomLevel / 100
    const itemsToShow = Math.max(3, Math.floor(data.length * percentage))
    return data.slice(0, itemsToShow)
  }, [data, zoomLevel])

  const filteredData = useMemo(() => {
    if (!enableFilter || selectedCategories.length === 0) {
      return zoomedData
    }
    return zoomedData.filter(item => 
      selectedCategories.some(cat => item.category === cat || selectedCategories.includes(item[xAxisKey]))
    )
  }, [zoomedData, selectedCategories, enableFilter, xAxisKey])

  const chartHeight = useMemo(() => {
    const baseHeight = 400
    const extraHeight = Math.max(0, (filteredData.length - 10) * 5)
    return Math.min(baseHeight + extraHeight, 800)
  }, [filteredData.length])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(100, prev + 10))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(30, prev - 10))
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
    const csv = [
      [xAxisKey, ...yAxisKeys].join(','),
      ...filteredData.map(item => 
        [item[xAxisKey], ...yAxisKeys.map(key => item[key])].join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `chart-data-${Date.now()}.csv`)
    link.click()
    URL.revokeObjectURL(url)
    toast.success(isSpanish ? 'Datos exportados' : 'Data exported')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <p className="text-xs text-muted-foreground">
            {filteredData.length} {isSpanish ? 'registros mostrados' : 'records shown'}
          </p>
        </div>

        <div className="flex gap-2">
          {enableZoom && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 30}
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
