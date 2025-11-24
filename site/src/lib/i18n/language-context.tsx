'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, Translations } from './types'
import { locales, defaultLocale, getClientLocale, setClientLocale } from '.'

interface LanguageContextType {
  locale: Language
  translations: Translations
  t: (key: string) => string | string[] | any
  changeLanguage: (newLocale: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [state, setState] = useState({
    locale: defaultLocale,
    translations: locales[defaultLocale]
  })

  useEffect(() => {
    const clientLocale = getClientLocale()
    setState({
      locale: clientLocale,
      translations: locales[clientLocale]
    })
    setClientLocale(clientLocale)
  }, [])

  const changeLanguage = (newLocale: Language) => {
    console.log('Changing language to', newLocale)
    const newState = {
      locale: newLocale,
      translations: locales[newLocale]
    }
    setState(newState)
    setClientLocale(newLocale)
  }

  const t = (key: string): string | string[] | any => {
    const keys = key.split('.')
    let value: any = state.translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found in current locale
        value = locales.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }
    
    return value
  }

  const contextValue: LanguageContextType = {
    locale: state.locale,
    translations: state.translations,
    t,
    changeLanguage
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}