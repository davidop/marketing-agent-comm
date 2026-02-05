import { Card } from '@/components/ui/card'
import { Crosshair, ChartBar, FileText, Target, Eye, Lightning } from '@phosphor-icons/react'

export function WarRoomCommandCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <Lightning size={64} weight="duotone" className="text-primary sparkle-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Strategy Hub
          </h3>
          <p className="text-sm text-muted-foreground">
            Análisis estratégico y planificación de campaña
          </p>
        </div>
      </Card>

      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <FileText size={64} weight="duotone" className="text-secondary sparkle-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
            Content Engine
          </h3>
          <p className="text-sm text-muted-foreground">
            Generación de contenido y copy optimizado
          </p>
        </div>
      </Card>

      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <ChartBar size={64} weight="duotone" className="text-accent sparkle-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            Analytics Center
          </h3>
          <p className="text-sm text-muted-foreground">
            Métricas y seguimiento de rendimiento
          </p>
        </div>
      </Card>

      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <Target size={64} weight="duotone" className="text-primary sparkle-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Audience Insights
          </h3>
          <p className="text-sm text-muted-foreground">
            Segmentación y análisis de audiencia
          </p>
        </div>
      </Card>

      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <Eye size={64} weight="duotone" className="text-secondary sparkle-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
            SEO & Visibility
          </h3>
          <p className="text-sm text-muted-foreground">
            Optimización y posicionamiento digital
          </p>
        </div>
      </Card>

      <Card className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4 border-2 marketing-shine">
        <Crosshair size={64} weight="duotone" className="text-accent float-animate" />
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
            Campaign Command
          </h3>
          <p className="text-sm text-muted-foreground">
            Centro de control de campañas activas
          </p>
        </div>
      </Card>
    </div>
  )
}
