import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { ValidationRule } from '@/hooks/use-field-validation'

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  success?: boolean
  warning?: string | null
  helperText?: string
  onValidate?: (value: string) => void
  rules?: ValidationRule[]
  showValidation?: boolean
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    warning, 
    helperText, 
    className,
    onValidate,
    rules = [],
    showValidation = true,
    onChange,
    onBlur,
    ...props 
  }, ref) => {
    const [touched, setTouched] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched && rules.length > 0) {
        validateValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      if (rules.length > 0) {
        validateValue(e.target.value)
      }
      onBlur?.(e)
    }

    const validateValue = (value: string) => {
      for (const rule of rules) {
        if (!rule.test(value)) {
          setLocalError(rule.message)
          return
        }
      }
      setLocalError(null)
      onValidate?.(value)
    }

    const displayError = error || localError
    const showSuccess = success && !displayError && touched && showValidation

    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn(
              "text-xs uppercase font-bold tracking-wider",
              displayError && "text-destructive",
              showSuccess && "text-success"
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "glass-panel-hover border-2 rounded-xl transition-all duration-200 pr-10",
              displayError && "border-destructive focus-visible:ring-destructive",
              warning && !displayError && "border-warning focus-visible:ring-warning",
              showSuccess && "border-success focus-visible:ring-success",
              className
            )}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!displayError}
            aria-describedby={
              displayError ? `${props.id}-error` : 
              warning ? `${props.id}-warning` : 
              helperText ? `${props.id}-description` : 
              undefined
            }
            {...props}
          />
          
          {showValidation && touched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {displayError && (
                <XCircle size={20} weight="fill" className="text-destructive" />
              )}
              {warning && !displayError && (
                <Warning size={20} weight="fill" className="text-warning" />
              )}
              {showSuccess && (
                <CheckCircle size={20} weight="fill" className="text-success" />
              )}
            </div>
          )}
        </div>

        {displayError && (
          <p id={`${props.id}-error`} className="text-xs text-destructive flex items-center gap-1">
            <XCircle size={14} weight="fill" />
            {displayError}
          </p>
        )}
        
        {warning && !displayError && (
          <p id={`${props.id}-warning`} className="text-xs text-warning flex items-center gap-1">
            <Warning size={14} weight="fill" />
            {warning}
          </p>
        )}
        
        {helperText && !displayError && !warning && (
          <p id={`${props.id}-description`} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string | null
  success?: boolean
  warning?: string | null
  helperText?: string
  onValidate?: (value: string) => void
  rules?: ValidationRule[]
  showValidation?: boolean
}

export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ 
    label, 
    error, 
    success, 
    warning, 
    helperText, 
    className,
    onValidate,
    rules = [],
    showValidation = true,
    onChange,
    onBlur,
    ...props 
  }, ref) => {
    const [touched, setTouched] = useState(false)
    const [localError, setLocalError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (touched && rules.length > 0) {
        validateValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setTouched(true)
      if (rules.length > 0) {
        validateValue(e.target.value)
      }
      onBlur?.(e)
    }

    const validateValue = (value: string) => {
      for (const rule of rules) {
        if (!rule.test(value)) {
          setLocalError(rule.message)
          return
        }
      }
      setLocalError(null)
      onValidate?.(value)
    }

    const displayError = error || localError
    const showSuccess = success && !displayError && touched && showValidation

    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn(
              "text-xs uppercase font-bold tracking-wider",
              displayError && "text-destructive",
              showSuccess && "text-success"
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Textarea
            ref={ref}
            className={cn(
              "glass-panel-hover border-2 rounded-xl resize-none transition-all duration-200",
              displayError && "border-destructive focus-visible:ring-destructive",
              warning && !displayError && "border-warning focus-visible:ring-warning",
              showSuccess && "border-success focus-visible:ring-success",
              className
            )}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!displayError}
            aria-describedby={
              displayError ? `${props.id}-error` : 
              warning ? `${props.id}-warning` : 
              helperText ? `${props.id}-description` : 
              undefined
            }
            {...props}
          />
        </div>

        {displayError && (
          <p id={`${props.id}-error`} className="text-xs text-destructive flex items-center gap-1">
            <XCircle size={14} weight="fill" />
            {displayError}
          </p>
        )}
        
        {warning && !displayError && (
          <p id={`${props.id}-warning`} className="text-xs text-warning flex items-center gap-1">
            <Warning size={14} weight="fill" />
            {warning}
          </p>
        )}
        
        {helperText && !displayError && !warning && (
          <p id={`${props.id}-description`} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ValidatedTextarea.displayName = 'ValidatedTextarea'
