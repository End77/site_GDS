'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, Language } from '@/lib/i18n';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-slate-300 text-slate-700 hover:bg-slate-50 min-w-[140px] justify-between h-10 px-3"
          style={{ minWidth: '140px', maxWidth: '140px' }}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {currentLanguage?.flag} {currentLanguage?.name}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px]"
        style={{ minWidth: '140px' }}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`flex items-center gap-2 cursor-pointer py-2 px-3 ${
              language === lang.code ? 'bg-slate-100' : ''
            }`}
          >
            <span className="text-base flex-shrink-0">{lang.flag}</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {lang.name}
            </span>
            {language === lang.code && (
              <span className="ml-auto text-blue-600 flex-shrink-0">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}