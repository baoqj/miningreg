"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations, useLanguage } from '@/components/providers/language-provider'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Bell,
  Scale,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  Gavel,
  BookOpen,
  Users,
  ChevronDown,
  Star,
  Download,
  Copy,
  Bookmark,
  User,
  Settings,
  CreditCard,
  LogOut,
  Building,
  HelpCircle,
  Shield,
  Languages,
  Globe,
  Key,
  BarChart3,
} from "lucide-react"
import { LanguageDebug } from "@/components/language-debug"

export default function MiningLegalAssistant() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { locale, setLocale } = useLanguage()
  const t = useTranslations()
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("federal")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [consultationQuery, setConsultationQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  <h1 className="text-lg font-bold truncate">Canadian Mining Regulatory</h1>
                  <p className="text-sm text-gray-300 hidden sm:block">AI Legal Assistant</p>
                </div>
              </div>

              {/* Jurisdiction selector - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2 ml-6">
                <MapPin className="h-4 w-4 text-gray-300" />
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                  <SelectTrigger className="w-36 bg-navy-800 border-navy-700 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">{t('regulations.federal')}</SelectItem>
                    <SelectItem value="ontario">Ontario</SelectItem>
                    <SelectItem value="bc">British Columbia</SelectItem>
                    <SelectItem value="alberta">Alberta</SelectItem>
                    <SelectItem value="municipal">{t('regulations.municipal')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right side - Language, Notifications and User Menu */}
            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 rounded-md hover:bg-navy-800 transition-colors"
                    aria-label="Switch Language"
                  >
                    <Globe className="h-5 w-5 cursor-pointer hover:text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Language / Langue</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setLocale('en')}
                    className={locale === 'en' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    <span className="mr-2">🇺🇸</span>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocale('fr')}
                    className={locale === 'fr' ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    <span className="mr-2">🇫🇷</span>
                    Français
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1.5 hover:bg-navy-800 rounded-lg p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-gold-400 text-navy-900 font-semibold text-sm">
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="text-sm font-medium truncate max-w-28">{session?.user?.name || "User"}</div>
                    <div className="text-xs text-gray-300 truncate max-w-28">{session?.user?.role || "User"}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.role}</p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('navigation.profile')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('navigation.settings')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/teams")}>
                    <Building className="mr-2 h-4 w-4" />
                    <span>{t('navigation.teams')}</span>
                  </DropdownMenuItem>


                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile?tab=jurisdictions")}>
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{t('navigation.jurisdictions')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>{t('navigation.complianceDashboard')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/subscriptions")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>{t('navigation.subscriptions')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{t('navigation.legalExpertAccess')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>{t('navigation.language')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          console.log('Setting language to en')
                          setLocale('en')
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>English</span>
                          {locale === 'en' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          console.log('Setting language to fr')
                          setLocale('fr')
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Français</span>
                          {locale === 'fr' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    <span>{t('navigation.apiAccess')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>{t('navigation.helpSupport')}</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                {t('navigation.title')}
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
              {t('navigation.title')}
            </h3>

            {/* Mobile jurisdiction selector */}
            <div className="md:hidden mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{t('consultation.selectJurisdiction')}</span>
              </div>
              <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal">{t('regulations.federal')}</SelectItem>
                  <SelectItem value="ontario">Ontario</SelectItem>
                  <SelectItem value="bc">British Columbia</SelectItem>
                  <SelectItem value="alberta">Alberta</SelectItem>
                  <SelectItem value="municipal">{t('regulations.municipal')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              {[
                { id: "dashboard", label: t('tabs.dashboard'), icon: FileText },
                { id: "consultation", label: t('tabs.consultation'), icon: Scale },
                { id: "regulations", label: t('tabs.regulations'), icon: BookOpen },
                { id: "eia", label: t('tabs.eia'), icon: FileText },
                { id: "updates", label: t('tabs.updates'), icon: Bell },
                { id: "projects", label: t('tabs.projects'), icon: Users },
                { id: "templates", label: t('tabs.templates'), icon: Gavel },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false) // Close mobile sidebar when item is selected
                  }}
                  className={`w-full flex items-center space-x-3 px-4 rounded-lg text-left transition-colors touch-manipulation h-16 ${
                    activeTab === item.id
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{t('dashboard.welcome', { name: session?.user?.name || "User" })}</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto text-sm">{t('dashboard.quickActions')}</Button>
                <Button className="w-full sm:w-auto text-sm">{t('dashboard.legalUpdates')}</Button>
              </div>
            </div>

            {/* Global Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('dashboard.searchPlaceholder')}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compliance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.riskAssessment')}</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-gray-600">2 high priority, 1 medium</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Copper Creek Mine - EIA Deadline</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Gold Valley Project - Permit Renewal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.recentLegalUpdates')}</CardTitle>
                  <Bell className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">7</div>
                  <p className="text-xs text-gray-600">{t('dashboard.affectingYourProjects')}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm">Ontario Mining Act Amendment</div>
                    <div className="text-sm">Federal EIA Regulation Update</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.pendingReviews')}</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">5</div>
                  <p className="text-xs text-gray-600">{t('dashboard.reportsAwaitingApproval')}</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm">Environmental Assessment - Stage 2</div>
                    <div className="text-sm">Indigenous Consultation Report</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Legal AI Consultation */}
          <TabsContent value="consultation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Scale className="h-5 w-5" />
                      <span>{t('consultation.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('consultation.yourLegalQuestion')}</label>
                      <Textarea
                        placeholder={t('consultation.questionPlaceholder')}
                        value={consultationQuery}
                        onChange={(e) => setConsultationQuery(e.target.value)}
                        className="min-h-32"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder={t('consultation.selectProjectContext')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="copper-creek">Copper Creek Mine</SelectItem>
                          <SelectItem value="gold-valley">Gold Valley Project</SelectItem>
                          <SelectItem value="iron-ridge">Iron Ridge Expansion</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="federal">{t('regulations.federal')}</SelectItem>
                          <SelectItem value="ontario">Ontario</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                          <SelectItem value="alberta">Alberta</SelectItem>
                          <SelectItem value="municipal">{t('regulations.municipal')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" size="lg">
                      <Scale className="h-4 w-4 mr-2" />
                      {t('consultation.askAiLegalAssistant')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Sample AI Response */}
                {consultationQuery && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Legal Response</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="outline">Federal Jurisdiction</Badge>
                        <Badge variant="outline">EIA Requirements</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Professional Legal Analysis</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Under the Impact Assessment Act (IAA), your project requires a federal environmental impact
                          assessment if it meets the criteria outlined in the Physical Activities Regulations. Based on
                          your project description, the following applies...
                        </p>
                        <Button variant="outline" size="sm">
                          Show Simplified Explanation
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Legal Citations & References</h4>
                        <div className="text-sm space-y-1">
                          <div>• Impact Assessment Act, S.C. 2019, c. 28, s. 1, Section 7</div>
                          <div>• Physical Activities Regulations, SOR/2019-285, Schedule 1, Item 16</div>
                          <div>• Ontario Environmental Assessment Act, R.S.O. 1990, c. E.18</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4 mr-1" />
                          Bookmark
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Request Legal Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('consultation.promptTemplates')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: t('consultation.eiaRequirements'), category: t('consultation.environmental') },
                      { title: t('consultation.indigenousConsultation'), category: t('consultation.rights') },
                      { title: t('consultation.permitRenewalProcess'), category: t('consultation.licensing') },
                      { title: t('consultation.landUseCompliance'), category: t('consultation.zoning') },
                    ].map((template, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-sm">{template.title}</div>
                        <div className="text-xs text-gray-500">{template.category}</div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      {t('consultation.browseAllTemplates')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('consultation.recentQueries')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      t('consultation.sampleQueries.eiaTimeline'),
                      t('consultation.sampleQueries.indigenousConsultation'),
                      t('consultation.sampleQueries.federalVsProvincial'),
                    ].map((query, index) => (
                      <div key={index} className="p-2 text-sm border rounded hover:bg-gray-50 cursor-pointer">
                        {query}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          {/* Regulations Explorer */}
          <TabsContent value="regulations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Jurisdiction Tree */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Jurisdiction Tree</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm flex items-center space-x-2">
                      <ChevronDown className="h-4 w-4" />
                      <span>Federal Regulations</span>
                      <Badge variant="destructive" className="text-xs">
                        3 New
                      </Badge>
                    </div>
                    <div className="ml-6 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Impact Assessment Act</span>
                        <Badge variant="outline" className="text-xs">
                          Updated
                        </Badge>
                      </div>
                      <div>Fisheries Act</div>
                      <div>Species at Risk Act</div>
                      <div>Canadian Environmental Protection Act</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-sm flex items-center space-x-2">
                      <ChevronDown className="h-4 w-4" />
                      <span>Ontario Provincial</span>
                      <Badge variant="secondary" className="text-xs">
                        1 New
                      </Badge>
                    </div>
                    <div className="ml-6 space-y-1 text-sm">
                      <div>Mining Act</div>
                      <div>Environmental Protection Act</div>
                      <div>Aggregate Resources Act</div>
                      <div>Planning Act</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-sm flex items-center space-x-2">
                      <ChevronDown className="h-4 w-4" />
                      <span>Municipal Bylaws</span>
                    </div>
                    <div className="ml-6 space-y-1 text-sm">
                      <div>Zoning Bylaws</div>
                      <div>Noise Control</div>
                      <div>Traffic Management</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Viewer */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Impact Assessment Act - Section 7: Designation</CardTitle>
                  <div className="flex space-x-2">
                    <Badge>Federal</Badge>
                    <Badge variant="outline">S.C. 2019, c. 28, s. 1</Badge>
                    <Button variant="outline" size="sm">
                      Compare Jurisdictions
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-800">Recent Amendment - December 2024</p>
                    <p className="text-sm text-yellow-700">
                      New subsection (2.1) added regarding mining project thresholds
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <h4>7. Designation by Minister</h4>
                    <p>
                      <strong>(1)</strong> The Minister may, by order, designate a physical activity that is not
                      prescribed by regulations made under paragraph 109(b) if, in the Minister's opinion, either the
                      carrying out of that physical activity may cause adverse effects within federal jurisdiction or
                      adverse direct or incidental effects, or public concerns related to those effects warrant the
                      designation.
                    </p>

                    <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <strong>(2.1) Mining Activities</strong> For mining activities exceeding 2,000 tonnes per day of
                      ore processing capacity, the Minister shall consider designation if the activity is located within
                      50 kilometers of Indigenous traditional territories or critical habitat of listed species.
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save to Project
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Citation
                    </Button>
                    <Button variant="outline" size="sm">
                      Show Amendments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search & Filters */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Search & Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Search regulations..." />

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Topic</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Topics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="safety">Safety</SelectItem>
                          <SelectItem value="indigenous">Indigenous Rights</SelectItem>
                          <SelectItem value="permitting">Permitting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Update Status</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Updates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New (Last 30 days)</SelectItem>
                          <SelectItem value="amended">Recently Amended</SelectItem>
                          <SelectItem value="conflicting">Conflicting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Impact Level</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="high" />
                          <label htmlFor="high" className="text-sm">
                            High Impact
                          </label>
                          <Badge variant="destructive" className="text-xs">
                            12
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="medium" />
                          <label htmlFor="medium" className="text-sm">
                            Medium Impact
                          </label>
                          <Badge variant="secondary" className="text-xs">
                            28
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="low" />
                          <label htmlFor="low" className="text-sm">
                            Low Impact
                          </label>
                          <Badge variant="outline" className="text-xs">
                            45
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EIA/Report AI */}
          <TabsContent value="eia" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>AI-Assisted Report Builder</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Select Project</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose project..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="copper-creek">Copper Creek Mine Expansion</SelectItem>
                          <SelectItem value="gold-valley">Gold Valley New Development</SelectItem>
                          <SelectItem value="iron-ridge">Iron Ridge Tailings Facility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eia">Environmental Impact Assessment</SelectItem>
                          <SelectItem value="compliance">Compliance Report</SelectItem>
                          <SelectItem value="monitoring">Environmental Monitoring</SelectItem>
                          <SelectItem value="closure">Mine Closure Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Report Progress */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Report Generation Progress</h4>
                    <div className="space-y-3">
                      {[
                        { section: "Executive Summary", status: "completed", progress: 100 },
                        { section: "Project Description", status: "completed", progress: 100 },
                        { section: "Environmental Baseline", status: "in-progress", progress: 65 },
                        { section: "Impact Assessment", status: "pending", progress: 0 },
                        { section: "Mitigation Measures", status: "pending", progress: 0 },
                        { section: "Monitoring Plan", status: "pending", progress: 0 },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-48 text-sm">{item.section}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.status === "completed"
                                  ? "bg-green-500"
                                  : item.status === "in-progress"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <Badge
                            variant={
                              item.status === "completed"
                                ? "default"
                                : item.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                          {item.status !== "pending" && (
                            <Button variant="outline" size="sm">
                              {item.status === "completed" ? "Review" : "Continue"}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button className="h-20 flex flex-col space-y-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Generate Section</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Search className="h-6 w-6" />
                      <span className="text-sm">Summarize Requirements</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <AlertTriangle className="h-6 w-6" />
                      <span className="text-sm">Compliance Review</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Report Reviewer */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Report Reviewer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload report section for AI review</p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Recent Reviews</h4>
                    {[
                      {
                        document: "Environmental Baseline - Section 3.2",
                        score: 85,
                        issues: 3,
                        status: "needs-revision",
                      },
                      {
                        document: "Project Description - Section 2.1",
                        score: 92,
                        issues: 1,
                        status: "approved",
                      },
                      {
                        document: "Impact Assessment - Section 4.3",
                        score: 78,
                        issues: 5,
                        status: "major-revision",
                      },
                    ].map((review, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{review.document}</span>
                          <Badge
                            variant={
                              review.status === "approved"
                                ? "default"
                                : review.status === "needs-revision"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {review.score}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">{review.issues} issues found</div>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" className="text-xs">
                            View Issues
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Report Workflow Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-8 overflow-x-auto pb-4">
                  {[
                    { step: "Draft", status: "completed", date: "Dec 15" },
                    { step: "AI Review", status: "completed", date: "Dec 18" },
                    { step: "Expert Review", status: "current", date: "Dec 20" },
                    { step: "Client Review", status: "pending", date: "Dec 25" },
                    { step: "Final Approval", status: "pending", date: "Jan 5" },
                    { step: "Submission", status: "pending", date: "Jan 10" },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 min-w-24">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.status === "completed"
                            ? "bg-green-500 text-white"
                            : item.status === "current"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="text-xs font-medium text-center">{item.step}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Updates */}
          <TabsContent value="updates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Legal Updates Feed</span>
                    <div className="flex space-x-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Updates</SelectItem>
                          <SelectItem value="federal">Federal Only</SelectItem>
                          <SelectItem value="provincial">Provincial Only</SelectItem>
                          <SelectItem value="municipal">Municipal Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-1" />
                        Subscribe
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Impact Assessment Act - Regulation Amendment",
                      jurisdiction: "Federal",
                      date: "December 20, 2024",
                      impact: "high",
                      summary:
                        "New thresholds for mining project assessments. Projects exceeding 2,000 tonnes/day now require federal review.",
                      affectedProjects: 3,
                      type: "amendment",
                    },
                    {
                      title: "Ontario Mining Act - Section 51 Update",
                      jurisdiction: "Ontario",
                      date: "December 18, 2024",
                      impact: "medium",
                      summary:
                        "Updated rehabilitation security requirements. New calculation methods for financial assurance.",
                      affectedProjects: 2,
                      type: "update",
                    },
                    {
                      title: "Species at Risk Act - Critical Habitat Designation",
                      jurisdiction: "Federal",
                      date: "December 15, 2024",
                      impact: "high",
                      summary:
                        "New critical habitat designated for Woodland Caribou in Northern Ontario mining regions.",
                      affectedProjects: 1,
                      type: "new",
                    },
                    {
                      title: "Municipal Noise Bylaw - Thunder Bay",
                      jurisdiction: "Municipal",
                      date: "December 12, 2024",
                      impact: "low",
                      summary:
                        "Updated noise limits for industrial operations. New monitoring requirements during night hours.",
                      affectedProjects: 1,
                      type: "bylaw",
                    },
                  ].map((update, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{update.title}</h4>
                            <Badge
                              variant={
                                update.jurisdiction === "Federal"
                                  ? "default"
                                  : update.jurisdiction === "Ontario"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {update.jurisdiction}
                            </Badge>
                            <Badge
                              variant={
                                update.impact === "high"
                                  ? "destructive"
                                  : update.impact === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {update.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{update.summary}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{update.date}</span>
                            <span>•</span>
                            <span>{update.affectedProjects} affected projects</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Impact Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High Impact Updates</span>
                      <Badge variant="destructive">5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium Impact Updates</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low Impact Updates</span>
                      <Badge variant="outline">23</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Updates by Jurisdiction</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Federal</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="w-3/5 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-xs">15</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Provincial</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-xs">20</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Municipal</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-xs">5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Most Affected Projects</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Copper Creek Mine", updates: 8, risk: "high" },
                        { name: "Gold Valley Project", updates: 5, risk: "medium" },
                        { name: "Iron Ridge Expansion", updates: 3, risk: "low" },
                      ].map((project, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{project.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                project.risk === "high"
                                  ? "destructive"
                                  : project.risk === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {project.updates}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Project Workspace */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Workspace</h2>
              <div className="flex space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="compliance">Compliance Review</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Copper Creek Mine Expansion",
                  status: "active",
                  risk: "high",
                  manager: "Sarah Johnson",
                  location: "Sudbury, ON",
                  compliance: 78,
                  reports: 12,
                  issues: 3,
                  deadline: "2025-03-15",
                  team: 8,
                },
                {
                  name: "Gold Valley New Development",
                  status: "planning",
                  risk: "medium",
                  manager: "Mike Chen",
                  location: "Timmins, ON",
                  compliance: 92,
                  reports: 8,
                  issues: 1,
                  deadline: "2025-06-30",
                  team: 6,
                },
                {
                  name: "Iron Ridge Tailings Facility",
                  status: "compliance",
                  risk: "low",
                  manager: "Emma Wilson",
                  location: "Thunder Bay, ON",
                  compliance: 95,
                  reports: 15,
                  issues: 0,
                  deadline: "2025-01-20",
                  team: 4,
                },
                {
                  name: "Silver Mountain Exploration",
                  status: "active",
                  risk: "medium",
                  manager: "David Brown",
                  location: "Kirkland Lake, ON",
                  compliance: 85,
                  reports: 6,
                  issues: 2,
                  deadline: "2025-04-10",
                  team: 5,
                },
                {
                  name: "Nickel Basin Rehabilitation",
                  status: "closed",
                  risk: "low",
                  manager: "Lisa Anderson",
                  location: "Sudbury, ON",
                  compliance: 100,
                  reports: 25,
                  issues: 0,
                  deadline: "Completed",
                  team: 3,
                },
                {
                  name: "Platinum Creek Assessment",
                  status: "planning",
                  risk: "high",
                  manager: "Robert Taylor",
                  location: "Thunder Bay, ON",
                  compliance: 65,
                  reports: 3,
                  issues: 5,
                  deadline: "2025-08-15",
                  team: 7,
                },
              ].map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{project.location}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.risk === "high" ? "destructive" : project.risk === "medium" ? "secondary" : "outline"
                        }
                      >
                        {project.risk} risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Compliance Score</span>
                        <span className="font-medium">{project.compliance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            project.compliance >= 90
                              ? "bg-green-500"
                              : project.compliance >= 75
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${project.compliance}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{project.reports}</div>
                        <div className="text-xs text-gray-600">Reports</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{project.issues}</div>
                        <div className="text-xs text-gray-600">Issues</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{project.team}</div>
                        <div className="text-xs text-gray-600">Team</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Project Manager</span>
                        <span className="font-medium">{project.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Next Deadline</span>
                        <span className="font-medium">{project.deadline}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Prompt Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Template Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Environmental Impact Assessment", count: 15, icon: "🌱" },
                    { name: "Indigenous Consultation", count: 8, icon: "🤝" },
                    { name: "Permitting & Licensing", count: 12, icon: "📋" },
                    { name: "Safety & Compliance", count: 10, icon: "⚠️" },
                    { name: "Land Use & Zoning", count: 6, icon: "🗺️" },
                    { name: "Financial Assurance", count: 5, icon: "💰" },
                    { name: "Mine Closure", count: 7, icon: "🔚" },
                    { name: "Monitoring & Reporting", count: 9, icon: "📊" },
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Template Library */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Template Library</span>
                    <div className="flex space-x-2">
                      <Input placeholder="Search templates..." className="w-48" />
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="question">Questions</SelectItem>
                          <SelectItem value="report">Reports</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "EIA Scoping Requirements",
                      category: "Environmental Impact Assessment",
                      jurisdiction: "Federal",
                      complexity: "Intermediate",
                      description: "Template for determining EIA scoping requirements under the Impact Assessment Act",
                      inputs: ["Project type", "Location", "Scale", "Potential impacts"],
                      usage: 45,
                      rating: 4.8,
                    },
                    {
                      title: "Indigenous Consultation Protocol",
                      category: "Indigenous Consultation",
                      jurisdiction: "All",
                      complexity: "Advanced",
                      description: "Comprehensive template for Indigenous consultation requirements and protocols",
                      inputs: ["Traditional territory", "Project phase", "Consultation level", "Timeline"],
                      usage: 32,
                      rating: 4.9,
                    },
                    {
                      title: "Mining Permit Application Review",
                      category: "Permitting & Licensing",
                      jurisdiction: "Ontario",
                      complexity: "Beginner",
                      description: "Step-by-step guide for mining permit applications in Ontario",
                      inputs: ["Permit type", "Mine category", "Location", "Duration"],
                      usage: 67,
                      rating: 4.6,
                    },
                    {
                      title: "Environmental Monitoring Plan",
                      category: "Monitoring & Reporting",
                      jurisdiction: "All",
                      complexity: "Intermediate",
                      description: "Template for developing comprehensive environmental monitoring plans",
                      inputs: ["Environmental components", "Monitoring frequency", "Reporting schedule"],
                      usage: 28,
                      rating: 4.7,
                    },
                    {
                      title: "Financial Assurance Calculation",
                      category: "Financial Assurance",
                      jurisdiction: "Ontario",
                      complexity: "Advanced",
                      description: "Template for calculating rehabilitation security under Ontario Mining Act",
                      inputs: ["Mine type", "Disturbed area", "Rehabilitation costs", "Risk factors"],
                      usage: 19,
                      rating: 4.5,
                    },
                  ].map((template, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{template.title}</h4>
                            <Badge variant="outline">{template.jurisdiction}</Badge>
                            <Badge
                              variant={
                                template.complexity === "Beginner"
                                  ? "default"
                                  : template.complexity === "Intermediate"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {template.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <div className="text-xs text-gray-500">Required inputs: {template.inputs.join(", ")}</div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span>Used {template.usage} times</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{template.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Template Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Template Name</label>
                      <Input placeholder="Enter template name..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eia">Environmental Impact Assessment</SelectItem>
                          <SelectItem value="indigenous">Indigenous Consultation</SelectItem>
                          <SelectItem value="permitting">Permitting & Licensing</SelectItem>
                          <SelectItem value="safety">Safety & Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Jurisdiction</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="federal">Federal</SelectItem>
                          <SelectItem value="ontario">Ontario</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                          <SelectItem value="all">All Jurisdictions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Template Content</label>
                      <Textarea
                        placeholder="Enter your template content with placeholders like {project_name}, {location}, etc."
                        className="min-h-32"
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">My Templates</h4>
                    <div className="space-y-1">
                      {["Custom EIA Checklist", "Site-Specific Monitoring", "Stakeholder Engagement Plan"].map(
                        (template, index) => (
                          <div key={index} className="flex items-center justify-between text-sm p-2 border rounded">
                            <span>{template}</span>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="text-xs">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Share
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <LanguageDebug />
    </div>
  )
}
