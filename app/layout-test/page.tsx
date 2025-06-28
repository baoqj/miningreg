"use client"

import { useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, BookOpen, Bell, Users, Gavel } from "lucide-react"

export default function LayoutTestPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-white hover:bg-navy-800"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <Scale className="h-8 w-8 text-gold-400" />
                <div>
                  <h1 className="text-lg font-bold">Layout Test - Left Sidebar</h1>
                  <p className="text-sm text-gray-300">New Vertical Navigation</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Test Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - Left Sidebar + Right Content */}
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
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
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
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

            <div className="space-y-1">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false) // Close mobile sidebar when item is selected
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Layout Info */}
            <div className="mt-8 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Layout Features</h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Vertical navigation sidebar</li>
                <li>• Responsive mobile design</li>
                <li>• Smooth transitions</li>
                <li>• Active state indicators</li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Right Content Area */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="p-4 lg:p-6">
            <div className="space-y-6">
              {/* Current Tab Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {tabs.find(tab => tab.id === activeTab)?.icon && (
                      <tabs.find(tab => tab.id === activeTab).icon className="h-6 w-6" />
                    )}
                    <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    This is the content area for the <strong>{activeTab}</strong> tab. 
                    The layout now uses a left sidebar navigation instead of horizontal tabs.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Desktop Features</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Fixed left sidebar (256px width)</li>
                        <li>• Smooth hover effects</li>
                        <li>• Active state highlighting</li>
                        <li>• Scrollable content area</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📱 Mobile Features</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Hamburger menu button</li>
                        <li>• Slide-out sidebar</li>
                        <li>• Overlay background</li>
                        <li>• Auto-close on selection</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Layout Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Layout Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3">❌ Old Horizontal Layout</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Horizontal tabs at top</li>
                        <li>• Limited space for tab labels</li>
                        <li>• Difficult to add more tabs</li>
                        <li>• Less intuitive navigation</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">✅ New Vertical Layout</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Vertical sidebar navigation</li>
                        <li>• More space for descriptive labels</li>
                        <li>• Easy to add new sections</li>
                        <li>• Better mobile experience</li>
                        <li>• More content space</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Test Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Desktop Testing:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Click different navigation items in the left sidebar</li>
                        <li>Observe the active state highlighting</li>
                        <li>Check hover effects on navigation items</li>
                        <li>Verify content area updates correctly</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Mobile Testing:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Resize browser window to mobile size (< 1024px)</li>
                        <li>Click the hamburger menu button in header</li>
                        <li>Verify sidebar slides out from left</li>
                        <li>Click a navigation item and see sidebar close</li>
                        <li>Click overlay to close sidebar</li>
                      </ol>
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
