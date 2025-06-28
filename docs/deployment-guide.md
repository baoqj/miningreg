# 🚀 MiningReg 完整部署指南

## 📋 部署架构概览

**推荐方案**: Vercel + 混合数据库服务
- **前端&API**: Vercel (Next.js 15)
- **关系型数据库**: Supabase (PostgreSQL)
- **文档数据库**: MongoDB Atlas
- **缓存数据库**: Upstash (Redis)
- **向量数据库**: Pinecone
- **文件存储**: Vercel Blob
- **监控**: Vercel Analytics + Sentry

## 🛠️ 第一步：数据库服务配置

### 1. Supabase (PostgreSQL) 配置

#### 创建项目
```bash
# 1. 访问 https://supabase.com
# 2. 创建新项目
# 3. 选择地区（推荐：US East 或 EU West）
# 4. 设置数据库密码
```

#### 配置数据库
```sql
-- 在Supabase SQL编辑器中执行
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 执行我们的初始化脚本
-- 复制 scripts/setup-database.sql 内容并执行
```

#### 获取连接信息
```bash
# 在Supabase项目设置中获取
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### 2. MongoDB Atlas 配置

#### 创建集群
```bash
# 1. 访问 https://cloud.mongodb.com
# 2. 创建免费集群（M0）或付费集群（M10+）
# 3. 选择地区（与Vercel地区匹配）
# 4. 配置网络访问（允许所有IP: 0.0.0.0/0）
# 5. 创建数据库用户
```

#### 初始化数据
```bash
# 使用MongoDB Compass或命令行
mongosh "mongodb+srv://[username]:[password]@[cluster].mongodb.net/miningreg"

# 执行初始化脚本
load('scripts/setup-mongodb.js')
```

#### 获取连接字符串
```bash
MONGODB_URI="mongodb+srv://[username]:[password]@[cluster].mongodb.net/miningreg?retryWrites=true&w=majority"
```

### 3. Upstash (Redis) 配置

#### 创建数据库
```bash
# 1. 访问 https://upstash.com
# 2. 创建Redis数据库
# 3. 选择地区（与Vercel匹配）
# 4. 选择免费或付费计划
```

#### 配置Redis
```bash
# 获取连接信息
UPSTASH_REDIS_REST_URL="https://[endpoint].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[token]"

# 或使用传统连接
REDIS_URL="redis://:[password]@[endpoint]:6379"
```

### 4. Pinecone (向量数据库) 配置

#### 创建索引
```bash
# 1. 访问 https://pinecone.io
# 2. 创建项目
# 3. 创建索引
#    - 名称: miningreg-vectors
#    - 维度: 1536 (OpenAI embeddings)
#    - 度量: cosine
#    - 云服务商: AWS/GCP
```

#### 获取API密钥
```bash
PINECONE_API_KEY="[your-api-key]"
PINECONE_ENVIRONMENT="[your-environment]"
PINECONE_INDEX_NAME="miningreg-vectors"
```

## 🔧 第二步：Vercel项目配置

### 1. 项目准备

#### 创建Vercel配置文件
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/update-legal-db",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### 更新package.json
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. 环境变量配置

#### 创建.env.example
```bash
# Database URLs
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
MONGODB_URI="mongodb+srv://..."
REDIS_URL="redis://..."

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Pinecone
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
PINECONE_INDEX_NAME="miningreg-vectors"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Vercel Blob
BLOB_READ_WRITE_TOKEN="..."

# Stripe (if using)
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Monitoring
SENTRY_DSN="https://..."
```

### 3. Vercel部署

#### 通过Git部署
```bash
# 1. 推送代码到GitHub
git add .
git commit -m "Initial deployment setup"
git push origin main

# 2. 在Vercel中导入项目
# 访问 https://vercel.com/new
# 选择GitHub仓库
# 配置环境变量
```

#### 通过CLI部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 设置环境变量
vercel env add DATABASE_URL
vercel env add MONGODB_URI
# ... 添加所有环境变量

# 重新部署
vercel --prod
```

## 📊 第三步：数据库迁移和初始化

### 1. Prisma迁移
```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 或使用迁移（推荐生产环境）
npx prisma migrate deploy
```

### 2. 初始化数据
```bash
# 创建种子脚本
# prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建默认组织
  await prisma.organization.upsert({
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
  
  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```bash
# 执行种子脚本
npx prisma db seed
```

## 🔍 第四步：监控和分析配置

### 1. Vercel Analytics
```bash
# 安装Vercel Analytics
npm install @vercel/analytics

# 在app/layout.tsx中添加
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Sentry错误监控
```bash
# 安装Sentry
npm install @sentry/nextjs

# 配置sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})

# 配置sentry.server.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 🚀 第五步：性能优化配置

### 1. 缓存策略
```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return cached as T
  
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}
```

### 2. 边缘函数配置
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 地理位置路由
  const country = request.geo?.country || 'US'
  const response = NextResponse.next()
  
  // 设置地区头部
  response.headers.set('x-user-country', country)
  
  return response
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*']
}
```

## 📈 第六步：CI/CD流水线

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔒 第七步：安全配置

### 1. 环境变量安全
```bash
# 在Vercel中设置敏感环境变量
# 不要在代码中硬编码任何密钥
# 使用Vercel的环境变量加密
```

### 2. CORS配置
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## ✅ 部署检查清单

- [ ] 所有数据库服务已配置并可访问
- [ ] 环境变量已在Vercel中设置
- [ ] Prisma迁移已执行
- [ ] 初始数据已导入
- [ ] 监控和分析已配置
- [ ] 缓存策略已实施
- [ ] CI/CD流水线已设置
- [ ] 安全配置已完成
- [ ] 域名已配置（如需要）
- [ ] SSL证书已启用

## 🎯 预期成本（月度）

### 开发环境
- Vercel: 免费
- Supabase: 免费
- MongoDB Atlas: 免费
- Upstash: 免费
- Pinecone: 免费
- **总计: $0/月**

### 生产环境
- Vercel Pro: $20
- Supabase Pro: $25
- MongoDB Atlas M10: $57
- Upstash Pro: $20
- Pinecone Starter: $70
- Vercel Blob: ~$50
- **总计: ~$242/月**

这个部署方案提供了企业级的性能、安全性和可扩展性，完美支持MiningReg系统的所有功能需求。
