import { Language, LocaleConfig, Translations } from './types'
import { en } from './locales/en'
import { ru } from './locales/ru'
import { hy } from './locales/hy'

export const locales: Record<Language, Translations> = {
  en,
  ru,
  hy
}

export const localeConfigs: Record<Language, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr'
  },
  hy: {
    code: 'hy',
    name: 'Armenian',
    nativeName: 'Հայերեն',
    flag: '🇦🇲',
    dir: 'ltr'
  }
}

export const defaultLocale: Language = 'en'

export function getLocaleFromPathname(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean)
  const localeSegment = segments[0]
  
  if (localeSegment && Object.keys(localeConfigs).includes(localeSegment)) {
    return localeSegment as Language
  }
  
  return defaultLocale
}

export function createLocalizedPath(pathname: string, locale: Language): string {
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = getLocaleFromPathname(pathname)
  
  // Remove current locale from path if it exists
  if (segments[0] === currentLocale) {
    segments.shift()
  }
  
  // Add new locale to path
  if (locale !== defaultLocale) {
    segments.unshift(locale)
  }
  
  return '/' + segments.join('/')
}

export function getTranslation(key: string, locale: Language = defaultLocale): string {
  const keys = key.split('.')
  let value: any = locales[locale]
  
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
  
  return typeof value === 'string' ? value : key
}

export function getClientLocale(): Language {
  if (typeof window === 'undefined') return defaultLocale
  
  // Check localStorage first
  const stored = localStorage.getItem('locale') as Language
  if (stored && Object.keys(localeConfigs).includes(stored)) {
    return stored
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0] as Language
  if (Object.keys(localeConfigs).includes(browserLang)) {
    return browserLang
  }
  
  return defaultLocale
}

export function setClientLocale(locale: Language): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('locale', locale)
  
  // Update HTML lang attribute
  document.documentElement.lang = locale
  
  // Update HTML dir attribute if needed
  const config = localeConfigs[locale]
  document.documentElement.dir = config.dir
}