"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"

export function SimpleLanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en'
    console.log('SimpleLanguageSwitcher: Toggling from', locale, 'to', newLocale)
    setLocale(newLocale)
  }

  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline" 
      size="sm"
      className="text-xs"
    >
      {locale === 'en' ? 'Français' : 'English'}
    </Button>
  )
}
