import { motion } from 'framer-motion'
import { Sparkle, Lightning, Rocket, Brain } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'default' | 'generation' | 'processing' | 'analysis'
  message?: string
  submessage?: string
  progress?: number
  className?: string
}

export function LoadingState({ 
  variant = 'default', 
  message,
  submessage,
  progress,
  className 
}: LoadingStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'generation':
        return <Sparkle size={48} weight="fill" className="text-primary" />
      case 'processing':
        return <Lightning size={48} weight="fill" className="text-accent" />
      case 'analysis':
        return <Brain size={48} weight="fill" className="text-secondary" />
      default:
        return <Rocket size={48} weight="fill" className="text-primary" />
    }
  }

  const getDefaultMessage = () => {
    switch (variant) {
      case 'generation':
        return 'Generating campaign...'
      case 'processing':
        return 'Processing...'
      case 'analysis':
        return 'Analyzing...'
      default:
        return 'Loading...'
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-6", className)}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {getIcon()}
        
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
          style={{
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      <div className="space-y-2 text-center max-w-md">
        <motion.h3
          className="text-lg font-semibold text-foreground"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message || getDefaultMessage()}
        </motion.h3>
        
        {submessage && (
          <p className="text-sm text-muted-foreground">
            {submessage}
          </p>
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full max-w-md space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
              initial={{ width: 0 }}
              animate={{ 
                width: `${progress}%`,
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{ 
                width: { duration: 0.5 },
                backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface SkeletonLoadingProps {
  rows?: number
  className?: string
}

export function SkeletonLoading({ rows = 3, className }: SkeletonLoadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <motion.div
            className="h-4 bg-muted rounded-md"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
          <motion.div
            className="h-3 bg-muted/70 rounded-md"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.2 }}
            style={{ width: `${Math.random() * 30 + 50}%` }}
          />
        </div>
      ))}
    </div>
  )
}

interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineLoader({ size = 'md', className }: InlineLoaderProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <motion.div
      className={cn("inline-block rounded-full border-2 border-primary border-t-transparent", sizeMap[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}
