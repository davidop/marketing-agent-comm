import { Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

  currentStep: number
  completedSteps?
}
  onStepClick?: (stepIndex: number) => void
  completedSteps?: number[]
  className?: string
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [],
  className
}: ProgressStepperProps) {
  return (
    <div className={cn("flex items-start justify-between w-full gap-2", className)}>
      {steps.map((step, index) => {
        const current = index === currentStep
        const completed = completedSteps.includes(index) || index < currentStep
        const accessible = index <= currentStep || completedSteps.includes(index - 1)

        return (
          <div key={index} className="flex flex-col items-center flex-1 relative">
            {index > 0 && (
              <div
                className={cn(
                  "absolute left-0 top-5 h-0.5 -translate-y-1/2 transition-all duration-500",
                  completed || (current && completedSteps.includes(index - 1))
                    ? "bg-primary"
                    : "bg-border"
                <s
                style={{ width: '100%', transform: 'translateY(-50%)', left: '-50%', zIndex: 0 }}
              />
            )}

            <button
              onClick={() => accessible && onStepClick?.(index)}
              disabled={!accessible}
              className={cn(
                "relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-2",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                completed && "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary),0.5)]",
                current && !completed && "border-primary bg-background text-primary shadow-[0_0_16px_rgba(var(--primary),0.4)] scale-110",
                !current && !completed && accessible && "border-muted-foreground/30 bg-muted/50 text-muted-foreground hover:border-primary/50 hover:scale-105",
                !accessible && "border-border bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
              )}
            >
              {completed ? (
                <Check size={20} weight="bold" />
              ) : (
                <span className={cn(
                  "text-sm font-bold",
                  current && "text-primary"
                )}>
                  {index + 1}
                </span>
              )}
            </button>

            <span className={cn(
              "text-xs font-medium text-center transition-colors duration-300 max-w-[80px]",
              current && "text-primary font-bold",
              completed && "text-primary/80",
              !current && !completed && accessible && "text-foreground/60",
              !accessible && "text-muted-foreground/40"
            )}>
              {step}
            </span>
          </div>
        )
      })}
    </div>

}
