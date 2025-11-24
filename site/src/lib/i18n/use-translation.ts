'use client'

import { useState, useEffect, useCallback } from 'react'
import { Language, Translations } from './types'
import { locales, defaultLocale, getClientLocale, setClientLocale } from './'

export function useTranslation() {
  const [locale, setLocale] = useState<Language>(defaultLocale)
  const [translations, setTranslations] = useState<Translations>(locales[defaultLocale])

  useEffect(() => {
    const clientLocale = getClientLocale()
    setLocale(clientLocale)
    setTranslations(locales[clientLocale])
    setClientLocale(clientLocale)
  }, [])

  const changeLanguage = (newLocale: Language) => {
    console.log('Changing language from', locale, 'to', newLocale)
    setLocale(newLocale)
    setTranslations(locales[newLocale])
    setClientLocale(newLocale)
    
    // Dispatch custom event to trigger re-render
    console.log('Dispatching languageChange event for', newLocale)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { locale: newLocale } }))
  }

  const t = useCallback((key: string): string | string[] | any => {
    const keys = key.split('.')
    let value: any = translations
    
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
  }, [translations, locale])

  return {
    locale,
    translations,
    t,
    changeLanguage
  }
}