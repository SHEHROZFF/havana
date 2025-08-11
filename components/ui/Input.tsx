'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[1.8vh] lg:text-[0.6vw] font-medium text-gray-300 mb-[1vh] lg:mb-[0.3vw]">
            {label}
            {props.required && <span className="text-red-400 ml-[0.5vh] lg:ml-[0.2vw]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-[2vh] lg:px-[0.7vw] py-[1.5vh] lg:py-[0.5vw] bg-slate-600 border border-slate-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 rounded-lg text-[2vh] lg:text-[0.7vw]',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-[1vh] lg:mt-[0.3vw] text-[1.6vh] lg:text-[0.5vw] text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-[1vh] lg:mt-[0.3vw] text-[1.6vh] lg:text-[0.5vw] text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input