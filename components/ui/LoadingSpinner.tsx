'use client'

import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={clsx('flex flex-col items-center space-y-2', className)}>
      <div 
        className={clsx(
          'animate-spin rounded-full border-4 border-teal-500 border-t-transparent',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className={clsx('text-white', textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  )
}