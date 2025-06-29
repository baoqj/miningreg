"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Briefcase, Phone, Globe, Save, Camera, MapPin, Check, ArrowLeft, Scale, Shield, Bell } from "lucide-react"
import { useLanguage, useTranslations } from '@/components/providers/language-provider'
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const { locale, setLocale } = useLanguage()
  const t = useTranslations('profile')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    language: "en",
    timezone: "America/Toronto",
  })

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        title: "", // Will be loaded from API
        phone: "",
        language: "en",
        timezone: "America/Toronto",
      })
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
        // Update the session
        await update()
      } else {
        setMessage("Failed to update profile")
      }
    } catch (error) {
      setMessage("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Please sign in to view your profile.</p>
          <Button 
            onClick={() => router.push('/auth/signin')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Back Button and Title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Vertical Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-1">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                  <TabsTrigger 
                    value="general" 
                    className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 mr-3" />
                    {t('tabs.general')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-gray-50"
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    {t('tabs.security')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-gray-50"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    {t('tabs.notifications')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jurisdictions" 
                    className="w-full justify-start px-4 py-3 text-left data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 hover:bg-gray-50"
                  >
                    <MapPin className="h-4 w-4 mr-3" />
                    {t('tabs.jurisdictions')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs defaultValue="general" className="w-full">
              <TabsContent value="general">
                <GeneralTab
                  session={session}
                  locale={locale}
                  setLocale={setLocale}
                  t={t}
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  message={message}
                />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab locale={locale} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab locale={locale} />
              </TabsContent>

              <TabsContent value="jurisdictions">
                <JurisdictionPreferences locale={locale} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneralTab({ session, locale, setLocale, t, formData, setFormData, handleInputChange, handleSubmit, isLoading, message }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-white">
        <CardTitle className="text-xl text-gray-900">{t('general.title')}</CardTitle>
        <CardDescription className="text-gray-600">
          {t('general.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        {message && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* Profile Photo Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{session.user.name}</h3>
                <p className="text-gray-600">{session.user.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Camera className="h-4 w-4 mr-2" />
                  {locale === 'fr' ? 'Changer la photo' : 'Change Photo'}
                </Button>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Nom complet' : 'Full Name'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={locale === 'fr' ? 'Entrez votre nom complet' : 'Enter your full name'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Adresse e-mail' : 'Email Address'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={locale === 'fr' ? 'Entrez votre e-mail' : 'Enter your email'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Titre du poste' : 'Job Title'}
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={locale === 'fr' ? 'ex: Analyste juridique senior' : 'e.g., Senior Legal Analyst'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                {t('general.language')}
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="language"
                  name="language"
                  value={locale}
                  onChange={(e) => {
                    const newLocale = e.target.value as 'en' | 'fr'
                    setLocale(newLocale)
                    setFormData({ ...formData, language: newLocale })
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                {locale === 'fr' ? 'Fuseau horaire' : 'Timezone'}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="America/Toronto">Eastern Time (Toronto)</option>
                  <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                  <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                  <option value="America/Winnipeg">Central Time (Winnipeg)</option>
                  <option value="America/Halifax">Atlantic Time (Halifax)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? (locale === 'fr' ? 'Enregistrement...' : 'Saving...')
                : (locale === 'fr' ? 'Enregistrer les modifications' : 'Save Changes')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function SecurityTab({ locale }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-white">
        <CardTitle className="text-xl text-gray-900">
          {locale === 'fr' ? 'Paramètres de sécurité' : 'Security Settings'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {locale === 'fr'
            ? 'Gérez votre mot de passe et vos préférences de sécurité'
            : 'Manage your password and security preferences'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {locale === 'fr'
                    ? 'Mettez à jour votre mot de passe pour sécuriser votre compte'
                    : 'Update your password to keep your account secure'
                  }
                </p>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                {locale === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
              </Button>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Authentification à deux facteurs' : 'Two-Factor Authentication'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {locale === 'fr'
                    ? 'Ajoutez une couche de sécurité supplémentaire à votre compte'
                    : 'Add an extra layer of security to your account'
                  }
                </p>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                {locale === 'fr' ? 'Activer 2FA' : 'Enable 2FA'}
              </Button>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Sessions actives' : 'Active Sessions'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {locale === 'fr'
                    ? 'Gérez vos sessions actives sur tous les appareils'
                    : 'Manage your active sessions across devices'
                  }
                </p>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                {locale === 'fr' ? 'Voir les sessions' : 'View Sessions'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationsTab({ locale }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-white">
        <CardTitle className="text-xl text-gray-900">
          {locale === 'fr' ? 'Préférences de notification' : 'Notification Preferences'}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {locale === 'fr'
            ? 'Choisissez comment vous souhaitez recevoir les notifications'
            : 'Choose how you want to receive notifications'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {locale === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}
              </h3>
              <p className="text-gray-600">
                {locale === 'fr'
                  ? 'Les paramètres de notification seront bientôt disponibles'
                  : 'Notification settings will be available soon'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function JurisdictionPreferences({ locale }: any) {
  const [preferences, setPreferences] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const availableJurisdictions = [
    { id: "federal", name: "Federal", description: "Federal laws and regulations" },
    { id: "ontario", name: "Ontario", description: "Provincial laws and regulations" },
    { id: "bc", name: "British Columbia", description: "Provincial laws and regulations" },
    { id: "alberta", name: "Alberta", description: "Provincial laws and regulations" },
    { id: "quebec", name: "Quebec", description: "Provincial laws and regulations" },
    { id: "saskatchewan", name: "Saskatchewan", description: "Provincial laws and regulations" },
    { id: "manitoba", name: "Manitoba", description: "Provincial laws and regulations" },
    { id: "nova-scotia", name: "Nova Scotia", description: "Provincial laws and regulations" },
    { id: "new-brunswick", name: "New Brunswick", description: "Provincial laws and regulations" },
    { id: "newfoundland", name: "Newfoundland and Labrador", description: "Provincial laws and regulations" },
    { id: "pei", name: "Prince Edward Island", description: "Provincial laws and regulations" },
    { id: "northwest-territories", name: "Northwest Territories", description: "Territorial laws and regulations" },
    { id: "nunavut", name: "Nunavut", description: "Territorial laws and regulations" },
    { id: "yukon", name: "Yukon", description: "Territorial laws and regulations" },
  ]

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/jurisdictions")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleJurisdiction = (jurisdictionId: string) => {
    const existingIndex = preferences.findIndex(p => p.jurisdiction === jurisdictionId)

    if (existingIndex >= 0) {
      // Toggle enabled status
      const updated = [...preferences]
      updated[existingIndex] = {
        ...updated[existingIndex],
        enabled: !updated[existingIndex].enabled
      }
      setPreferences(updated)
    } else {
      // Add new jurisdiction
      setPreferences([...preferences, {
        jurisdiction: jurisdictionId,
        enabled: true,
        priority: preferences.length + 1
      }])
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/jurisdictions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          preferences: preferences.filter(p => p.enabled)
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Jurisdiction preferences saved successfully!")
        setPreferences(data.preferences)
      } else {
        setMessage(data.error || "Failed to save preferences")
      }
    } catch (error) {
      setMessage("An error occurred while saving preferences")
    } finally {
      setIsSaving(false)
    }
  }

  const isJurisdictionEnabled = (jurisdictionId: string) => {
    const pref = preferences.find(p => p.jurisdiction === jurisdictionId)
    return pref?.enabled || false
  }

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="text-center py-12 bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {locale === 'fr' ? 'Chargement des préférences...' : 'Loading preferences...'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-white">
        <CardTitle className="flex items-center space-x-2 text-xl text-gray-900">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>
            {locale === 'fr' ? 'Préférences de juridiction' : 'Jurisdiction Preferences'}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          {locale === 'fr'
            ? 'Sélectionnez les juridictions pour lesquelles vous souhaitez recevoir des mises à jour juridiques et des notifications'
            : 'Select the jurisdictions you want to receive legal updates and notifications for'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        {message && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {availableJurisdictions.map((jurisdiction) => (
            <div
              key={jurisdiction.id}
              className={`p-5 border rounded-lg cursor-pointer transition-all duration-200 ${
                isJurisdictionEnabled(jurisdiction.id)
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
              onClick={() => handleToggleJurisdiction(jurisdiction.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{jurisdiction.name}</h3>
                  <p className="text-sm text-gray-600">{jurisdiction.description}</p>
                </div>
                <div className="ml-4">
                  {isJurisdictionEnabled(jurisdiction.id) ? (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-blue-400 transition-colors"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving
              ? (locale === 'fr' ? 'Enregistrement...' : 'Saving...')
              : (locale === 'fr' ? 'Enregistrer les préférences' : 'Save Preferences')
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
