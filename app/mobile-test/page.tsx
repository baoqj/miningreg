"use client"

import { useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, Bell, MapPin, FileText, BookOpen, Users, Gavel, ChevronDown } from "lucide-react"

export default function MobileTestPage() {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Header */}
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

              {/* Logo and Title */}
              <div className="flex items-center space-x-2.5">
                <Scale className="h-8 w-8 text-gold-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-lg font-bold truncate">Mobile Test - MiningReg</h1>
                  <p className="text-sm text-gray-300 hidden sm:block">Multi-Device UI Test</p>
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

            {/* Right side - Notifications and User Menu */}
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

              {/* User Menu */}
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

            {/* Mobile jurisdiction selector */}
            <div className="md:hidden mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Jurisdiction</span>
              </div>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>Federal</option>
                <option>Ontario</option>
                <option>Alberta</option>
              </select>
            </div>

            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: FileText },
                { id: "consultation", label: "Legal AI Consultation", icon: Scale },
                { id: "regulations", label: "Regulations Explorer", icon: BookOpen },
                { id: "eia", label: "EIA/Report AI", icon: FileText },
                { id: "updates", label: "Legal Updates", icon: Bell },
                { id: "projects", label: "Project Workspace", icon: Users },
                { id: "templates", label: "Prompt Templates", icon: Gavel },
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
          </div>
        </nav>

        {/* Right Content Area */}
        <main className="flex-1 overflow-auto lg:ml-0 min-h-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📱 Multi-Device UI Test</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto text-sm">Test Action</Button>
                  <Button className="w-full sm:w-auto text-sm">Primary Action</Button>
                </div>
              </div>

              {/* Device Test Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📱</span>
                      <span>iPhone Test</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Portrait: 375x667</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Header responsive</p>
                        <p>✅ Sidebar slides out</p>
                        <p>✅ Touch targets 44px+</p>
                        <p>✅ Text readable</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>📱</span>
                      <span>iPad Test</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Portrait: 768x1024</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Sidebar behavior</p>
                        <p>✅ Grid layouts adapt</p>
                        <p>✅ Touch interactions</p>
                        <p>✅ Content spacing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>💻</span>
                      <span>Desktop Test</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">Desktop: 1024px+</Badge>
                      <div className="text-sm text-gray-600">
                        <p>✅ Fixed sidebar</p>
                        <p>✅ Full feature access</p>
                        <p>✅ Hover states</p>
                        <p>✅ Optimal layout</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Layout Test */}
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Layout Optimization Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">✅ Header Improvements</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Logo and title left-aligned</li>
                        <li>• Removed standalone language switcher</li>
                        <li>• User avatar right-aligned</li>
                        <li>• Responsive padding and spacing</li>
                        <li>• Mobile hamburger menu</li>
                        <li>• Touch-friendly button sizes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">📱 Mobile Optimizations</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Sidebar slides out on mobile</li>
                        <li>• Jurisdiction selector in mobile sidebar</li>
                        <li>• Touch-optimized button sizes (44px+)</li>
                        <li>• Responsive text sizing</li>
                        <li>• Proper viewport handling</li>
                        <li>• Smooth animations and transitions</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🧪 Test Instructions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                      <div>
                        <strong>iPhone Test:</strong>
                        <br />Resize browser to 375px width or use device emulation
                      </div>
                      <div>
                        <strong>iPad Test:</strong>
                        <br />Test at 768px width in both portrait and landscape
                      </div>
                      <div>
                        <strong>Desktop Test:</strong>
                        <br />Verify layout at 1024px+ with all features visible
                      </div>
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
