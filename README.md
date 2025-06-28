# 🏛️ MiningReg - Canadian Mining Regulatory AI Legal Assistant

MiningReg是一个专为加拿大采矿行业设计的AI法律助手系统，提供智能的法规咨询、环境影响评估(EIA)支持、项目管理和文档分析功能。

## 🌟 核心功能

### 🤖 AI法律咨询
- **智能问答**: 基于Hugging Face模型的法律问题解答
- **多语言支持**: 英语和法语双语服务
- **管辖区专业化**: 联邦、省级和市级法规覆盖
- **上下文感知**: 结合项目背景提供精准建议

### 📊 项目管理
- **项目生命周期管理**: 从勘探到关闭的全流程支持
- **里程碑跟踪**: 关键节点监控和提醒
- **合规评分**: 实时合规状态评估
- **风险管理**: 多维度风险评估和预警

### 📄 文档管理与分析
- **智能文档处理**: 自动分类、标签和索引
- **语义搜索**: 基于向量嵌入的精准搜索
- **版本控制**: 完整的文档版本管理
- **权限管理**: 细粒度的访问控制

### 🌍 环境影响评估(EIA)
- **AI报告生成**: 自动化EIA报告创建
- **模板系统**: 标准化的报告模板
- **多语言报告**: 英法双语报告支持
- **合规检查**: 自动合规性验证

### 👥 团队协作
- **组织管理**: 多层级组织结构支持
- **角色权限**: 基于角色的访问控制
- **实时协作**: 团队成员实时协作
- **审计日志**: 完整的操作记录

## 🚀 技术栈

### 前端
- **Next.js 15**: React全栈框架
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **Radix UI**: 无障碍的UI组件库

### 后端
- **Next.js API Routes**: 服务端API
- **Prisma**: 现代数据库ORM
- **NextAuth.js**: 身份认证解决方案
- **Hugging Face**: AI模型服务

### 数据库
- **PostgreSQL**: 主数据库(Supabase)
- **MongoDB**: 文档存储(Atlas)
- **Redis**: 缓存和会话(Upstash)
- **Pinecone**: 向量数据库

### 部署
- **Vercel**: 应用部署平台
- **GitHub Actions**: CI/CD流水线
- **Vercel Analytics**: 性能监控

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn
- Git

### 快速开始

1. **克隆仓库**
```bash
git clone https://github.com/baoqj/miningreg.git
cd miningreg
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要的API密钥
```

4. **设置数据库**
```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 导入种子数据
npm run db:seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 必需的环境变量

```bash
# 数据库
DATABASE_URL="postgresql://..."
MONGODB_URI="mongodb+srv://..."
REDIS_URL="redis://..."

# AI服务
HUGGINGFACE_API_KEY="hf_..."

# 身份认证
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 🌐 部署指南

### Vercel部署

1. **连接GitHub仓库**
   - 访问 [Vercel](https://vercel.com)
   - 导入GitHub仓库
   - 配置环境变量

2. **数据库服务配置**
   - **Supabase**: PostgreSQL数据库
   - **MongoDB Atlas**: 文档数据库
   - **Upstash**: Redis缓存
   - **Pinecone**: 向量数据库

3. **环境变量配置**
   - 在Vercel项目设置中添加所有必需的环境变量
   - 确保生产环境和开发环境的配置一致

### 自动部署

推送到main分支将自动触发生产部署：

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## 📚 API文档

### AI聊天API
```
POST /api/ai/chat
```
支持多种对话类型：
- `general`: 一般对话
- `legal_analysis`: 法律分析
- `eia_consultation`: EIA咨询
- `permit_guidance`: 许可证指导
- `indigenous_consultation`: 原住民咨询

### 文档嵌入API
```
POST /api/ai/embeddings
PUT /api/ai/embeddings (批量处理)
GET /api/ai/embeddings (相似度搜索)
```

### 报告生成API
```
POST /api/ai/generate-report
GET /api/ai/generate-report
```

### 健康检查API
```
GET /api/health
```

## 🔧 开发工具

### 数据库管理
```bash
# 查看数据库
npx prisma studio

# 重置数据库
npm run db:reset

# 生成迁移
npx prisma migrate dev
```

### 代码质量
```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您遇到问题或有疑问：

1. 查看 [Issues](https://github.com/baoqj/miningreg/issues)
2. 创建新的Issue
3. 联系开发团队

## 🎯 路线图

- [ ] 移动端应用开发
- [ ] 更多AI模型集成
- [ ] 高级分析仪表板
- [ ] 企业级SSO集成
- [ ] 区块链合规追踪
- [ ] 政府API集成

---

**MiningReg** - 让加拿大采矿法规咨询变得智能、高效、可靠。
