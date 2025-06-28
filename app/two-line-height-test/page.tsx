"use client"

import { useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Bell, MapPin, FileText, BookOpen, Users, Gavel, ChevronDown } from "lucide-react"

export default function TwoLineHeightTestPage() {
  const { t, locale, setLocale } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'fr' : 'en')
  }

  // Test navigation items with varying text lengths
  const navigationItems = [
    { id: "dashboard", label: t('tabs.dashboard'), icon: FileText },
    { id: "consultation", label: t('tabs.consultation'), icon: Scale },
    { id: "regulations", label: t('tabs.regulations'), icon: BookOpen },
    { id: "eia", label: t('tabs.eia'), icon: FileText },
    { id: "updates", label: t('tabs.updates'), icon: Bell },
    { id: "projects", label: t('tabs.projects'), icon: Users },
    { id: "templates", label: t('tabs.templates'), icon: Gavel },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-900 text-white border-b border-navy-800">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-md text-white hover:bg-navy-800 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2.5">
                <Scale className="h-8 w-8 text-gold-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg font-bold truncate">Two-Line Height Test</h1>
                  <p className="text-sm text-gray-300 hidden sm:block">Fixed 64px Navigation Height</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={toggleLanguage} variant="outline" size="sm" className="text-xs">
                🌍 {locale === 'en' ? 'FR' : 'EN'}
              </Button>
              <div className="h-8 w-8 bg-gold-400 text-navy-900 rounded-full flex items-center justify-center font-semibold text-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation with Fixed Two-Line Height */}
        <nav className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Navigation
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="hidden lg:block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Navigation
            </h3>

            {/* Language Toggle */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Button onClick={toggleLanguage} variant="outline" size="sm" className="w-full">
                🌍 Switch to {locale === 'en' ? 'Français' : 'English'}
              </Button>
              <div className="mt-2 text-xs text-blue-600 text-center">
                Current: {locale === 'en' ? 'English' : 'Français'}
              </div>
            </div>

            {/* Navigation items with fixed two-line height */}
            <div className="space-y-1">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 rounded-lg text-left transition-colors touch-manipulation h-16 ${
                    index === 0
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex items-center min-h-[2.5rem]">
                    <span className="font-medium leading-5 text-sm">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Height Measurement Display */}
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">📏 Height Specs</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Button height: 64px (h-16)</li>
                <li>• Text container: 40px (min-h-[2.5rem])</li>
                <li>• Line height: 1.25 (leading-5)</li>
                <li>• Font size: 14px (text-sm)</li>
                <li>• Padding: 16px horizontal</li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Right Content Area */}
        <main className="flex-1 overflow-auto lg:ml-0 min-h-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📐 Two-Line Height Test Results</h2>
                <Badge variant="outline" className="w-fit">
                  Language: {locale === 'en' ? 'English' : 'Français'}
                </Badge>
              </div>

              {/* Test Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>✅</span>
                      <span>Fixed Height Benefits</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">64px Fixed Height</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Zero layout jumping on language switch</p>
                        <p>✅ Accommodates longest French translations</p>
                        <p>✅ Consistent visual rhythm</p>
                        <p>✅ Better touch targets (64px > 44px minimum)</p>
                        <p>✅ Vertically centered text alignment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Text Positioning</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Vertically Centered</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Text container: min-h-[2.5rem] (40px)</p>
                        <p>✅ Flex items-center for vertical centering</p>
                        <p>✅ Leading-5 for consistent line height</p>
                        <p>✅ Text-sm for optimal readability</p>
                        <p>✅ Handles both single and multi-line text</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Language Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>🌍 Language Text Length Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-3">English Navigation Labels</h4>
                        <ul className="text-sm space-y-2">
                          {[
                            "Dashboard",
                            "Legal AI Consultation", 
                            "Regulations Explorer",
                            "EIA/Report AI",
                            "Legal Updates",
                            "Project Workspace",
                            "Prompt Templates"
                          ].map((label, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                              <span>{label}</span>
                              <span className="text-xs text-gray-500">({label.length} chars)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-600 mb-3">French Navigation Labels</h4>
                        <ul className="text-sm space-y-2">
                          {[
                            "Tableau de bord",
                            "Consultation IA juridique",
                            "Explorateur de règlements", 
                            "IA EIE/Rapport",
                            "Mises à jour juridiques",
                            "Espace de travail projet",
                            "Modèles de prompts"
                          ].map((label, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center text-xs">
                                {index + 1}
                              </div>
                              <span>{label}</span>
                              <span className="text-xs text-gray-500">({label.length} chars)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🎉 Test Results Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                        <div>
                          <strong>Height Stability:</strong>
                          <br />All navigation items maintain exactly 64px height regardless of text length or language
                        </div>
                        <div>
                          <strong>Text Centering:</strong>
                          <br />All text is perfectly vertically centered within the fixed height container
                        </div>
                        <div>
                          <strong>Language Support:</strong>
                          <br />Both English and French text fit comfortably within the two-line height allocation
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Interactive Test Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Step-by-Step Testing:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                        <li>Click the language toggle button in the sidebar or header</li>
                        <li>Observe that all navigation items maintain exactly the same height</li>
                        <li>Notice that text remains perfectly centered vertically</li>
                        <li>Switch back and forth multiple times to verify stability</li>
                        <li>Test on different screen sizes (mobile, tablet, desktop)</li>
                        <li>Verify that longer French text still fits within the fixed height</li>
                      </ol>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Expected Results:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Zero visual jumping or layout shifts</li>
                        <li>• Consistent 64px height for all navigation items</li>
                        <li>• Text always appears vertically centered</li>
                        <li>• Smooth language transitions</li>
                        <li>• Professional, stable appearance</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
