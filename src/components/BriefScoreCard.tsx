import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface CampaignBriefData {
  objective?: string;
  kpi?: string;
  segments?: string;
  pains?: string;
  objections?: string;
  buyingContext?: string;
  product?: string;
  price?: string;
  promo?: string;
  guarantee?: string;
  usp?: string;
  channels?: string[];
  budget?: string;
  timing?: string;
  geography?: string;
  language?: string;
  tone?: string;
  brandVoice?: string;
  forbiddenWords?: string;
  allowedClaims?: string;
  legalRequirements?: string;
  availableAssets?: string;
  links?: string;
  audience?: string;
  goals?: string;
  mainPromise?: string;
  proof?: string[];
  competitors?: string[];
  timeline?: string;
  margin?: string;
}

interface BriefScoreCardProps {
  formData: Partial<CampaignBriefData>;
  language: 'es' | 'en';
}

interface ScoreItem {
  label: string;
  value: number;
  met: boolean;
  recommendation: string;
}

export function BriefScoreCard({ formData, language }: BriefScoreCardProps) {
  const t = (es: string, en: string) => language === 'es' ? es : en;

  const scoreItems: ScoreItem[] = [
    {
      label: t('Objetivo y KPI', 'Objective and KPI'),
      value: 15,
      met: Boolean(formData.objective && formData.kpi),
      recommendation: t(
        'Define un objetivo específico y un KPI medible (ej: "Generar 500 MQLs con CPL < €50")',
        'Define a specific objective and measurable KPI (e.g., "Generate 500 MQLs with CPL < €50")'
      )
    },
    {
      label: t('Producto y USP', 'Product and USP'),
      value: 15,
      met: Boolean(formData.product && formData.usp),
      recommendation: t(
        'Define qué hace única tu oferta. ¿Por qué elegirte sobre la competencia?',
        'Define what makes your offer unique. Why choose you over competitors?'
      )
    },
    {
      label: t('Audiencia y Segmentos', 'Audience and Segments'),
      value: 15,
      met: Boolean(formData.segments || formData.audience),
      recommendation: t(
        'Describe tu audiencia ideal con detalles demográficos, firmográficos y psicográficos.',
        'Describe your ideal audience with demographic, firmographic, and psychographic details.'
      )
    },
    {
      label: t('Pains y Objeciones', 'Pains and Objections'),
      value: 15,
      met: Boolean(formData.pains && formData.objections),
      recommendation: t(
        'Identifica los dolores principales y objeciones de tu audiencia para preparar tu mensaje.',
        'Identify main pains and objections of your audience to prepare your message.'
      )
    },
    {
      label: t('Canales y Presupuesto', 'Channels and Budget'),
      value: 15,
      met: Boolean(formData.channels && formData.channels.length > 0 && formData.budget),
      recommendation: t(
        'Selecciona canales de marketing y asigna un presupuesto total.',
        'Select marketing channels and assign a total budget.'
      )
    },
    {
      label: t('Timing y Geografía', 'Timing and Geography'),
      value: 10,
      met: Boolean(formData.timing && formData.geography),
      recommendation: t(
        'Especifica fechas de inicio/fin y geografía objetivo con idiomas relevantes.',
        'Specify start/end dates and target geography with relevant languages.'
      )
    },
    {
      label: t('Tono y Brand Voice', 'Tone and Brand Voice'),
      value: 10,
      met: Boolean(formData.tone && formData.brandVoice),
      recommendation: t(
        'Define el tono de comunicación y la voz de marca para mantener consistencia.',
        'Define communication tone and brand voice to maintain consistency.'
      )
    },
    {
      label: t('Contexto de Compra', 'Buying Context'),
      value: 5,
      met: Boolean(formData.buyingContext),
      recommendation: t(
        'Describe el ciclo de compra, tomadores de decisión y proceso típico.',
        'Describe the buying cycle, decision makers, and typical process.'
      )
    }
  ];

  const totalScore = scoreItems.reduce((sum, item) => sum + (item.met ? item.value : 0), 0);
  const missingItems = scoreItems.filter(item => !item.met);
  const recommendations = missingItems.map(item => item.recommendation);

  const getScoreColor = () => {
    if (totalScore >= 80) return "text-green-600";
    if (totalScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = () => {
    if (totalScore >= 80) {
      return {
        text: t('Listo para generar', 'Ready to generate'),
        color: 'text-green-600',
        borderColor: 'border-green-500'
      };
    }
    if (totalScore >= 50) {
      return {
        text: t('Casi listo', 'Almost ready'),
        color: 'text-yellow-600',
        borderColor: 'border-yellow-500'
      };
    }
    return {
      text: t(`Necesita completar ${missingItems.length} campos`, `Need to complete ${missingItems.length} fields`),
      color: 'text-red-600',
      borderColor: 'border-red-500'
    };
  };

  const status = getScoreStatus();

  return (
    <Card className="p-6 space-y-6 glass-panel">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Brief Score</h3>
          <span className={`text-3xl font-bold ${getScoreColor()}`}>
            {totalScore}
          </span>
        </div>
        
        <Progress value={totalScore} className="h-3" />
        
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
