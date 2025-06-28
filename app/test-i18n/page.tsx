"use client"

import { useLanguage, useTranslations } from '@/components/providers/language-provider'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SimpleLanguageSwitcher } from '@/components/simple-language-switcher'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestI18nPage() {
  const { locale } = useLanguage()
  const t = useTranslations()
  const tAuth = useTranslations('auth.signin')
  const tNav = useTranslations('navigation')
  const tCommon = useTranslations('common')

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Internationalization Test</h1>
          <div className="flex items-center space-x-2">
            <SimpleLanguageSwitcher />
            <LanguageSwitcher />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Language: {locale}</CardTitle>
            <CardDescription>
              Testing translation functionality across different namespaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Common Translations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Loading:</strong> {tCommon('loading')}
                </div>
                <div>
                  <strong>Save:</strong> {tCommon('save')}
                </div>
                <div>
                  <strong>Cancel:</strong> {tCommon('cancel')}
                </div>
                <div>
                  <strong>Settings:</strong> {tCommon('settings')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Navigation Translations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Dashboard:</strong> {tNav('dashboard')}
                </div>
                <div>
                  <strong>Profile:</strong> {tNav('profile')}
                </div>
                <div>
                  <strong>Teams:</strong> {tNav('teams')}
                </div>
                <div>
                  <strong>Logout:</strong> {tNav('logout')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Auth Translations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Title:</strong> {tAuth('title')}
                </div>
                <div>
                  <strong>Welcome:</strong> {tAuth('welcome')}
                </div>
                <div>
                  <strong>Email:</strong> {tAuth('email')}
                </div>
                <div>
                  <strong>Password:</strong> {tAuth('password')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Parameterized Translation</h3>
              <div>
                <strong>Welcome Message:</strong> {t('dashboard.welcome', { name: 'John Doe' })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Language Information</h3>
              <div className="space-y-2">
                <div>
                  <strong>Current Language:</strong> {t('language.currentLanguage', { language: locale === 'en' ? 'English' : 'Français' })}
                </div>
                <div>
                  <strong>Switch to:</strong> {t('language.switchTo', { language: locale === 'en' ? 'Français' : 'English' })}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => window.location.href = '/'}>
                {tNav('dashboard')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
