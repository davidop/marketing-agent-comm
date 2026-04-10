import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
interface ChartDataPoint {
import { toast } from 'sonner'

  data: ChartDataPoint[]
  type?: 'bar' | 'line'
  data: ChartDataPoint[]
  type?: 'bar' | 'line'

}
c

  title,
  categories = [],
  enableZoom = 
  xAxisKey = 'name',
  colors = DEFAULT_COLO
  const isSpanish = lang
  const [selectedCateg
  const [brushDomain, se

    if (!enableFilter 
    return data.fil
 

  const zoomedData = useMemo(() => {

    return filteredData.slice(star

    setZ

    setZoomLevel(p

    setZoomLevel(100
  }
  const handleCatego
      if (prev.includes(
      } else {
      }
  }
  
  }
  const handleDeselectAll = () => {
  }
  const exportChartData = () => {

      ...zoomedData.map(item => {
          const value = item[header]
    
    ].join('\n')
    const blob = new Blob([csvContent
    const url = URL.createObjectURL(blob)
    li
    link.style.visibility = 'hidden'

    document.body.removeChild(link)
    toast.success(isSpanish ? 'Datos expo


    return filteredData.slice(startIndex, endIndex + 1)
  }, [filteredData, brushDomain])

              {zoomedData.leng
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
                <ArrowsOut />
  }

  const handleDeselectAll = () => {
            onClick={exportCh
  }

  const exportChartData = () => {
      {enableFilter && categories.length > 0
          <div className
              <Funnel si
                {isSpanish ? 'Fil
            </div>
              <Button
                variant="ghost"
                clas
        
              <B

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
                height={100}
              />
              <Tooltip
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  bo
                }}
              <Legend wrapperStyle={{ pad
                <Bar
                  data
              
              {e
              

                    if (domain?.startIndex !== undefined &&
                    }
                />
            </BarChart>
            <LineChart
              margin={{ top
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                dataKey={xAxisKey}
                textAnchor="
                tic

                contentSty
                  border: '1px solid #e5e7eb',
                  pad
              />
              {yAxisKeys.map((key
                  key={key}
                  dataKey={key}
                  strokeWidth={2}
               
              ))}
                <Brush
                  hei
                  onChang
                      setBrushDom
                  }}
              )}
          )}
      </div>
      {selectedCategories.length === 0 
          <p className=
              ? '⚠️ N
          </p>
      )}
  )






















































                />



























                textAnchor="end"

                tick={{ fontSize: 12 }}
              />












                  key={key}
                  dataKey={key}

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
