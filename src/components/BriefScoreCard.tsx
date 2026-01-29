import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface BriefScoreCardProps {
  score: number;
  missing?: string[];
  recommendations?: string[];
  statusText?: string;
}

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

interface BriefScoreCardPropsWithFormData {
  formData: CampaignBriefData;
  language: 'es' | 'en';
}

function calculateScore(formData: CampaignBriefData, language: 'es' | 'en') {
  const t = (es: string, en: string) => language === 'es' ? es : en;

  const criteria = [
    {
      value: 20,
      label: t('Objetivo y KPIs', 'Objective and KPIs'),
      met: Boolean(formData.objective && formData.kpi),
      recommendation: t(
        'Define objetivos claros y métricas específicas para medir el éxito',
        'Define clear objectives and specific metrics to measure success'
      )
    },
    {
      value: 15,
      label: t('Producto y USP', 'Product and USP'),
      met: Boolean(formData.product && formData.usp),
      recommendation: t(
        'Define qué hace única tu oferta y por qué elegirte',
        'Define what makes your offer unique and why choose you'
      )
    },
    {
      value: 15,
      label: t('Audiencia y Dolores', 'Audience and Pain Points'),
      met: Boolean(formData.pains && formData.objections),
      recommendation: t(
        'Identifica los dolores específicos y objeciones de tu audiencia',
        'Identify specific pain points and objections of your audience'
      )
    },
    {
      value: 15,
      label: t('Canales y Presupuesto', 'Channels and Budget'),
      met: Boolean(formData.channels?.length && formData.budget),
      recommendation: t(
        'Selecciona los canales adecuados y asigna presupuesto',
        'Select appropriate channels and allocate budget'
      )
    },
    {
      value: 10,
      label: t('Timing y Geografía', 'Timing and Geography'),
      met: Boolean(formData.timing && formData.geography),
      recommendation: t(
        'Especifica cuándo y dónde se ejecutará la campaña',
        'Specify when and where the campaign will run'
      )
    },
    {
      value: 10,
      label: t('Tono y Voz de Marca', 'Tone and Brand Voice'),
      met: Boolean(formData.tone && formData.brandVoice),
      recommendation: t(
        'Define el tono de comunicación y voz de marca',
        'Define communication tone and brand voice'
      )
    },
    {
      value: 10,
      label: t('Contexto de Compra', 'Buying Context'),
      met: Boolean(formData.buyingContext),
      recommendation: t(
        'Describe el ciclo de compra y contexto del cliente',
        'Describe the buying cycle and customer context'
      )
    },
    {
      value: 5,
      label: t('Segmentos', 'Segments'),
      met: Boolean(formData.segments),
      recommendation: t(
        'Define los segmentos específicos de audiencia',
        'Define specific audience segments'
      )
    }
  ];

  const totalScore = criteria.reduce((sum, item) => sum + (item.met ? item.value : 0), 0);
  const missingItems = criteria.filter(item => !item.met);
  const recommendations = missingItems.map(item => item.recommendation);

  return {
    score: totalScore,
    missing: missingItems.map(item => item.label),
    recommendations
  };
}

export default function BriefScoreCard(props: BriefScoreCardProps | BriefScoreCardPropsWithFormData) {
  let score: number;
  let missing: string[];
  let recommendations: string[];
  let statusText: string | undefined;

  if ('formData' in props) {
    const calculated = calculateScore(props.formData, props.language);
    score = calculated.score;
    missing = calculated.missing;
    recommendations = calculated.recommendations;
  } else {
    score = props.score;
    missing = props.missing || [];
    recommendations = props.recommendations || [];
    statusText = props.statusText;
  }

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = () => {
    if (statusText) return statusText;
    if (score >= 80) return "Excelente - Brief completo";
    if (score >= 50) return "Casi listo - Completa algunos campos";
    return "Necesita más información";
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold">Brief Score</h3>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${getScoreColor()}`}>
            {score}
          </span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      <Alert>
        <AlertDescription>
          {getStatusText()}
        </AlertDescription>
      </Alert>

      {missing && missing.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Qué falta:</h4>
          <ul className="space-y-2">
            {missing.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Cómo mejorarlo:</h4>
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
