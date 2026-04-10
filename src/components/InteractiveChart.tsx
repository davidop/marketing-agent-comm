import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/but
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ZoomableGroup } from 'recharts'
import { MagnifyingGlassMinus, MagnifyingGlassPlus, ArrowsOut, Funnel, Download } from '@phosphor-icons/react'
  category?: string

}
  name: string
  data: ChartDa
  category?: string


 

  language = 'es',
  enableFilter = true,
  yAxisKeys = [
}: InteractiveChartProp
  
  const [zoomLevel, setZ
  const [chartType, se
  const filteredData = u
    
      if (!item.catego
    })


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
    
  }
    return filteredData.slice(startIndex, endIndex + 1)
  }, [filteredData, brushDomain])

        const value = item[hea
    setZoomLevel(prev => Math.min(prev + 20, 200))
   

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 50))
   

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
      
  }

  const handleSelectAll = () => {
              <SelectValue />
  }

  const handleDeselectAll = () => {
          </Select>
  }

  const exportChartData = () => {
            title={isSpanish ? 'Exportar datos' : 'Export data'}
    const csvRows = zoomedData.map(item => {
          </Button>
        const value = item[header]
        return typeof value === 'string' ? `"${value}"` : value
      }).join(',')
      

              <span className="text-sm font-semibold">
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

          
    <Card className="glass-panel p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
                />
              {enableZoom && filteredData.length > 10 &
                  dataKey={xAxisKey}
              
              

                />
            </BarChart>
            <LineChart
              margin={{ top: 
              <CartesianGrid
                dataKey={xA
                textAnchor="end"
                tick={{ fontSize: 12 }}
              <YAxis tick={{
                con

                 
              />
              {yAxisKey
                  key={key}
                  dataKey={key}
           
                  activeDot={{ r: 
              ))}
              
            

                      setBrushDomain([domain.star
                  }}
              )}
          )}
      </div>
      {selectedCategories.length === 0 && categories.l
          <p className="text-sm text-orange-600 dar
              ? '⚠️ N
          </p>
      )}
  )















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
