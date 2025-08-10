'use client'

import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg' | 'none'
}

export const Card = ({ className, padding = 'md', shadow = 'md', children, ...props }: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-2xl'
  }

  return (
    <div
      className={clsx(
        'bg-slate-700 border border-slate-600',
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div className={clsx('border-b border-slate-600 pb-4 mb-6', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = ({ className, as: Component = 'h3', children, ...props }: CardTitleProps) => {
  return (
    <Component 
      className={clsx('text-xl font-semibold text-white', className)} 
      {...props}
    >
      {children}
    </Component>
  )
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div className={clsx('border-t border-slate-600 pt-4 mt-6', className)} {...props}>
      {children}
    </div>
  )
}