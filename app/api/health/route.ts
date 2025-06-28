import { NextRequest, NextResponse } from 'next/server'
import { healthCheck } from '@/lib/huggingface'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const checks: Record<string, any> = {}

  try {
    // 检查数据库连接
    try {
      await prisma.$queryRaw`SELECT 1`
      checks.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime
      }
    } catch (dbError) {
      checks.database = {
        status: 'unhealthy',
        error: dbError instanceof Error ? dbError.message : 'Database connection failed',
        responseTime: Date.now() - startTime
      }
    }

    // 检查Hugging Face API
    const hfStartTime = Date.now()
    try {
      const hfHealthy = await healthCheck()
      checks.huggingface = {
        status: hfHealthy ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - hfStartTime,
        apiKey: process.env.HUGGINGFACE_API_KEY ? 'configured' : 'missing'
      }
    } catch (hfError) {
      checks.huggingface = {
        status: 'unhealthy',
        error: hfError instanceof Error ? hfError.message : 'Hugging Face API failed',
        responseTime: Date.now() - hfStartTime,
        apiKey: process.env.HUGGINGFACE_API_KEY ? 'configured' : 'missing'
      }
    }

    // 检查环境变量
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'HUGGINGFACE_API_KEY'
    ]

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    checks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      missingVariables: missingEnvVars,
      nodeVersion: process.version,
      platform: process.platform
    }

    // 检查Redis连接（如果配置了）
    if (process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL) {
      const redisStartTime = Date.now()
      try {
        // 这里应该添加Redis连接检查
        // 暂时标记为配置状态
        checks.redis = {
          status: 'configured',
          responseTime: Date.now() - redisStartTime,
          type: process.env.UPSTASH_REDIS_REST_URL ? 'upstash' : 'standard'
        }
      } catch (redisError) {
        checks.redis = {
          status: 'unhealthy',
          error: redisError instanceof Error ? redisError.message : 'Redis connection failed',
          responseTime: Date.now() - redisStartTime
        }
      }
    } else {
      checks.redis = {
        status: 'not_configured'
      }
    }

    // 总体健康状态
    const allHealthy = Object.values(checks).every(check => 
      check.status === 'healthy' || check.status === 'configured' || check.status === 'not_configured'
    )

    const totalResponseTime = Date.now() - startTime

    const healthStatus = {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      totalResponseTime,
      checks
    }

    return NextResponse.json(healthStatus, {
      status: allHealthy ? 200 : 503
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      totalResponseTime: Date.now() - startTime,
      checks
    }, {
      status: 503
    })
  } finally {
    await prisma.$disconnect()
  }
}

// 简单的ping端点
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 })
}
