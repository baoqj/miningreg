"use client"

import { useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Bell, MapPin, FileText, BookOpen, Users, Gavel, ChevronDown } from "lucide-react"

export default function LayoutOptimizationTestPage() {
  const { t, locale, setLocale } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'fr' : 'en')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optimized Header */}
      <header className="bg-navy-900 text-white border-b border-navy-800">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-2 flex-1">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-md text-white hover:bg-navy-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Logo and Title - Left aligned with reduced margins */}
              <div className="flex items-center space-x-2.5">
                <Scale className="h-8 w-8 text-gold-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg font-bold truncate">Layout Optimization Test</h1>
                  <p className="text-sm text-gray-300 hidden sm:block">Reduced Margins & Consistent Heights</p>
                </div>
              </div>

              {/* Jurisdiction selector - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2 ml-6">
                <MapPin className="h-4 w-4 text-gray-300" />
                <select className="bg-navy-800 border-navy-700 text-sm rounded px-2 py-1">
                  <option>Federal</option>
                  <option>Ontario</option>
                  <option>Alberta</option>
                </select>
              </div>
            </div>

            {/* Right side - Notifications and User Menu with reduced margins */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-1.5 rounded-md hover:bg-navy-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 cursor-pointer hover:text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* User Menu with reduced right margin */}
              <div className="flex items-center space-x-1.5 hover:bg-navy-800 rounded-lg p-1.5 transition-colors">
                <div className="h-8 w-8 bg-gold-400 text-navy-900 rounded-full flex items-center justify-center font-semibold text-sm">
                  U
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="text-sm font-medium truncate max-w-28">Test User</div>
                  <div className="text-xs text-gray-300 truncate max-w-28">Admin</div>
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
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

        {/* Left Sidebar Navigation with consistent heights */}
        <nav className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 h-full overflow-y-auto">
            {/* Mobile close button */}
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Navigation
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop title */}
            <h3 className="hidden lg:block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Navigation
            </h3>

            {/* Language Toggle for Testing */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Button onClick={toggleLanguage} variant="outline" size="sm" className="w-full">
                🌍 Switch to {locale === 'en' ? 'Français' : 'English'}
              </Button>
            </div>

            {/* Navigation items with consistent heights */}
            <div className="space-y-1">
              {[
                { id: "dashboard", label: t('tabs.dashboard'), icon: FileText },
                { id: "consultation", label: t('tabs.consultation'), icon: Scale },
                { id: "regulations", label: t('tabs.regulations'), icon: BookOpen },
                { id: "eia", label: t('tabs.eia'), icon: FileText },
                { id: "updates", label: t('tabs.updates'), icon: Bell },
                { id: "projects", label: t('tabs.projects'), icon: Users },
                { id: "templates", label: t('tabs.templates'), icon: Gavel },
              ].map((item, index) => (
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

            {/* Height Test Info */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">Fixed Two-Line Height</h4>
              <ul className="text-xs text-green-600 space-y-1">
                <li>• Fixed height: 64px (h-16)</li>
                <li>• Two-line capacity for all text</li>
                <li>• Vertically centered text</li>
                <li>• Zero layout jumping</li>
                <li>• Language-independent height</li>
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">🎨 Layout Optimization Results</h2>
                <Badge variant="outline" className="w-fit">
                  Current Language: {locale === 'en' ? 'English' : 'Français'}
                </Badge>
              </div>

              {/* Optimization Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📏</span>
                      <span>Left Sidebar Heights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Fixed: min-h-[52px]</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Consistent height across languages</p>
                        <p>✅ No layout jumping on language switch</p>
                        <p>✅ Line height: leading-5 (1.25)</p>
                        <p>✅ Proper vertical alignment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>⬅️</span>
                      <span>Logo Left Alignment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Reduced: px-2 sm:px-4</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Logo closer to left edge</p>
                        <p>✅ Reduced container padding</p>
                        <p>✅ Better brand positioning</p>
                        <p>✅ Mobile-responsive spacing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>➡️</span>
                      <span>User Avatar Right Margin</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Reduced: space-x-2, p-1.5</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Closer to right edge</p>
                        <p>✅ Reduced internal spacing</p>
                        <p>✅ Optimized touch targets</p>
                        <p>✅ Better space utilization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Before/After Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Before vs After Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3">❌ Before Optimization</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Sidebar options: variable heights (py-4)</li>
                        <li>• Language switching caused layout jumps</li>
                        <li>• Logo: excessive left padding (px-4 sm:px-6 lg:px-8)</li>
                        <li>• User avatar: large right margins (space-x-3, p-2)</li>
                        <li>• Inconsistent text line heights</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">✅ After Optimization</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Sidebar options: consistent 52px min-height</li>
                        <li>• Stable layout across language switches</li>
                        <li>• Logo: reduced padding (px-2 sm:px-4 lg:px-6)</li>
                        <li>• User avatar: optimized margins (space-x-2, p-1.5)</li>
                        <li>• Fixed line height (leading-5) for consistency</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🧪 Test Instructions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <strong>Language Switch Test:</strong>
                        <br />Click the language toggle button in the sidebar and observe that navigation heights remain consistent
                      </div>
                      <div>
                        <strong>Layout Alignment Test:</strong>
                        <br />Check that the logo is closer to the left edge and user avatar is closer to the right edge
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle>⚙️ Technical Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">CSS Classes Applied:</h4>
                      <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                        <div>• Sidebar buttons: <code>min-h-[52px] py-3 leading-5</code></div>
                        <div>• Header container: <code>px-2 sm:px-4 lg:px-6</code></div>
                        <div>• Logo spacing: <code>space-x-2.5</code></div>
                        <div>• User menu: <code>space-x-2 p-1.5</code></div>
                        <div>• Avatar text: <code>max-w-28</code></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Key Improvements:</h4>
                      <ul className="text-sm space-y-1">
                        <li>1. <strong>Height Consistency</strong>: Fixed minimum height prevents layout shifts</li>
                        <li>2. <strong>Margin Optimization</strong>: Reduced unnecessary spacing for better alignment</li>
                        <li>3. <strong>Responsive Design</strong>: Maintains optimizations across all screen sizes</li>
                        <li>4. <strong>Touch Targets</strong>: Preserved accessibility while optimizing space</li>
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
