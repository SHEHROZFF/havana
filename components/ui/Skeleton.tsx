'use client'

import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: string
  height?: string
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({ 
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-slate-700/50'
  
  const variants = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-bounce',
    none: ''
  }

  const style = {
    ...(width && { width }),
    ...(height && { height })
  }

  return (
    <div 
      className={clsx(
        baseClasses,
        variants[variant],
        animations[animation],
        className
      )}
      style={style}
    />
  )
}

// Common skeleton components
export const SkeletonText = ({ lines = 1, className }: { lines?: number; className?: string }) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
)

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={clsx('p-4 space-y-3', className)}>
    <Skeleton variant="text" className="h-6 w-3/4" />
    <SkeletonText lines={2} />
    <Skeleton variant="rounded" className="h-32 w-full" />
  </div>
)

export const SkeletonButton = ({ className }: { className?: string }) => (
  <Skeleton 
    variant="rounded" 
    className={clsx('h-10 w-24', className)} 
  />
)

export const SkeletonAvatar = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }
  
  return (
    <Skeleton 
      variant="circular" 
      className={clsx(sizes[size], className)} 
    />
  )
}