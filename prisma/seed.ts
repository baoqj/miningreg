import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 创建默认组织
  const defaultOrg = await prisma.organization.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Organization',
      slug: 'default',
      description: 'Default organization for individual users',
      industry: 'consulting',
      size: 'SMALL',
      country: 'CA',
      status: 'ACTIVE'
    }
  })
  console.log('✅ Default organization created')

  // 创建系统用户
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@miningreg.com' },
    update: {},
    create: {
      email: 'system@miningreg.com',
      name: 'System User',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      preferences: {
        create: {
          language: 'en',
          jurisdiction: 'federal',
          timezone: 'America/Toronto',
          emailNotifications: false,
          theme: 'light'
        }
      }
    }
  })
  console.log('✅ System user created')

  // 创建法律知识库基础数据
  const legalDocs = [
    {
      id: 'kb_impact_assessment_act',
      title: 'Impact Assessment Act',
      content: 'An Act respecting impact assessments of certain activities and the prevention of significant adverse environmental effects...',
      type: 'ACT' as const,
      jurisdiction: 'federal',
      language: 'en',
      source: 'https://laws-lois.justice.gc.ca/eng/acts/I-2.75/',
      effectiveDate: new Date('2019-08-28'),
      tags: ['environmental', 'impact assessment', 'federal']
    },
    {
      id: 'kb_fisheries_act',
      title: 'Fisheries Act',
      content: 'An Act respecting fisheries...',
      type: 'ACT' as const,
      jurisdiction: 'federal',
      language: 'en',
      source: 'https://laws-lois.justice.gc.ca/eng/acts/F-14/',
      effectiveDate: new Date('1985-01-01'),
      tags: ['fisheries', 'environmental', 'federal']
    },
    {
      id: 'kb_ontario_mining_act',
      title: 'Ontario Mining Act',
      content: 'An Act respecting mining...',
      type: 'ACT' as const,
      jurisdiction: 'ontario',
      language: 'en',
      source: 'https://www.ontario.ca/laws/statute/90m14',
      effectiveDate: new Date('1990-01-01'),
      tags: ['mining', 'ontario', 'provincial']
    },
    {
      id: 'kb_impact_assessment_act_fr',
      title: 'Loi sur l\'évaluation d\'impact',
      content: 'Loi concernant l\'évaluation d\'impact de certaines activités et la prévention d\'effets environnementaux négatifs importants...',
      type: 'ACT' as const,
      jurisdiction: 'federal',
      language: 'fr',
      source: 'https://laws-lois.justice.gc.ca/fra/lois/I-2.75/',
      effectiveDate: new Date('2019-08-28'),
      tags: ['environnemental', 'évaluation impact', 'fédéral']
    }
  ]

  for (const doc of legalDocs) {
    await prisma.legalKnowledgeBase.upsert({
      where: { id: doc.id },
      update: {},
      create: doc
    })
  }
  console.log('✅ Legal knowledge base documents created')

  // 创建默认Prompt模板
  const promptTemplates = [
    {
      id: 'template_eia_scoping',
      name: 'EIA Scoping Requirements',
      description: 'Template for determining EIA scoping requirements under the Impact Assessment Act',
      category: 'EIA' as const,
      jurisdiction: 'federal',
      language: 'en',
      content: 'Based on the project details provided: {project_name} located in {location}, please analyze the EIA scoping requirements under the Impact Assessment Act. Consider the following factors: project type ({project_type}), scale ({project_scale}), and potential environmental impacts ({potential_impacts}).',
      variables: {
        project_name: 'string',
        location: 'string',
        project_type: 'string',
        project_scale: 'string',
        potential_impacts: 'array'
      },
      tags: ['eia', 'scoping', 'federal', 'impact assessment'],
      isPublic: true,
      complexity: 'INTERMEDIATE' as const,
      userId: systemUser.id
    },
    {
      id: 'template_indigenous_consultation',
      name: 'Indigenous Consultation Requirements',
      description: 'Template for analyzing Indigenous consultation requirements',
      category: 'INDIGENOUS' as const,
      jurisdiction: 'federal',
      language: 'en',
      content: 'For the proposed {project_type} project "{project_name}" in {traditional_territory}, please outline the Indigenous consultation requirements. Consider: consultation level ({consultation_level}), timeline ({timeline}), and specific requirements for this jurisdiction ({jurisdiction}).',
      variables: {
        project_name: 'string',
        project_type: 'string',
        traditional_territory: 'string',
        consultation_level: 'string',
        timeline: 'string',
        jurisdiction: 'string'
      },
      tags: ['indigenous', 'consultation', 'rights', 'engagement'],
      isPublic: true,
      complexity: 'ADVANCED' as const,
      userId: systemUser.id
    },
    {
      id: 'template_permit_checklist',
      name: 'Mining Permit Checklist',
      description: 'Template for generating mining permit application checklist',
      category: 'PERMITTING' as const,
      jurisdiction: 'federal',
      language: 'en',
      content: 'Generate a comprehensive permit application checklist for a {mining_type} operation in {jurisdiction}. Include federal, provincial, and municipal requirements. Project details: {project_details}.',
      variables: {
        mining_type: 'string',
        jurisdiction: 'string',
        project_details: 'string'
      },
      tags: ['permitting', 'mining', 'checklist', 'compliance'],
      isPublic: true,
      complexity: 'BEGINNER' as const,
      userId: systemUser.id
    },
    {
      id: 'template_eia_scoping_fr',
      name: 'Exigences de cadrage d\'EIE',
      description: 'Modèle pour déterminer les exigences de cadrage d\'EIE sous la Loi sur l\'évaluation d\'impact',
      category: 'EIA' as const,
      jurisdiction: 'federal',
      language: 'fr',
      content: 'Basé sur les détails du projet fournis: {project_name} situé à {location}, veuillez analyser les exigences de cadrage d\'EIE sous la Loi sur l\'évaluation d\'impact. Considérez les facteurs suivants: type de projet ({project_type}), échelle ({project_scale}), et impacts environnementaux potentiels ({potential_impacts}).',
      variables: {
        project_name: 'string',
        location: 'string',
        project_type: 'string',
        project_scale: 'string',
        potential_impacts: 'array'
      },
      tags: ['eie', 'cadrage', 'fédéral', 'évaluation impact'],
      isPublic: true,
      complexity: 'INTERMEDIATE' as const,
      userId: systemUser.id
    }
  ]

  for (const template of promptTemplates) {
    await prisma.promptTemplate.upsert({
      where: { id: template.id },
      update: {},
      create: template
    })
  }
  console.log('✅ Prompt templates created')

  // 创建示例项目
  const demoProject = await prisma.project.upsert({
    where: { 
      organizationId_slug: {
        organizationId: defaultOrg.id,
        slug: 'demo-copper-mine'
      }
    },
    update: {},
    create: {
      name: 'Demo Copper Mine Project',
      slug: 'demo-copper-mine',
      description: 'A demonstration copper mining project for testing and training purposes',
      type: 'MINING',
      status: 'PLANNING',
      priority: 'MEDIUM',
      jurisdiction: 'federal',
      location: 'Northern Ontario, Canada',
      coordinates: { lat: 49.2827, lng: -123.1207 },
      startDate: new Date('2024-06-01'),
      endDate: new Date('2027-12-31'),
      budget: 50000000,
      complianceScore: 0.0,
      riskLevel: 'MEDIUM',
      organizationId: defaultOrg.id,
      createdBy: systemUser.id
    }
  })
  console.log('✅ Demo project created')

  // 创建项目里程碑
  const milestones = [
    {
      title: 'Environmental Impact Assessment',
      description: 'Complete federal EIA process',
      dueDate: new Date('2024-12-31'),
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      projectId: demoProject.id
    },
    {
      title: 'Indigenous Consultation',
      description: 'Conduct meaningful consultation with Indigenous communities',
      dueDate: new Date('2024-09-30'),
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      projectId: demoProject.id
    },
    {
      title: 'Permit Applications',
      description: 'Submit all required federal and provincial permits',
      dueDate: new Date('2025-03-31'),
      status: 'PENDING' as const,
      priority: 'MEDIUM' as const,
      projectId: demoProject.id
    }
  ]

  for (const milestone of milestones) {
    await prisma.projectMilestone.create({
      data: milestone
    })
  }
  console.log('✅ Project milestones created')

  // 创建示例文档
  const demoDocument = await prisma.document.create({
    data: {
      title: 'Project Overview Document',
      description: 'Initial project overview and scoping document',
      type: 'GENERAL',
      category: 'planning',
      jurisdiction: 'federal',
      language: 'en',
      version: '1.0',
      status: 'DRAFT',
      content: 'This is a demonstration document for the MiningReg system...',
      metadata: {
        author: 'System',
        department: 'Planning',
        classification: 'Internal'
      },
      tags: ['demo', 'planning', 'overview'],
      isPublic: false,
      projectId: demoProject.id,
      userId: systemUser.id
    }
  })
  console.log('✅ Demo document created')

  // 创建示例咨询
  const demoConsultation = await prisma.consultation.create({
    data: {
      title: 'EIA Requirements Consultation',
      description: 'Consultation regarding federal EIA requirements for copper mining',
      type: 'EIA',
      jurisdiction: 'federal',
      priority: 'MEDIUM',
      status: 'OPEN',
      projectId: demoProject.id,
      userId: systemUser.id
    }
  })
  console.log('✅ Demo consultation created')

  // 创建示例法律查询
  await prisma.legalQuery.create({
    data: {
      question: 'What are the federal EIA requirements for a copper mining project with production capacity of 10,000 tonnes per day?',
      context: 'New copper mining project in Northern Ontario with significant environmental considerations',
      jurisdiction: 'federal',
      category: 'environmental_assessment',
      response: 'Based on the Impact Assessment Act and Physical Activities Regulations, a copper mining project with production capacity of 10,000 tonnes per day would require a federal environmental impact assessment...',
      confidence: 0.95,
      sources: {
        documents: [
          {
            id: 'kb_impact_assessment_act',
            title: 'Impact Assessment Act',
            relevance: 0.95
          }
        ]
      },
      processingTime: 2500,
      consultationId: demoConsultation.id,
      projectId: demoProject.id,
      userId: systemUser.id
    }
  })
  console.log('✅ Demo legal query created')

  console.log('🎉 Database seeding completed successfully!')
  
  // 输出统计信息
  const stats = {
    organizations: await prisma.organization.count(),
    users: await prisma.user.count(),
    legalKnowledgeBase: await prisma.legalKnowledgeBase.count(),
    promptTemplates: await prisma.promptTemplate.count(),
    projects: await prisma.project.count(),
    documents: await prisma.document.count(),
    consultations: await prisma.consultation.count(),
    legalQueries: await prisma.legalQuery.count()
  }
  
  console.log('\n📊 Database Statistics:')
  console.log(`   Organizations: ${stats.organizations}`)
  console.log(`   Users: ${stats.users}`)
  console.log(`   Legal Documents: ${stats.legalKnowledgeBase}`)
  console.log(`   Prompt Templates: ${stats.promptTemplates}`)
  console.log(`   Projects: ${stats.projects}`)
  console.log(`   Documents: ${stats.documents}`)
  console.log(`   Consultations: ${stats.consultations}`)
  console.log(`   Legal Queries: ${stats.legalQueries}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
