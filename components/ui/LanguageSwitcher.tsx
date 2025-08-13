'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { clsx } from 'clsx'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'el' as const, name: t('language_greek'), flag: '🇬🇷' },
    { code: 'en' as const, name: t('language_english'), flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-[1vh] lg:space-x-[0.5vw] px-[2vh] lg:px-[1vw] py-[1vh] lg:py-[0.5vw] bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg text-white hover:bg-slate-700/80 transition-all duration-300"
      >
        <Globe className="w-[2vh] h-[2vh] lg:w-[1vw] lg:h-[1vw] text-teal-400" />
        <span className="text-[1.6vh] lg:text-[0.8vw]">{currentLanguage?.flag}</span>
        {/* Show only first 2 letters of language on mobile, full name on desktop */}
        <span className="text-[1.4vh] lg:text-[0.7vw] font-medium">
          {/* <span className="lg:hidden">{currentLanguage?.name.slice(0, 2).toUpperCase()}</span> */}
          <span className="hidden lg:inline">{currentLanguage?.name}</span>
        </span>
        <svg
          className={clsx(
            'w-[1.5vh] h-[1.5vh] lg:w-[0.75vw] lg:h-[0.75vw] transition-transform duration-200',
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
          
          {/* Dropdown - positioned to align properly on mobile */}
          <div className="absolute top-full right-0 lg:left-0 mt-[0.5vh] lg:mt-[0.25vw] bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg shadow-xl z-50 min-w-[20vh] lg:min-w-[10vw]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={clsx(
                  'w-full flex items-center space-x-[1vh] lg:space-x-[0.5vw] px-[2vh] lg:px-[1vw] py-[1.5vh] lg:py-[0.75vw] text-left transition-all duration-200',
                  language === lang.code
                    ? 'bg-teal-500/20 text-teal-300 border-l-4 border-teal-400'
                    : 'text-gray-300 hover:bg-slate-700/80 hover:text-white'
                )}
              >
                <span className="text-[1.6vh] lg:text-[0.8vw]">{lang.flag}</span>
                <span className="text-[1.4vh] lg:text-[0.7vw] font-medium">{lang.name}</span>
                {language === lang.code && (
                  <div className="w-[1vh] h-[1vh] lg:w-[0.5vw] lg:h-[0.5vw] bg-teal-400 rounded-full ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}