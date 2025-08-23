'use client'

import { useEffect } from 'react'
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react'
import Button from './Button'
import { useAdminI18n } from '../../lib/i18n/admin-context'

interface AdminSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  autoCloseDelay?: number
}

export default function AdminSuccessModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  autoCloseDelay = 3000
}: AdminSuccessModalProps) {
  const { t } = useAdminI18n()

  // Auto-close functionality
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, autoCloseDelay])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />
      case 'error':
        return <X className="w-8 h-8 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />
      case 'info':
        return <Info className="w-8 h-8 text-blue-400" />
      default:
        return <CheckCircle className="w-8 h-8 text-green-400" />
    }
  }

  const getColorScheme = () => {
    switch (type) {
      case 'success':
        return {
          background: 'from-green-600/20 to-teal-600/20',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20'
        }
      case 'error':
        return {
          background: 'from-red-600/20 to-pink-600/20',
          border: 'border-red-500/30',
          iconBg: 'bg-red-500/20'
        }
      case 'warning':
        return {
          background: 'from-yellow-600/20 to-orange-600/20',
          border: 'border-yellow-500/30',
          iconBg: 'bg-yellow-500/20'
        }
      case 'info':
        return {
          background: 'from-blue-600/20 to-cyan-600/20',
          border: 'border-blue-500/30',
          iconBg: 'bg-blue-500/20'
        }
      default:
        return {
          background: 'from-green-600/20 to-teal-600/20',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20'
        }
    }
  }

  const colors = getColorScheme()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with animation */}
        <div className={`text-center py-6 px-6 bg-gradient-to-r ${colors.background} border-b border-slate-600/30`}>
          <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.iconBg} rounded-full mb-3 ${type === 'success' ? 'animate-pulse' : ''}`}>
            {getIcon()}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {title}
          </h2>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-300 text-sm text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action button */}
        <div className="px-6 pb-6">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
          >
            {t('close')}
          </Button>
        </div>

        {/* Auto-close indicator */}
        {autoCloseDelay > 0 && (
          <div className="px-6 pb-4">
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all ${
                  type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'warning' ? 'bg-yellow-500' : 
                  'bg-blue-500'
                }`}
                style={{
                  width: '100%',
                  animation: `shrink ${autoCloseDelay}ms linear`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Auto-closing in {Math.ceil(autoCloseDelay / 1000)} seconds
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}
