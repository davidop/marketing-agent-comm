import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

  missing?: string[];
  statusText?: s

  score,
  recommendations = []
}

export default function BriefScoreCard({
  score,
  missing = [],
  recommendations = [],
  statusText = "Listo para generar"
}: BriefScoreCardProps) {
  const safeScore = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0))

      <Pro
      {missing.length > 0 && (
          <p className="text-sm font-semibold">Qué falta<
            {missing.map((item, idx) => (
            ))}
        </di

        <div className="space-y-1">

              <li key={idx}>{t
          </ul>
      )}
      <Alert>
      </Alert>
  )
            ))}





        <div className="space-y-1">



              <li key={idx}>{tip}</li>

          </ul>

      )}



      </Alert>



