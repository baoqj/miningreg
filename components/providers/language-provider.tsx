"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Import translation files
import enMessages from '@/messages/en.json'
import frMessages from '@/messages/fr.json'

type Locale = 'en' | 'fr'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, any>) => string
  messages: Record<string, any>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const messages = {
  en: enMessages,
  fr: frMessages
}

// Helper function to get nested object value by dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Helper function to replace placeholders in text
function replacePlaceholders(text: string, params?: Record<string, any>): string {
  if (!params) return text
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [locale, setLocaleState] = useState<Locale>('en')
  const [renderKey, setRenderKey] = useState(0)

  // Initialize locale from user settings or localStorage
  useEffect(() => {
    const initializeLocale = () => {
      // First priority: user's saved language preference
      if (session?.user?.language && (session.user.language === 'en' || session.user.language === 'fr')) {
        setLocaleState(session.user.language as Locale)
        return
      }

      // Second priority: localStorage
      const savedLocale = localStorage.getItem('language') as Locale
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
        setLocaleState(savedLocale)
        return
      }

      // Third priority: browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('fr')) {
        setLocaleState('fr')
      } else {
        setLocaleState('en')
      }
    }

    // Only initialize if we haven't already set a locale or if session changed
    initializeLocale()
  }, [session])

  const setLocale = async (newLocale: Locale) => {
    console.log('LanguageProvider: Setting locale to', newLocale)
    setLocaleState(newLocale)
    setRenderKey(prev => prev + 1) // Force re-render

    // Save to localStorage
    localStorage.setItem('language', newLocale)
    console.log('LanguageProvider: Saved to localStorage')

    // Save to user profile if logged in
    if (session?.user) {
      try {
        console.log('LanguageProvider: Saving to user profile')
        const response = await fetch('/api/user/language', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: newLocale }),
        })
        console.log('LanguageProvider: API response status', response.status)
      } catch (error) {
        console.error('Failed to save language preference:', error)
      }
    }
  }

  const t = (key: string, params?: Record<string, any>): string => {
    const value = getNestedValue(messages[locale], key)
    
    if (value === undefined) {
      // Fallback to English if key not found in current locale
      const fallbackValue = getNestedValue(messages.en, key)
      if (fallbackValue === undefined) {
        console.warn(`Translation key "${key}" not found`)
        return key
      }
      return replacePlaceholders(fallbackValue, params)
    }
    
    return replacePlaceholders(value, params)
  }

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    messages: messages[locale]
  }

  return (
    <LanguageContext.Provider value={value} key={renderKey}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Convenience hook for just the translation function
export function useTranslations(namespace?: string) {
  const { t } = useLanguage()
  
  if (namespace) {
    return (key: string, params?: Record<string, any>) => t(`${namespace}.${key}`, params)
  }
  
  return t
}
