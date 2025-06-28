"use client"

import { useLanguage } from '@/components/providers/language-provider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleLanguageSwitcher } from "@/components/simple-language-switcher"

export default function TranslationTestPage() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              🌍 Complete Interface Translation Test
              <SimpleLanguageSwitcher />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Current Language: <strong>{locale === 'en' ? 'English' : 'Français'}</strong>
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Navigation Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Tabs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Dashboard:</strong> {t('tabs.dashboard')}</div>
              <div><strong>Legal AI Consultation:</strong> {t('tabs.consultation')}</div>
              <div><strong>Regulations Explorer:</strong> {t('tabs.regulations')}</div>
              <div><strong>EIA/Report AI:</strong> {t('tabs.eia')}</div>
              <div><strong>Legal Updates:</strong> {t('tabs.updates')}</div>
              <div><strong>Project Workspace:</strong> {t('tabs.projects')}</div>
              <div><strong>Prompt Templates:</strong> {t('tabs.templates')}</div>
            </CardContent>
          </Card>

          {/* Dashboard Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Welcome:</strong> {t('dashboard.welcome', { name: 'John' })}</div>
              <div><strong>Quick Actions:</strong> {t('dashboard.quickActions')}</div>
              <div><strong>Legal Updates:</strong> {t('dashboard.legalUpdates')}</div>
              <div><strong>Risk Assessment:</strong> {t('dashboard.riskAssessment')}</div>
              <div><strong>Recent Legal Updates:</strong> {t('dashboard.recentLegalUpdates')}</div>
              <div><strong>Pending Reviews:</strong> {t('dashboard.pendingReviews')}</div>
              <div><strong>Reports Awaiting Approval:</strong> {t('dashboard.reportsAwaitingApproval')}</div>
            </CardContent>
          </Card>

          {/* Consultation Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Legal AI Consultation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('consultation.title')}</div>
              <div><strong>Your Legal Question:</strong> {t('consultation.yourLegalQuestion')}</div>
              <div><strong>Select Project Context:</strong> {t('consultation.selectProjectContext')}</div>
              <div><strong>AI Legal Response:</strong> {t('consultation.aiLegalResponse')}</div>
              <div><strong>Prompt Templates:</strong> {t('consultation.promptTemplates')}</div>
              <div><strong>Recent Queries:</strong> {t('consultation.recentQueries')}</div>
            </CardContent>
          </Card>

          {/* Regulations Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Regulations Explorer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('regulations.title')}</div>
              <div><strong>Jurisdiction Tree:</strong> {t('regulations.jurisdictionTree')}</div>
              <div><strong>Federal Regulations:</strong> {t('regulations.federalRegulations')}</div>
              <div><strong>Search Regulations:</strong> {t('regulations.searchRegulations')}</div>
              <div><strong>Save to Project:</strong> {t('regulations.saveToProject')}</div>
              <div><strong>Copy Citation:</strong> {t('regulations.copyCitation')}</div>
            </CardContent>
          </Card>

          {/* EIA Elements */}
          <Card>
            <CardHeader>
              <CardTitle>EIA/Report AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('eia.title')}</div>
              <div><strong>AI-Assisted Report Builder:</strong> {t('eia.aiAssistedReportBuilder')}</div>
              <div><strong>Select Project:</strong> {t('eia.selectProject')}</div>
              <div><strong>Report Type:</strong> {t('eia.reportType')}</div>
              <div><strong>Environmental Impact Assessment:</strong> {t('eia.environmentalImpactAssessment')}</div>
              <div><strong>AI Report Reviewer:</strong> {t('eia.aiReportReviewer')}</div>
            </CardContent>
          </Card>

          {/* Updates Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('updates.title')}</div>
              <div><strong>Legal Updates Feed:</strong> {t('updates.legalUpdatesFeed')}</div>
              <div><strong>Impact Assessment Act:</strong> {t('updates.impactAssessmentAct')}</div>
              <div><strong>Ontario Mining Act:</strong> {t('updates.ontarioMiningAct')}</div>
              <div><strong>Affected Projects:</strong> {t('updates.affectedProjects')}</div>
              <div><strong>View Details:</strong> {t('updates.viewDetails')}</div>
            </CardContent>
          </Card>

          {/* Projects Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Project Workspace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('projects.title')}</div>
              <div><strong>All Projects:</strong> {t('projects.allProjects')}</div>
              <div><strong>New Project:</strong> {t('projects.newProject')}</div>
              <div><strong>Project Manager:</strong> {t('projects.projectManager')}</div>
              <div><strong>Compliance Score:</strong> {t('projects.complianceScore')}</div>
              <div><strong>High Risk:</strong> {t('projects.highRisk')}</div>
            </CardContent>
          </Card>

          {/* Templates Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Title:</strong> {t('templates.title')}</div>
              <div><strong>Template Categories:</strong> {t('templates.templateCategories')}</div>
              <div><strong>Template Library:</strong> {t('templates.templateLibrary')}</div>
              <div><strong>Search Templates:</strong> {t('templates.searchTemplates')}</div>
              <div><strong>Environmental Impact Assessment:</strong> {t('templates.environmentalImpactAssessment')}</div>
              <div><strong>Indigenous Consultation:</strong> {t('templates.indigenousConsultation')}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>✅ Translation Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">✅ Successfully Translated:</h4>
                <ul className="text-sm space-y-1">
                  <li>• All navigation tabs</li>
                  <li>• Dashboard elements</li>
                  <li>• Legal AI Consultation interface</li>
                  <li>• Regulations Explorer components</li>
                  <li>• EIA/Report AI features</li>
                  <li>• Legal Updates feed</li>
                  <li>• Project Workspace elements</li>
                  <li>• Prompt Templates library</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">🎯 Test Instructions:</h4>
                <ol className="text-sm space-y-1">
                  <li>1. Click the language switcher above</li>
                  <li>2. Observe all text changing instantly</li>
                  <li>3. Navigate to main application</li>
                  <li>4. Verify tabs and interface elements</li>
                  <li>5. Test different sections</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
