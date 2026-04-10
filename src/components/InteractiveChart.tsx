import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowsOut, ArrowsIn, 
interface InteractiveChartProps {
import { ArrowsOut, ArrowsIn, ArrowClockwise, DownloadSimple, Funnel } from '@phosphor-icons/react'

interface InteractiveChartProps {
  title?: string
  colors?: st
  type?: 'bar' | 'line'
  xAxisKey?: string
  yAxisKeys?: string[]

  categories?: string[]
  enableZoom?: boolean
  enableFilter?: boolean
}: InteractiveChartProps
 

    const percentage = zoomLevel / 100


    if (
    }
      selectedC
  }, [zoomedData, se
  const chartHeig
  const handleZoomIn = () 
  }
  const handleZoomOut
  }
  const handleRes
  }
  const handleCategoryToggle = (categ
      prev.includes(category)
        : [...prev, category]

  const handleSelectAll = () => {
  }
  const handleDeselectAll = () => {
  }
  const exportChartData

        return [item[xAxisKey], ...yAx
    ].join('\n')
    const blob = new Bl
    c
    link.setAttribute('download', `ch
    link.click()
    U
    toast.success(isSpanish ? 'Datos exportados' : '

    <div className="space

          <p className="text-x
              ? `${filteredData.length} registros 
   

          {enableZoom && (
              <Button
   

                <ArrowsIn />
              <Button
   

                <ArrowsOut />
              <Button
                size="sm"
              >
              </Button>
     
   

            <DownloadSimple />
        </div>


            <div className="flex it
              <span className
   

                variant="ghost"
                onClick=
              >
              </Button>
                variant="ghost"
        
              >

          </div>
            {categories.map((category) =>
                key={category}
                siz
                className="text-xs"
                {category}
            ))}
        </div>


            <BarChart
   

          
                textAnchor="end
              />
             
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                }}
              <Legend wrapperStyle={{ paddingTop: '20px' }} 
                <Bar
              
              

            <LineChart
              margin={{ to
              
                dataK
                textAnchor="end"
              />
              <Tooltip
                disabled={zoomLevel <= 50}
              >
                <ArrowsIn />
              </Button>
              <Button
                variant="outline"
                size="sm"
                  dot={{ r: 4 }}
              ))}
          )}
      </div>
  )



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










































