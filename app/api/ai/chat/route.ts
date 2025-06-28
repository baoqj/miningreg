import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateText, analyzeLegalDocument } from '@/lib/huggingface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      message,
      type = 'general',
      jurisdiction = 'federal',
      language = 'en',
      projectId,
      consultationId,
      context
    } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // 记录开始时间
    const startTime = Date.now()

    let response
    let sources: any[] = []

    // 根据类型选择不同的处理方式
    switch (type) {
      case 'legal_analysis':
        // 法律文档分析
        if (context) {
          response = await analyzeLegalDocument(
            context,
            message,
            jurisdiction,
            language as 'en' | 'fr'
          )
        } else {
          response = await generateText(message, {
            language: language as 'en' | 'fr',
            max_tokens: 1500,
            temperature: 0.3
          })
        }
        break

      case 'eia_consultation':
        // EIA咨询
        const eiaPrompt = language === 'fr'
          ? `En tant qu'expert en évaluation d'impact environnemental pour l'industrie minière canadienne, veuillez répondre à la question suivante dans le contexte de la juridiction ${jurisdiction}:\n\n${message}`
          : `As an environmental impact assessment expert for the Canadian mining industry, please answer the following question in the context of ${jurisdiction} jurisdiction:\n\n${message}`
        
        response = await generateText(eiaPrompt, {
          language: language as 'en' | 'fr',
          max_tokens: 1500,
          temperature: 0.4
        })
        break

      case 'permit_guidance':
        // 许可证指导
        const permitPrompt = language === 'fr'
          ? `En tant que consultant en réglementation minière, fournissez des conseils sur les exigences de permis pour la question suivante dans la juridiction ${jurisdiction}:\n\n${message}`
          : `As a mining regulatory consultant, provide guidance on permit requirements for the following question in ${jurisdiction} jurisdiction:\n\n${message}`
        
        response = await generateText(permitPrompt, {
          language: language as 'en' | 'fr',
          max_tokens: 1200,
          temperature: 0.3
        })
        break

      case 'indigenous_consultation':
        // 原住民咨询
        const indigenousPrompt = language === 'fr'
          ? `En tant qu'expert en consultation des peuples autochtones dans le secteur minier canadien, veuillez répondre à la question suivante:\n\n${message}`
          : `As an expert in Indigenous consultation for the Canadian mining sector, please answer the following question:\n\n${message}`
        
        response = await generateText(indigenousPrompt, {
          language: language as 'en' | 'fr',
          max_tokens: 1500,
          temperature: 0.4
        })
        break

      default:
        // 一般对话
        response = await generateText(message, {
          language: language as 'en' | 'fr',
          max_tokens: 1000,
          temperature: 0.7
        })
    }

    // 计算处理时间
    const processingTime = Date.now() - startTime

    // 保存对话记录到数据库
    try {
      // 创建或获取对话
      let conversation = null
      if (consultationId) {
        // 查找现有对话
        conversation = await prisma.conversation.findFirst({
          where: {
            userId: session.user.id,
            consultationId: consultationId
          }
        })
      }

      if (!conversation) {
        // 创建新对话
        conversation = await prisma.conversation.create({
          data: {
            title: message.substring(0, 100),
            type: type === 'legal_analysis' ? 'LEGAL_QUERY' : 'GENERAL_CHAT',
            userId: session.user.id,
            projectId: projectId || null,
            consultationId: consultationId || null
          }
        })
      }

      // 保存用户消息
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: message
        }
      })

      // 保存AI回复
      await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: response.content,
          metadata: {
            model: response.model,
            usage: response.usage,
            processingTime,
            type,
            jurisdiction,
            language
          }
        }
      })

      // 如果有consultationId，也保存到legal_queries表
      if (consultationId) {
        await prisma.legalQuery.create({
          data: {
            question: message,
            context: context || null,
            jurisdiction,
            category: type,
            response: response.content,
            confidence: 0.85, // 默认置信度
            sources: response.sources ? { sources: response.sources } : null,
            processingTime,
            consultationId,
            projectId: projectId || null,
            userId: session.user.id
          }
        })
      }
    } catch (dbError) {
      console.error('Database save error:', dbError)
      // 不影响API响应，只记录错误
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response.content,
        model: response.model,
        usage: response.usage,
        sources: response.sources || [],
        processingTime,
        type,
        jurisdiction,
        language
      }
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 获取对话历史
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
    const conversationId = searchParams.get('conversationId')
    const projectId = searchParams.get('projectId')
    const consultationId = searchParams.get('consultationId')
    const limit = parseInt(searchParams.get('limit') || '50')

    let whereClause: any = {
      userId: session.user.id
    }

    if (conversationId) {
      whereClause.id = conversationId
    }
    if (projectId) {
      whereClause.projectId = projectId
    }
    if (consultationId) {
      whereClause.consultationId = consultationId
    }

    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: conversations
    })

  } catch (error) {
    console.error('Get Conversations Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
