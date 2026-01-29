import React from "react";
import { Alert, AlertDescription } from "@/c
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface BriefScoreCardProps {
  statusText?: s
  missing?: string[];
  recommendations?: string[];
  statusText?: string;
 

  channels?: string[];
  timing?: string;

  brandVoice?: string;
  allowedClaims?: string;
  availableAssets?: string;
  audience?: string;
  ma

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
    {
          {getStatusText()}
      met: Boolean(formData
      </Alert>

      {missing && missing.length > 0 && (
    {
          <h4 className="text-sm font-semibold">Qué falta:</h4>
      met: Boolean(formData.pains &&
            {missing.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        'Selec
      )}

      {recommendations && recommendations.length > 0 && (
      met: Boolean(formData.timing 
          <h4 className="text-sm font-semibold">Cómo mejorarlo:</h4>
        'Specify when and where the 
            {recommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-0.5">→</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
        'Define
          </ul>
    {
      )}
      met: 
  );
 
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
