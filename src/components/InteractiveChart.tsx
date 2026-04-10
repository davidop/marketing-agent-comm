import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/but
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowsOut, ArrowsIn, ArrowClockwise, DownloadSimple, Funnel } from '@phosphor-icons/react'

interface InteractiveChartProps {
  yAxisKeys?: s
  data: any[]
  enableZoom?: boolean
  xAxisKey?: string
  yAxisKeys?: string[]
  colors?: string[]

  enableZoom?: boolean
  enableFilter?: boolean
  language?: 'es' | 'en'
 

const DEFAULT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function InteractiveChart({
  title,
  const
  type = 'bar',
  xAxisKey = 'name',
  yAxisKeys = [],
  colors = DEFAULT_COLORS,
  categories = [],
  }, [data, selectedC
  enableFilter = false,

    setZoomLevel(100)
  }
  const handleCategoryToggle = (category: string) => {
      prev.includes(category)
        : [...prev, category]

  const handleSelectAll = () => {
  }
  const handleDeselectAll = () => 
  }
  const exportChartData = () => {
    co
      ...zoomedData.map(item => {

        }).join(',')
    ].join('\n')
    const blob = new Blob([csvContent], { type
    const link = document.createElement('a')
    link.setAttribute('download',

  }
  return (
      <div classN

            {isSpanish
              : `${zoomedData.length} records shown`
   

            <>
                variant="outline"
   

              </Button>
                varia
                onClick=
   

                variant="outline"
                onClick={handleRese
                <ArrowClockwi
            </>
          <Button
     
   

      </div>
      {enableFilter && categories.length >
   

                {isSpanish ? 'Filtr
            </div>
   

                className="text-x
                {isSpanish ? 'Todas' : 'All'
              <Button
                size="sm
                className="text-x
                {isSpanish ? 'Ninguna'
            </div>
          <div className="flex flex-wrap gap-2">
              <Butto
        
                

              </Button>
          </div>
      )}
      <div style={{ width: '100%',
          {type === 'bar' ? (
              da
            >
              <XAxis
   

          
                contentStyle={{
                  border: '1px solid #e5e7eb',
             
              />
              {yAxisKeys.map((key, index) => (
                  key=
                  fill={colors[index % colors.length]}
                />
            </
            <L

              <CartesianGrid strokeDasharray="3 3
                dataKey={x
              
              />
              <Tooltip
                  backgro
                  borderRadius: '8px',
                }}
              <
                <Line
                  type=
                  str
                  dot={{ r: 4 }}
                />
            </LineChart>
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
                tick={{ fontSize: 12 }}

              <YAxis tick={{ fontSize: 12 }} />

                contentStyle={{


                  borderRadius: '8px',
                  padding: '8px 12px'
                }}

              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yAxisKeys.map((key, index) => (
                <Bar


                  fill={colors[index % colors.length]}












































