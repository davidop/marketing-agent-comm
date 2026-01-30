import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  ListChecks, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  Target
} from 'lucide-react'
import type { ExecutionChecklistData, ExecutionChecklistTask } from '@/lib/types'
import { useState } from 'react'

interface ExecutionChecklistDisplayProps {
  data: ExecutionChecklistData
  language?: 'es' | 'en'
}

const translations = {
  es: {
    title: 'Checklist de Ejecución',
    totalTasks: 'Total de tareas',
    estimatedTime: 'Tiempo estimado total',
    criticalPath: 'Ruta crítica',
    teamAllocation: 'Asignación por equipo',
    taskCount: 'tareas',
    completed: 'completadas',
    effort: {
      S: 'Pequeño',
      M: 'Medio',
      L: 'Grande'
    },
    teams: {
      Marketing: 'Marketing',
      Diseño: 'Diseño',
      'Web/Dev': 'Web/Dev',
      Legal: 'Legal',
      Producto: 'Producto',
      Contenido: 'Contenido'
    },
    critical: 'Crítico',
    dependencies: 'Dependencias',
    deliverable: 'Entregable',
    notes: 'Notas',
    hours: 'horas'
  },
  en: {
    title: 'Execution Checklist',
    totalTasks: 'Total tasks',
    estimatedTime: 'Total estimated time',
    criticalPath: 'Critical path',
    teamAllocation: 'Team allocation',
    taskCount: 'tasks',
    completed: 'completed',
    effort: {
      S: 'Small',
      M: 'Medium',
      L: 'Large'
    },
    teams: {
      Marketing: 'Marketing',
      Diseño: 'Design',
      'Web/Dev': 'Web/Dev',
      Legal: 'Legal',
      Producto: 'Product',
      Contenido: 'Content'
    },
    critical: 'Critical',
    dependencies: 'Dependencies',
    deliverable: 'Deliverable',
    notes: 'Notes',
    hours: 'hours'
  }
}

const effortColors = {
  S: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  M: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  L: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const teamColors = {
  Marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Diseño: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  'Web/Dev': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Legal: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  Producto: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Contenido: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400'
}

export default function ExecutionChecklistDisplay({ 
  data, 
  language = 'es' 
}: ExecutionChecklistDisplayProps) {
  const t = translations[language]
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set())

  const handleToggleTask = (taskId: string) => {
    setCheckedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const completionPercentage = (checkedTasks.size / data.totalTasks) * 100

  return (
    <div className="space-y-6">
      <Card className="glass-panel p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ListChecks className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {checkedTasks.size} / {data.totalTasks} {t.taskCount} {t.completed}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {Math.round(completionPercentage)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.estimatedTime}: {data.estimatedTotalTime}
            </p>
          </div>
        </div>

        <Progress value={completionPercentage} className="h-3 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-2">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">{t.totalTasks}</h4>
            </div>
            <p className="text-2xl font-bold">{data.totalTasks}</p>
          </Card>

          <Card className="p-4 border-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">{t.estimatedTime}</h4>
            </div>
            <p className="text-2xl font-bold">{data.estimatedTotalTime}</p>
          </Card>

          <Card className="p-4 border-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <h4 className="font-semibold text-sm">{t.criticalPath}</h4>
            </div>
            <p className="text-2xl font-bold">{data.criticalPath.length}</p>
          </Card>
        </div>
      </Card>

      <Card className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">{t.teamAllocation}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.teamAllocation.map((team) => (
            <Card key={team.team} className="p-3 border-2">
              <Badge 
                className={`mb-2 ${teamColors[team.team as keyof typeof teamColors] || 'bg-gray-100 text-gray-800'}`}
              >
                {t.teams[team.team as keyof typeof t.teams] || team.team}
              </Badge>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{team.taskCount} {t.taskCount}</p>
                <p className="text-sm font-semibold">{team.estimatedHours}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {data.criticalPath.length > 0 && (
        <Card className="glass-panel p-6 border-2 border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-bold">{t.criticalPath}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.criticalPath.map((taskId, idx) => {
              const allTasks = data.phases.flatMap(p => p.tasks)
              const task = allTasks.find(t => t.id === taskId)
              
              return (
                <div key={taskId} className="flex items-center gap-2">
                  {idx > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
                  {task && (
                    <Badge variant="outline" className="border-destructive text-destructive">
                      {task.order}. {task.task.substring(0, 40)}...
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {data.phases.map((phase, phaseIdx) => (
          <Card key={phaseIdx} className="glass-panel p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{phase.phase}</h3>
              <p className="text-sm text-muted-foreground">{phase.description}</p>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-3">
              {phase.tasks
                .sort((a, b) => a.order - b.order)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isChecked={checkedTasks.has(task.id)}
                    onToggle={() => handleToggleTask(task.id)}
                    t={t}
                  />
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: ExecutionChecklistTask
  isChecked: boolean
  onToggle: () => void
  t: typeof translations.es
}

function TaskCard({ task, isChecked, onToggle, t }: TaskCardProps) {
  return (
    <Card 
      className={`p-4 border-2 transition-all ${
        isChecked 
          ? 'bg-success/5 border-success/30 opacity-60' 
          : task.critical 
            ? 'border-destructive/40 bg-destructive/5'
            : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isChecked}
          onCheckedChange={onToggle}
          className="mt-1"
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  #{task.order}
                </span>
                {task.critical && (
                  <Badge variant="destructive" className="text-xs">
                    {t.critical}
                  </Badge>
                )}
                {isChecked && (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                )}
              </div>
              <p className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                {task.task}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={effortColors[task.effort]}>
                {task.effort}
              </Badge>
              <Badge className={teamColors[task.responsible] || 'bg-gray-100 text-gray-800'}>
                {t.teams[task.responsible as keyof typeof t.teams] || task.responsible}
              </Badge>
            </div>
          </div>

          {task.estimatedHours && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedHours} {t.hours}</span>
            </div>
          )}

          {task.deliverable && (
            <div className="text-xs">
              <span className="font-semibold text-muted-foreground">{t.deliverable}:</span>{' '}
              <span className="text-foreground">{task.deliverable}</span>
            </div>
          )}

          {task.dependencies && task.dependencies.length > 0 && (
            <div className="text-xs">
              <span className="font-semibold text-muted-foreground">{t.dependencies}:</span>{' '}
              <span className="text-foreground">{task.dependencies.join(', ')}</span>
            </div>
          )}

          {task.notes && (
            <div className="text-xs bg-muted/30 p-2 rounded">
              <span className="font-semibold text-muted-foreground">{t.notes}:</span>{' '}
              <span className="text-muted-foreground italic">{task.notes}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
