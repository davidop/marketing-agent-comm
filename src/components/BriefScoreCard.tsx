import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface BriefScoreCardProps {
  score: number
  missing?: string[]
  recommendations?: string[]
  statusText?: string
}

export default function BriefScoreCard({
  score,
  missing = [],
  recommendations = [],
  statusText = "Listo para generar"
}: BriefScoreCardProps) {
  const safeScore = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0))

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brief Score</h3>
        <span className="text-sm font-medium">{safeScore}/100</span>
      </div>

      <Progress value={safeScore} />

      {missing.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-semibold">Qué falta</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {missing.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-semibold">Cómo mejorarlo</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {recommendations.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <Alert>
        <AlertDescription className="text-sm">{statusText}</AlertDescription>
      </Alert>
    </Card>
  )
}
