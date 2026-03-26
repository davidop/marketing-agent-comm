import { useState, useCallback } from 'react'

export interface ValidationRule {
  test: (value: any) => boolean
  message: string
}

export interface FieldValidation {
  isValid: boolean
  error: string | null
  isValidating: boolean
}

export function useFieldValidation() {
  const [validations, setValidations] = useState<Record<string, FieldValidation>>({})

  const validateField = useCallback((
    fieldName: string,
    value: any,
    rules: ValidationRule[]
  ): FieldValidation => {
    for (const rule of rules) {
      if (!rule.test(value)) {
        const result = {
          isValid: false,
          error: rule.message,
          isValidating: false
        }
        setValidations(prev => ({ ...prev, [fieldName]: result }))
        return result
      }
    }

    const result = {
      isValid: true,
      error: null,
      isValidating: false
    }
    setValidations(prev => ({ ...prev, [fieldName]: result }))
    return result
  }, [])

  const clearValidation = useCallback((fieldName: string) => {
    setValidations(prev => {
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }, [])

  const getValidation = useCallback((fieldName: string): FieldValidation => {
    return validations[fieldName] || {
      isValid: true,
      error: null,
      isValidating: false
    }
  }, [validations])

  return {
    validateField,
    clearValidation,
    getValidation,
    validations
  }
}

export const commonRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value != null && value !== ''
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: any) => {
      if (typeof value === 'string') return value.length >= min
      if (Array.isArray(value)) return value.length >= min
      return true
    },
    message: message || `Must be at least ${min} characters`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: any) => {
      if (typeof value === 'string') return value.length <= max
      if (Array.isArray(value)) return value.length <= max
      return true
    },
    message: message || `Must be at most ${max} characters`
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value: any) => {
      if (typeof value !== 'string') return true
      return regex.test(value)
    },
    message
  }),

  email: (message = 'Invalid email address'): ValidationRule => ({
    test: (value: any) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message
  }),

  url: (message = 'Invalid URL'): ValidationRule => ({
    test: (value: any) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message
  }),

  custom: (test: (value: any) => boolean, message: string): ValidationRule => ({
    test,
    message
  })
}
