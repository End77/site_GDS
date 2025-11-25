'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, ChevronDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/language-context'
import { localeConfigs, Language } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, changeLanguage, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentConfig = localeConfigs[locale]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">{currentConfig.flag}</span>
            <span className="hidden md:inline">{currentConfig.nativeName}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(localeConfigs).map(([code, config]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              changeLanguage(code as Language)
              setIsOpen(false)
            }}
            className={`flex items-center space-x-3 cursor-pointer ${
              locale === code ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-lg">{config.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{config.nativeName}</div>
              <div className="text-xs text-gray-500">{config.name}</div>
            </div>
            {locale === code && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}