import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateEIASection, generateText } from '@/lib/huggingface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      projectId,
      reportType = 'EIA',
      sections,
      language = 'en',
      jurisdiction = 'federal'
    } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // 验证项目存在且用户有权限
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { createdBy: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id,
                status: 'ACTIVE'
              }
            }
          }
        ]
      },
      include: {
        organization: true,
        milestones: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // 创建报告记录
    const report = await prisma.report.create({
      data: {
        title: `${reportType} Report - ${project.name}`,
        type: reportType as any,
        status: 'DRAFT',
        jurisdiction,
        language,
        content: {},
        sections: {},
        progress: 0,
        projectId,
        userId: session.user.id
      }
    })

    // 准备项目数据
    const projectData = {
      name: project.name,
      description: project.description,
      type: project.type,
      location: project.location,
      coordinates: project.coordinates,
      jurisdiction: project.jurisdiction,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      organization: project.organization.name,
      milestones: project.milestones.map(m => ({
        title: m.title,
        description: m.description,
        dueDate: m.dueDate,
        status: m.status
      }))
    }

    // 默认EIA报告章节
    const defaultSections = sections || [
      'executive_summary',
      'project_description',
      'environmental_baseline',
      'impact_assessment',
      'mitigation_measures',
      'monitoring_program',
      'public_consultation',
      'indigenous_consultation',
      'cumulative_effects',
      'conclusion'
    ]

    const generatedSections: Record<string, any> = {}
    let completedSections = 0

    // 生成各个章节
    for (const sectionType of defaultSections) {
      try {
        console.log(`Generating section: ${sectionType}`)
        
        const sectionResponse = await generateEIASection(
          sectionType,
          projectData,
          language as 'en' | 'fr'
        )

        generatedSections[sectionType] = {
          title: getSectionTitle(sectionType, language as 'en' | 'fr'),
          content: sectionResponse.content,
          generatedAt: new Date().toISOString(),
          model: sectionResponse.model,
          usage: sectionResponse.usage
        }

        completedSections++

        // 更新进度
        const progress = (completedSections / defaultSections.length) * 100
        await prisma.report.update({
          where: { id: report.id },
          data: {
            sections: generatedSections,
            progress,
            status: progress === 100 ? 'REVIEW' : 'IN_PROGRESS'
          }
        })

      } catch (sectionError) {
        console.error(`Error generating section ${sectionType}:`, sectionError)
        generatedSections[sectionType] = {
          title: getSectionTitle(sectionType, language as 'en' | 'fr'),
          content: `Error generating this section: ${sectionError instanceof Error ? sectionError.message : 'Unknown error'}`,
          error: true,
          generatedAt: new Date().toISOString()
        }
      }
    }

    // 生成完整报告内容
    const fullReportContent = {
      metadata: {
        title: report.title,
        projectName: project.name,
        organization: project.organization.name,
        generatedAt: new Date().toISOString(),
        language,
        jurisdiction,
        reportType
      },
      sections: generatedSections
    }

    // 最终更新报告
    const finalReport = await prisma.report.update({
      where: { id: report.id },
      data: {
        content: fullReportContent,
        sections: generatedSections,
        progress: 100,
        status: 'REVIEW'
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        reportId: finalReport.id,
        title: finalReport.title,
        progress: finalReport.progress,
        status: finalReport.status,
        sectionsGenerated: Object.keys(generatedSections).length,
        content: fullReportContent
      }
    })

  } catch (error) {
    console.error('Report Generation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 获取报告状态
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('reportId')
    const projectId = searchParams.get('projectId')

    if (!reportId && !projectId) {
      return NextResponse.json(
        { error: 'Report ID or Project ID is required' },
        { status: 400 }
      )
    }

    let whereClause: any = {
      userId: session.user.id
    }

    if (reportId) {
      whereClause.id = reportId
    } else if (projectId) {
      whereClause.projectId = projectId
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: reports
    })

  } catch (error) {
    console.error('Get Reports Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// 辅助函数：获取章节标题
function getSectionTitle(sectionType: string, language: 'en' | 'fr'): string {
  const titles: Record<string, { en: string; fr: string }> = {
    executive_summary: {
      en: 'Executive Summary',
      fr: 'Résumé exécutif'
    },
    project_description: {
      en: 'Project Description',
      fr: 'Description du projet'
    },
    environmental_baseline: {
      en: 'Environmental Baseline',
      fr: 'État de référence environnemental'
    },
    impact_assessment: {
      en: 'Environmental Impact Assessment',
      fr: 'Évaluation des impacts environnementaux'
    },
    mitigation_measures: {
      en: 'Mitigation Measures',
      fr: 'Mesures d\'atténuation'
    },
    monitoring_program: {
      en: 'Environmental Monitoring Program',
      fr: 'Programme de surveillance environnementale'
    },
    public_consultation: {
      en: 'Public Consultation',
      fr: 'Consultation publique'
    },
    indigenous_consultation: {
      en: 'Indigenous Consultation',
      fr: 'Consultation des peuples autochtones'
    },
    cumulative_effects: {
      en: 'Cumulative Effects Assessment',
      fr: 'Évaluation des effets cumulatifs'
    },
    conclusion: {
      en: 'Conclusion and Recommendations',
      fr: 'Conclusion et recommandations'
    }
  }

  return titles[sectionType]?.[language] || sectionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
