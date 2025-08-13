'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Globe } from 'lucide-react'
import { useAdminI18n } from '../../lib/i18n/admin-context'

const languages = [
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const

export default function AdminLanguageSwitcher() {
  const { language, setLanguage } = useAdminI18n()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-lg text-white hover:bg-slate-600/50 transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-teal-400" />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage?.name}</span>
        <svg
          className={clsx(
            'w-3 h-3 transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl z-50 min-w-[140px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'el' | 'en')
                  setIsOpen(false)
                }}
                className={clsx(
                  'w-full flex items-center space-x-2 px-3 py-2 text-left transition-all duration-200',
                  language === lang.code
                    ? 'bg-teal-500/20 text-teal-300 border-l-4 border-teal-400'
                    : 'text-gray-300 hover:bg-slate-700/80 hover:text-white'
                )}
              >
                <span className="text-sm">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {language === lang.code && (
                  <div className="w-2 h-2 bg-teal-400 rounded-full ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}