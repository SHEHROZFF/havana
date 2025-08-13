'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

type Language = 'el' | 'en' // Greek (Ελληνικά) | English
type TranslationKey = keyof typeof translations.el

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Default to Greek as requested
  const [language, setLanguageState] = useState<Language>('el')

  useEffect(() => {
    // Check if language is stored in localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'el' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
    } else {
      // Default to Greek if no saved preference
      setLanguageState('el')
      localStorage.setItem('language', 'el')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const isRTL = false // Greek and English are both LTR

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}