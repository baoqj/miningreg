"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Briefcase, Phone, Globe, Save, Camera, MapPin, Check, X } from "lucide-react"
import { useLanguage, useTranslations } from '@/components/providers/language-provider'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const { locale, setLocale } = useLanguage()
  const t = useTranslations('profile')
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
            <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
            <TabsTrigger value="jurisdictions">{t('tabs.jurisdictions')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t('general.title')}</CardTitle>
                <CardDescription>
                  {t('general.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-lg">
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{session.user.role}</Badge>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="e.g., Senior Legal Analyst"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">{t('general.language')}</Label>
                      <select
                        id="language"
                        name="language"
                        value={locale}
                        onChange={(e) => {
                          const newLocale = e.target.value as 'en' | 'fr'
                          setLocale(newLocale)
                          setFormData({ ...formData, language: newLocale })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/Toronto">Eastern Time (Toronto)</option>
                        <option value="America/Vancouver">Pacific Time (Vancouver)</option>
                        <option value="America/Edmonton">Mountain Time (Edmonton)</option>
                        <option value="America/Winnipeg">Central Time (Winnipeg)</option>
                        <option value="America/Halifax">Atlantic Time (Halifax)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Active Sessions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage your active sessions across devices
                    </p>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Notification settings will be implemented here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jurisdictions">
            <JurisdictionPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function JurisdictionPreferences() {
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
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading preferences...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Jurisdiction Preferences</span>
        </CardTitle>
        <CardDescription>
          Select the jurisdictions you want to receive legal updates and notifications for
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableJurisdictions.map((jurisdiction) => (
            <div
              key={jurisdiction.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                isJurisdictionEnabled(jurisdiction.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleToggleJurisdiction(jurisdiction.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{jurisdiction.name}</h3>
                  <p className="text-sm text-gray-600">{jurisdiction.description}</p>
                </div>
                <div className="ml-4">
                  {isJurisdictionEnabled(jurisdiction.id) ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSavePreferences} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
