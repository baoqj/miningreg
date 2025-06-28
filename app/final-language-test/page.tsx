"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher"

export default function FinalLanguageTestPage() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🌍 Complete Language Switching Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Language Switchers</h2>
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Simple Button:</p>
                  <SimpleLanguageSwitcher />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Dropdown Menu:</p>
                  <LanguageSwitcher />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Direct Buttons:</p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={locale === 'en' ? 'default' : 'outline'}
                      onClick={() => setLocale('en')}
                    >
                      EN
                    </Button>
                    <Button 
                      size="sm" 
                      variant={locale === 'fr' ? 'default' : 'outline'}
                      onClick={() => setLocale('fr')}
                    >
                      FR
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Status:</h3>
              <p><strong>Active Language:</strong> {locale === 'en' ? 'English' : 'Français'} ({locale})</p>
              <p><strong>localStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('language') || 'null' : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Translation Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <strong>Welcome:</strong>
                <p>{t('dashboard.welcome', { name: 'John Doe' })}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Profile:</strong>
                <p>{t('navigation.profile')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Settings:</strong>
                <p>{t('navigation.settings')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Teams:</strong>
                <p>{t('navigation.teams')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Language:</strong>
                <p>{t('navigation.language')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Help & Support:</strong>
                <p>{t('navigation.helpSupport')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Quick Actions:</strong>
                <p>{t('dashboard.quickActions')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Legal Updates:</strong>
                <p>{t('dashboard.legalUpdates')}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <strong>Compliance Dashboard:</strong>
                <p>{t('navigation.complianceDashboard')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Test Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Language switchers are visible and functional</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Translations update immediately when language changes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Language preference is saved to localStorage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>All menu items and interface text are translated</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Language state is synchronized across all components</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Success Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-green-500 bg-green-50">
                <strong>✅ English to French:</strong> Click any language switcher and see all text change from English to French instantly.
              </div>
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <strong>🔄 French to English:</strong> Click again to switch back and see all text return to English.
              </div>
              <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                <strong>💾 Persistence:</strong> Refresh the page and see that your language choice is remembered.
              </div>
              <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                <strong>🔗 Navigation:</strong> Go to other pages (Profile, Teams) and see consistent language throughout.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
