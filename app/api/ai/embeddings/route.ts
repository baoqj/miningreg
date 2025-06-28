import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateEmbedding, generateEmbeddings } from '@/lib/huggingface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 生成单个文本的嵌入
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
    const { text, texts, documentId, model } = body

    if (!text && !texts) {
      return NextResponse.json(
        { error: 'Text or texts array is required' },
        { status: 400 }
      )
    }

    let embeddings: number[] | number[][]
    let processedCount: number

    if (texts && Array.isArray(texts)) {
      // 批量处理
      embeddings = await generateEmbeddings(texts, model)
      processedCount = texts.length
    } else {
      // 单个文本
      embeddings = await generateEmbedding(text, model)
      processedCount = 1
    }

    // 如果提供了documentId，保存到数据库
    if (documentId && !Array.isArray(embeddings)) {
      try {
        await prisma.documentEmbedding.create({
          data: {
            documentId,
            chunkIndex: 0,
            content: text,
            embedding: embeddings,
            metadata: {
              model: model || 'sentence-transformers/all-MiniLM-L6-v2',
              generatedAt: new Date().toISOString(),
              userId: session.user.id
            }
          }
        })
      } catch (dbError) {
        console.error('Database save error:', dbError)
        // 继续返回嵌入结果，即使数据库保存失败
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        embeddings,
        processedCount,
        model: model || 'sentence-transformers/all-MiniLM-L6-v2'
      }
    })

  } catch (error) {
    console.error('Embeddings API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate embeddings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 处理文档分块和嵌入生成
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { documentId, content, chunkSize = 1000, overlap = 200 } = body

    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      )
    }

    // 验证文档存在且用户有权限
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.user.id
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      )
    }

    // 文档分块
    const chunks = chunkText(content, chunkSize, overlap)
    
    // 生成嵌入
    const embeddings = await generateEmbeddings(chunks)

    // 删除现有的嵌入
    await prisma.documentEmbedding.deleteMany({
      where: { documentId }
    })

    // 保存新的嵌入
    const embeddingRecords = chunks.map((chunk, index) => ({
      documentId,
      chunkIndex: index,
      content: chunk,
      embedding: embeddings[index],
      metadata: {
        chunkSize,
        overlap,
        totalChunks: chunks.length,
        generatedAt: new Date().toISOString(),
        userId: session.user.id
      }
    }))

    await prisma.documentEmbedding.createMany({
      data: embeddingRecords
    })

    return NextResponse.json({
      success: true,
      data: {
        documentId,
        chunksProcessed: chunks.length,
        embeddingsGenerated: embeddings.length
      }
    })

  } catch (error) {
    console.error('Document Processing Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 搜索相似文档
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
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '10')
    const threshold = parseFloat(searchParams.get('threshold') || '0.7')

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // 生成查询嵌入
    const queryEmbedding = await generateEmbedding(query)

    // 这里应该使用向量数据库进行相似度搜索
    // 由于我们使用PostgreSQL，这里提供一个简化的实现
    // 在生产环境中，建议使用专门的向量数据库如Pinecone

    // 获取所有嵌入（在实际应用中应该优化这个查询）
    const embeddings = await prisma.documentEmbedding.findMany({
      include: {
        document: {
          select: {
            id: true,
            title: true,
            type: true,
            jurisdiction: true,
            language: true
          }
        }
      },
      take: 1000 // 限制数量以避免性能问题
    })

    // 计算余弦相似度
    const similarities = embeddings.map(embedding => {
      const similarity = cosineSimilarity(queryEmbedding, embedding.embedding)
      return {
        ...embedding,
        similarity
      }
    })

    // 过滤和排序
    const results = similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: results.map(result => ({
          documentId: result.documentId,
          chunkIndex: result.chunkIndex,
          content: result.content,
          similarity: result.similarity,
          document: result.document
        }))
      }
    })

  } catch (error) {
    console.error('Similarity Search Error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 辅助函数：文档分块
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)
    chunks.push(chunk)
    
    if (end === text.length) break
    start = end - overlap
  }

  return chunks
}

// 辅助函数：计算余弦相似度
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}
