import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel border-2 p-6 space-y-6">
        <div className="text-center space-y-2">
          <Warning size={56} weight="duotone" className="mx-auto text-destructive opacity-80" />
          <h2 className="text-xl font-bold text-foreground">
            Algo no salió como esperábamos
          </h2>
          <p className="text-sm text-muted-foreground">
            Encontramos un error inesperado. Los detalles técnicos están abajo. 
            Si persiste, contacta al equipo de soporte.
          </p>
        </div>
        
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-destructive">
            Detalles del Error
          </h3>
          <pre className="text-xs text-foreground/80 bg-background/50 p-3 rounded border overflow-auto max-h-32 font-mono">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full glass-panel-hover font-bold"
          variant="outline"
        >
          <ArrowClockwise size={16} weight="bold" className="mr-2" />
          Intentar Nuevamente
        </Button>
      </Card>
    </div>
  );
}
