"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇨🇦' },
  { code: 'fr' as const, name: 'Français', flag: '🇨🇦' }
]

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage()

  const switchLanguage = (newLocale: 'en' | 'fr') => {
    console.log('Switching language to:', newLocale)
    setLocale(newLocale)
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={(e) => {
              e.preventDefault()
              console.log('Dropdown item clicked:', language.code)
              switchLanguage(language.code)
            }}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {locale === language.code && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LanguageSwitcherCompact() {
  const { locale, setLocale } = useLanguage()

  const switchLanguage = (newLocale: 'en' | 'fr') => {
    setLocale(newLocale)
  }

  const otherLocale = locale === 'en' ? 'fr' : 'en'
  const otherLanguage = languages.find(lang => lang.code === otherLocale)

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => switchLanguage(otherLocale)}
      className="text-xs"
    >
      {otherLanguage?.name}
    </Button>
  )
}
