import React from "react";
import { Card } from "@/components/ui/card";

  objective?: string;

  objections?: string;
  product?: strin
  promo?: string;
  usp?: string;
  budget?: string;
 

export function BriefScoreCard({ 
  score = 0, 
  missing = [], 
  recommendations = [],
  statusText = "En progreso"
}: BriefScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
  language: 'es' | 'en';

  la

}
export function BriefScoreCard({ formData, langua

    {
    

        'D
    },
      label: t('Producto y USP', 
      met: Boolean(formData.product && formData.usp),
        'Define qué hace única tu oferta. ¿Por qué elegirte 
      )
    {
      value: 15,
      recommen
        
    },
      la
      met: Boolean(formData.pains && formData.objecti
        'Identifica los dolo
      )
    {

      recommendation: 
        'Select
    },
      label: t('Timing y Geografía', 'Timing and Geography'),
      met: Boolean(formData.t
        'Especif
      )

      value: 10,
      recommendation: t(
        'Define communication tone and brand voice to maintain c
    },
      label: t(
      met: Boolean(formData.buyingCo
        'Describe el ciclo de compra, tom
      )
  ];
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

        color: 'text-green-600',
      };
    if (totalScore >= 50) {
        text: t('Casi listo
        borderC
    }
      text: t(`Necesita completar ${missingItems.
      borderColor: 'border-red-500'
  };
  const status = getScoreStatus();
  return (
      <div clas
          <h3 c
            {t
        
    </Card>
  );
}
        <p className={`text-sm font-medium ${status.color}`}>
          {status.text}
        </p>
      </div>

      {totalScore < 80 && (
        <Alert className={`border-2 ${status.borderColor}`}>
          <AlertDescription>
            {t(
              `El resultado será más genérico por falta de datos. Completa ${missingItems.length} campos más para mejores resultados.`,
              `The result will be more generic due to missing data. Complete ${missingItems.length} more fields for better results.`
            )}
          </AlertDescription>
        </Alert>
      )}

      {missingItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            {t('Qué falta:', 'What\'s missing:')}
          </h4>
          <ul className="space-y-2">
            {missingItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">•</span>
                <span className="text-muted-foreground">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            {t('Cómo mejorarlo:', 'How to improve:')}
          </h4>
          <ul className="space-y-2">
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">→</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
