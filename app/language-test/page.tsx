"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LanguageTestPage() {
  const { locale, setLocale, t } = useLanguage()

  const switchToEnglish = () => {
    console.log('Switching to English')
    setLocale('en')
  }

  const switchToFrench = () => {
    console.log('Switching to French')
    setLocale('fr')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Language Switching Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Current Language: {locale}</h2>
            <div className="flex space-x-4">
              <Button onClick={switchToEnglish} variant={locale === 'en' ? 'default' : 'outline'}>
                Switch to English
              </Button>
              <Button onClick={switchToFrench} variant={locale === 'fr' ? 'default' : 'outline'}>
                Switch to French
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Translation Tests:</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Welcome Message:</strong>
                <p>{t('dashboard.welcome', { name: 'John Doe' })}</p>
              </div>
              
              <div>
                <strong>Profile:</strong>
                <p>{t('navigation.profile')}</p>
              </div>
              
              <div>
                <strong>Settings:</strong>
                <p>{t('navigation.settings')}</p>
              </div>
              
              <div>
                <strong>Teams:</strong>
                <p>{t('navigation.teams')}</p>
              </div>
              
              <div>
                <strong>Language:</strong>
                <p>{t('navigation.language')}</p>
              </div>
              
              <div>
                <strong>Help & Support:</strong>
                <p>{t('navigation.helpSupport')}</p>
              </div>
              
              <div>
                <strong>Quick Actions:</strong>
                <p>{t('dashboard.quickActions')}</p>
              </div>
              
              <div>
                <strong>Legal Updates:</strong>
                <p>{t('dashboard.legalUpdates')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold mb-2">Debug Info:</h4>
            <p><strong>Current Locale:</strong> {locale}</p>
            <p><strong>localStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('language') || 'null' : 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
