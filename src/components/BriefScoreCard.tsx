import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, Warning, CaretDown, CaretUp } from "@phosphor-icons/react";
import { formatBreakdownForDisplay, type BriefAnalysisResult } from "@/lib/briefAnalyzer";

interface BriefScoreCardProps {
  analysis: BriefAnalysisResult;
  onShowQuestions?: () => void;
  language?: 'es' | 'en';
}

export function BriefScoreCard({
  analysis,
  onShowQuestions,
  language = 'es',
}: BriefScoreCardProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [showRisks, setShowRisks] = React.useState(false);

  const safeScore = Math.max(0, Math.min(100, Number.isFinite(analysis.score) ? analysis.score : 0));
  const breakdownItems = formatBreakdownForDisplay(analysis.breakdown);
  
  const getScoreColor = () => {
    if (safeScore >= 80) return 'text-success';
    if (safeScore >= 60) return 'text-accent';
    return 'text-destructive';
  };

  const getStatusIcon = () => {
    if (analysis.status === 'ready') {
      return <CheckCircle size={20} weight="fill" className="text-success" />;
    }
    return <Warning size={20} weight="fill" className="text-destructive" />;
  };

  return (
    <Card className="p-4 space-y-4 glass-panel">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brief Score</h3>
        <span className={`text-2xl font-bold ${getScoreColor()}`}>
          {safeScore}/100
        </span>
      </div>

      <Progress value={safeScore} className="h-3" />

      <Alert className={analysis.status === 'ready' ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}>
        <div className="flex items-start gap-2">
          {getStatusIcon()}
          <AlertDescription className="text-sm flex-1">
            {analysis.statusText}
          </AlertDescription>
        </div>
      </Alert>

      {analysis.criticalQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-destructive">
              {language === 'es' 
                ? `${analysis.criticalQuestions.length} preguntas críticas pendientes` 
                : `${analysis.criticalQuestions.length} critical questions pending`}
            </p>
            <Badge variant="destructive">
              {analysis.criticalQuestions.filter(q => q.priority === 'critical').length} {language === 'es' ? 'críticas' : 'critical'}
            </Badge>
          </div>
          {onShowQuestions && (
            <Button 
              onClick={onShowQuestions} 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              {language === 'es' ? '📋 Responder preguntas' : '📋 Answer questions'}
            </Button>
          )}
        </div>
      )}

      <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="text-sm font-medium">
              {language === 'es' ? 'Ver desglose detallado' : 'View detailed breakdown'}
            </span>
            {showBreakdown ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {breakdownItems.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">
                  {item.score}/{item.max}
                </span>
              </div>
              <Progress value={item.percentage} className="h-1.5" />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {analysis.missing.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-destructive">
            {language === 'es' ? 'Qué falta' : 'What\'s missing'}
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
            {analysis.missing.slice(0, 5).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          {analysis.missing.length > 5 && (
            <p className="text-xs text-muted-foreground">
              {language === 'es' 
                ? `...y ${analysis.missing.length - 5} más` 
                : `...and ${analysis.missing.length - 5} more`}
            </p>
          )}
        </div>
      )}

      {analysis.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">
            {language === 'es' ? 'Cómo mejorarlo' : 'How to improve'}
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
            {analysis.recommendations.slice(0, 3).map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
          {analysis.recommendations.length > 3 && (
            <p className="text-xs text-muted-foreground">
              {language === 'es' 
                ? `...y ${analysis.recommendations.length - 3} más` 
                : `...and ${analysis.recommendations.length - 3} more`}
            </p>
          )}
        </div>
      )}

      {analysis.risks.length > 0 && (
        <Collapsible open={showRisks} onOpenChange={setShowRisks}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-destructive">
              <span className="text-sm font-medium">
                {language === 'es' 
                  ? `⚠️ ${analysis.risks.length} riesgos por falta de datos` 
                  : `⚠️ ${analysis.risks.length} risks due to missing data`}
              </span>
              {showRisks ? <CaretUp size={16} /> : <CaretDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              {analysis.risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}

export default BriefScoreCard;
