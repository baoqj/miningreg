"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LanguageDebug() {
  const { locale, t, messages } = useLanguage()

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Language Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Current Locale:</strong> {locale}
        </div>
        <div>
          <strong>Welcome Message:</strong> {t('dashboard.welcome', { name: 'Test User' })}
        </div>
        <div>
          <strong>Quick Actions:</strong> {t('dashboard.quickActions')}
        </div>
        <div>
          <strong>Profile:</strong> {t('navigation.profile')}
        </div>
        <div>
          <strong>Messages Object Keys:</strong> {Object.keys(messages).slice(0, 5).join(', ')}...
        </div>
        <div>
          <strong>localStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('language') || 'null' : 'N/A'}
        </div>
      </CardContent>
    </Card>
  )
}
