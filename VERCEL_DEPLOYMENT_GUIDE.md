# 🚀 MiningReg Vercel部署完整指南

## 📋 部署前准备

### 1. GitHub仓库设置
您的仓库已创建：`https://github.com/baoqj/miningreg.git`

### 2. 必需的API密钥和服务

在开始部署之前，请准备以下服务的API密钥：

#### 🤖 Hugging Face API
1. 访问 [Hugging Face](https://huggingface.co/settings/tokens)
2. 创建新的API Token
3. 复制token（格式：`hf_xxxxxxxxxx`）

#### 🗄️ 数据库服务

**Supabase (PostgreSQL)**
1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取数据库URL：`postgresql://postgres:[password]@[host]:5432/postgres`

**MongoDB Atlas**
1. 访问 [MongoDB Atlas](https://cloud.mongodb.com)
2. 创建免费集群
3. 获取连接字符串：`mongodb+srv://[username]:[password]@[cluster].mongodb.net/miningreg`

**Upstash Redis**
1. 访问 [Upstash](https://upstash.com)
2. 创建Redis数据库
3. 获取REST URL和Token

**Pinecone (可选)**
1. 访问 [Pinecone](https://pinecone.io)
2. 创建索引
3. 获取API密钥和环境信息

#### 🔐 OAuth认证

**Google OAuth**
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建OAuth 2.0客户端ID
3. 添加授权重定向URI：`https://your-domain.vercel.app/api/auth/callback/google`

## 🌐 Vercel部署步骤

### 第1步：连接GitHub仓库

1. 访问 [Vercel](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 输入仓库URL：`https://github.com/baoqj/miningreg`
5. 点击 **"Import"**

### 第2步：配置项目设置

1. **Framework Preset**: 自动检测为 Next.js
2. **Root Directory**: 保持默认 `./`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

### 第3步：配置环境变量

在Vercel项目设置中添加以下环境变量：

#### 必需的环境变量

```bash
# AI服务
HUGGINGFACE_API_KEY=hf_your_huggingface_api_key

# 数据库
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/miningreg

# Redis缓存
UPSTASH_REDIS_REST_URL=https://[endpoint].upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# 身份认证
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_super_secret_key_min_32_chars

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 可选的环境变量

```bash
# 向量数据库
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=miningreg-vectors

# 文件存储
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# 监控
SENTRY_DSN=https://your_sentry_dsn
```

### 第4步：部署项目

1. 确认所有环境变量已配置
2. 点击 **"Deploy"**
3. 等待构建完成（通常需要2-5分钟）

### 第5步：初始化数据库

部署成功后，需要初始化数据库：

1. 在Vercel项目的 **Functions** 标签页中
2. 找到并运行数据库迁移（或使用Vercel CLI）

```bash
# 使用Vercel CLI
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

## 🔧 部署后配置

### 1. 域名设置

1. 在Vercel项目设置中点击 **"Domains"**
2. 添加自定义域名（可选）
3. 更新 `NEXTAUTH_URL` 环境变量为新域名

### 2. 更新OAuth重定向URI

在Google Cloud Console中更新OAuth重定向URI：
- 添加：`https://your-actual-domain.vercel.app/api/auth/callback/google`

### 3. 验证部署

访问以下端点验证部署：

```bash
# 健康检查
curl https://your-domain.vercel.app/api/health

# 应用首页
https://your-domain.vercel.app
```

## 🚨 常见问题解决

### 构建失败

**问题**: 构建过程中出现错误
**解决方案**:
1. 检查所有必需的环境变量是否已设置
2. 确认 `HUGGINGFACE_API_KEY` 格式正确
3. 验证数据库连接字符串

### 数据库连接失败

**问题**: 应用无法连接到数据库
**解决方案**:
1. 验证 `DATABASE_URL` 格式正确
2. 确认数据库服务器允许外部连接
3. 检查数据库用户权限

### Hugging Face API错误

**问题**: AI功能不工作
**解决方案**:
1. 验证 `HUGGINGFACE_API_KEY` 有效
2. 检查API配额是否用完
3. 确认模型名称正确

### OAuth认证失败

**问题**: Google登录不工作
**解决方案**:
1. 验证 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`
2. 确认重定向URI配置正确
3. 检查 `NEXTAUTH_URL` 设置

## 📊 监控和维护

### 1. 性能监控

Vercel自动提供：
- 函数执行时间
- 错误率统计
- 流量分析

### 2. 日志查看

在Vercel项目的 **Functions** 标签页查看：
- 实时日志
- 错误日志
- 性能指标

### 3. 自动部署

每次推送到main分支都会自动触发部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 🔄 更新部署

### 代码更新

1. 修改代码
2. 提交到GitHub
3. Vercel自动重新部署

### 环境变量更新

1. 在Vercel项目设置中修改环境变量
2. 触发重新部署（推送新提交或手动重新部署）

### 数据库架构更新

```bash
# 本地开发
npx prisma migrate dev --name your_migration_name

# 生产部署
npx prisma migrate deploy
```

## 📈 扩展配置

### 自定义域名

1. 在域名提供商处添加CNAME记录
2. 在Vercel中添加域名
3. 等待SSL证书自动配置

### CDN优化

Vercel自动提供：
- 全球CDN分发
- 自动图片优化
- 静态资源缓存

### 数据库扩展

根据使用量升级数据库计划：
- Supabase: Free → Pro
- MongoDB Atlas: M0 → M10+
- Upstash: Free → Pro

## ✅ 部署检查清单

- [ ] GitHub仓库已创建并推送代码
- [ ] Vercel项目已创建并连接仓库
- [ ] 所有必需环境变量已配置
- [ ] 数据库服务已设置并可访问
- [ ] Hugging Face API密钥已配置
- [ ] OAuth应用已创建并配置
- [ ] 首次部署成功完成
- [ ] 数据库已初始化和种子
- [ ] 健康检查端点返回正常
- [ ] 用户注册和登录功能正常
- [ ] AI聊天功能正常工作
- [ ] 文档上传和处理正常

## 🎉 部署完成

恭喜！您的MiningReg应用现在已经成功部署到Vercel。

**访问您的应用**: https://your-domain.vercel.app

**下一步**:
1. 测试所有核心功能
2. 邀请团队成员
3. 开始使用AI法律助手功能
4. 根据需要调整配置和扩展服务

如有问题，请查看Vercel日志或联系技术支持。
