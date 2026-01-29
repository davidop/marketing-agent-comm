import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, Question, Sparkle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { QuickQuestion } from '@/lib/briefGapDetector'

interface QuickQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (answers: Record<string, any>) => void
  questions: QuickQuestion[]
  language: 'es' | 'en'
}

export function QuickQuestionsModal({
  isOpen,
  onClose,
  onComplete,
  questions,
  language
}: QuickQuestionsModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0)
      setAnswers({})
      setSelectedOptions([])
    }
  }, [isOpen])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.field]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOptions([])
    } else {
      onComplete(answers)
      onClose()
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      const prevQuestion = questions[currentQuestionIndex - 1]
      if (prevQuestion.type === 'multiselect' && answers[prevQuestion.field]) {
        setSelectedOptions(answers[prevQuestion.field].split(', '))
      }
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOptions([])
    } else {
      onComplete(answers)
      onClose()
    }
  }

  const toggleOption = (value: string) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
      handleAnswer(newSelection.join(', '))
      return newSelection
    })
  }

  const canProceed = () => {
    if (!currentQuestion.required) return true
    const answer = answers[currentQuestion.field]
    if (!answer) return false
    if (typeof answer === 'string' && answer.trim().length === 0) return false
    return true
  }

  const renderQuestionInput = () => {
    const answer = answers[currentQuestion.field] || currentQuestion.defaultValue || ''

    switch (currentQuestion.type) {
      case 'textarea':
        return (
          <Textarea
            value={answer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={4}
            className="w-full text-base"
          />
        )

      case 'select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all',
                  'hover:border-primary/50 hover:bg-primary/5',
                  answer === option.value
                    ? 'border-primary bg-primary/10 font-medium'
                    : 'border-border'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {answer === option.value && (
                    <Check size={20} weight="bold" className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'multiselect':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map(option => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  'w-full p-4 text-left rounded-lg border-2 transition-all',
                  'hover:border-primary/50 hover:bg-primary/5',
                  selectedOptions.includes(option.value)
                    ? 'border-primary bg-primary/10 font-medium'
                    : 'border-border'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selectedOptions.includes(option.value) && (
                    <Check size={20} weight="bold" className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      default:
        return (
          <Input
            value={answer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full text-base"
          />
        )
    }
  }

  if (!currentQuestion || questions.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass-panel border-2">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Question size={24} weight="fill" className="text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {language === 'es' ? 'Preguntas Rápidas' : 'Quick Questions'}
              </DialogTitle>
              <DialogDescription>
                {language === 'es'
                  ? 'Completa estos detalles para una campaña más precisa'
                  : 'Complete these details for a more precise campaign'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} {language === 'es' ? 'de' : 'of'} {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 shrink-0">
                {currentQuestionIndex + 1}
              </Badge>
              <div className="flex-1 space-y-3">
                <Label className="text-lg font-semibold leading-tight">
                  {currentQuestion.question}
                </Label>
                {renderQuestionInput()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
            >
              {language === 'es' ? 'Anterior' : 'Back'}
            </Button>

            <div className="flex items-center gap-2">
              {!currentQuestion.required && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  {language === 'es' ? 'Omitir' : 'Skip'}
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="min-w-32"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    <Check size={18} weight="bold" className="mr-2" />
                    {language === 'es' ? 'Completar' : 'Complete'}
                  </>
                ) : (
                  <>
                    {language === 'es' ? 'Siguiente' : 'Next'}
                    <Sparkle size={18} weight="fill" className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
