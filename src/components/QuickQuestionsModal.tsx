import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Question, Warning, CheckCircle } from '@phosphor-icons/react'
import type { CriticalQuestion } from '@/lib/briefAnalyzer'
import type { CampaignBriefData } from '@/lib/types'

interface QuickQuestionsModalProps {
  open: boolean
  onClose: () => void
  questions: CriticalQuestion[]
  onSubmit: (answers: Partial<CampaignBriefData>) => void
  language?: 'es' | 'en'
}

export function QuickQuestionsModal({
  open,
  onClose,
  questions,
  onSubmit,
  language = 'es',
}: QuickQuestionsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.fieldToUpdate]: value,
    }))
  }

  const handleNext = () => {
    if (isLast) {
      const briefUpdates: Partial<CampaignBriefData> = {}
      Object.entries(answers).forEach(([field, value]) => {
        briefUpdates[field as keyof CampaignBriefData] = value as any
      })
      onSubmit(briefUpdates)
      onClose()
      setCurrentIndex(0)
      setAnswers({})
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    if (isLast) {
      const briefUpdates: Partial<CampaignBriefData> = {}
      Object.entries(answers).forEach(([field, value]) => {
        briefUpdates[field as keyof CampaignBriefData] = value as any
      })
      onSubmit(briefUpdates)
      onClose()
      setCurrentIndex(0)
      setAnswers({})
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const getPriorityColor = (priority: CriticalQuestion['priority']) => {
    switch (priority) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
    }
  }

  const getPriorityLabel = (priority: CriticalQuestion['priority']) => {
    if (language === 'es') {
      switch (priority) {
        case 'critical':
          return 'Crítica'
        case 'high':
          return 'Alta'
        case 'medium':
          return 'Media'
      }
    } else {
      switch (priority) {
        case 'critical':
          return 'Critical'
        case 'high':
          return 'High'
        case 'medium':
          return 'Medium'
      }
    }
  }

  if (!currentQuestion) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="flex items-center gap-2">
              <Question size={24} weight="fill" className="text-primary" />
              {language === 'es' ? 'Preguntas de clarificación' : 'Clarification Questions'}
            </DialogTitle>
            <Badge variant={getPriorityColor(currentQuestion.priority)}>
              {getPriorityLabel(currentQuestion.priority)}
            </Badge>
          </div>
          <DialogDescription>
            {language === 'es'
              ? `Pregunta ${currentIndex + 1} de ${questions.length}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Alert>
            <Warning size={18} weight="fill" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">{currentQuestion.question}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    {language === 'es' ? 'Por qué es importante:' : 'Why it matters:'}
                  </span>{' '}
                  {currentQuestion.why}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    {language === 'es' ? 'Impacto:' : 'Impact:'}
                  </span>{' '}
                  {currentQuestion.impact}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label htmlFor="answer">
              {language === 'es' ? 'Tu respuesta' : 'Your answer'}
            </Label>
            {currentQuestion.suggestedAnswers && currentQuestion.suggestedAnswers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {language === 'es' ? 'Sugerencias (haz clic para seleccionar):' : 'Suggestions (click to select):'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.suggestedAnswers.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnswer(suggestion)}
                      className={
                        answers[currentQuestion.fieldToUpdate] === suggestion
                          ? 'border-primary bg-primary/10'
                          : ''
                      }
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Textarea
              id="answer"
              placeholder={
                language === 'es'
                  ? 'Escribe tu respuesta aquí o selecciona una sugerencia...'
                  : 'Write your answer here or select a suggestion...'
              }
              value={answers[currentQuestion.fieldToUpdate] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {answers[currentQuestion.fieldToUpdate] && (
            <Alert className="border-success bg-success/10">
              <CheckCircle size={18} weight="fill" className="text-success" />
              <AlertDescription className="text-success-foreground">
                {language === 'es' ? '¡Respuesta guardada!' : 'Answer saved!'}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {currentIndex > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1 sm:flex-none">
                {language === 'es' ? 'Anterior' : 'Back'}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 sm:flex-none"
            >
              {language === 'es' ? 'Saltar' : 'Skip'}
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!answers[currentQuestion.fieldToUpdate]}
            className="w-full sm:w-auto"
          >
            {isLast
              ? language === 'es'
                ? 'Finalizar'
                : 'Finish'
              : language === 'es'
                ? 'Siguiente'
                : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
