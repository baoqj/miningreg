# 🗄️ MiningReg 数据库架构完整总结

## 📋 项目概述

MiningReg是一个加拿大采矿法规AI法律助手系统，采用混合数据库架构设计，支持项目管理、用户/团队管理、文档管理、RAG、LLM问答、prompt模板等核心功能。

## 🏗️ 架构设计原则

### 1. 混合数据库策略
- **关系型数据库 (PostgreSQL)**: 结构化业务数据
- **文档数据库 (MongoDB)**: 非结构化内容和复杂JSON数据
- **向量数据库 (Pinecone/Weaviate)**: 语义搜索和RAG检索
- **缓存数据库 (Redis)**: 会话管理、缓存和实时数据

### 2. 数据分离策略
- **元数据与内容分离**: PostgreSQL存储元数据，MongoDB存储内容
- **结构化与非结构化分离**: 不同类型数据使用最适合的存储方案
- **热数据与冷数据分离**: Redis缓存热数据，提高访问性能

## 📊 数据库详细设计

### 1. PostgreSQL - 关系型数据库

#### 核心业务表 (25个表)

**用户管理模块**:
- `users` - 用户基本信息
- `accounts` - OAuth账户关联
- `sessions` - 用户会话
- `user_preferences` - 用户偏好设置

**组织管理模块**:
- `organizations` - 组织信息
- `organization_members` - 组织成员关系

**项目管理模块**:
- `projects` - 项目基本信息
- `project_members` - 项目成员关系
- `project_milestones` - 项目里程碑

**文档管理模块**:
- `documents` - 文档元数据
- `document_embeddings` - 文档向量嵌入

**法律知识库模块**:
- `legal_knowledge_base` - 法律文档库
- `legal_embeddings` - 法律文档向量

**咨询查询模块**:
- `consultations` - 法律咨询
- `legal_queries` - 法律查询记录
- `conversations` - LLM对话历史
- `conversation_messages` - 对话消息

**模板报告模块**:
- `prompt_templates` - Prompt模板
- `reports` - 报告管理

**订阅计费模块**:
- `subscriptions` - 订阅信息

#### 关键特性
- **完整的关系约束**: 外键、唯一约束、检查约束
- **索引优化**: 25个核心索引，支持高效查询
- **触发器自动化**: 自动更新时间戳
- **视图聚合**: 项目统计、用户活动统计
- **行级安全**: 支持多租户数据隔离

### 2. MongoDB - 文档数据库

#### 核心集合 (5个集合)

**文档内容存储**:
```javascript
documents_content: {
  document_id: "唯一标识",
  title: "文档标题",
  content: "完整文档内容",
  sections: [章节结构],
  metadata: {管辖区、语言、类型等}
}
```

**LLM对话历史**:
```javascript
llm_conversations: {
  user_id: "用户ID",
  project_id: "项目ID",
  messages: [对话消息数组],
  model_info: {模型信息、token使用等}
}
```

**报告模板**:
```javascript
report_templates: {
  type: "报告类型",
  sections: [章节定义],
  prompts: [AI生成提示],
  variables: {模板变量}
}
```

**报告内容**:
```javascript
report_contents: {
  report_id: "报告ID",
  content: {完整报告内容},
  generation_history: [生成历史]
}
```

**AI生成历史**:
```javascript
ai_generation_history: {
  user_id: "用户ID",
  type: "生成类型",
  input: "输入内容",
  output: "生成结果",
  metadata: {性能指标等}
}
```

#### 关键特性
- **灵活的文档结构**: 支持复杂嵌套数据
- **全文搜索索引**: 支持多语言内容搜索
- **数据验证规则**: JSON Schema验证
- **自动分片**: 支持水平扩展

### 3. 向量数据库 - 语义搜索

#### 数据结构
```json
{
  "id": "doc_123_chunk_1",
  "vector": [1536维向量],
  "metadata": {
    "document_id": "文档ID",
    "chunk_index": "分块索引",
    "content": "文本内容",
    "jurisdiction": "管辖区",
    "language": "语言",
    "document_type": "文档类型"
  }
}
```

#### 索引策略
- **按管辖区分索引**: federal, ontario, bc, alberta
- **按文档类型分索引**: regulation, guideline, case_law
- **按语言分索引**: en, fr
- **混合索引**: 支持复合查询条件

### 4. Redis - 缓存和会话

#### 数据类型和用途

**会话管理**:
```
miningreg:session:{session_id} -> Hash
{
  user_id: "用户ID",
  organization_id: "组织ID",
  preferences: {用户偏好},
  expires_at: 过期时间
}
```

**API缓存**:
```
miningreg:cache:legal_query:{hash} -> String
{
  response: "查询结果",
  sources: [引用来源],
  confidence: 置信度,
  cached_at: 缓存时间
}
```

**实时统计**:
```
miningreg:stats:user:{user_id}:daily -> Hash
{
  queries_count: 查询次数,
  documents_uploaded: 上传文档数,
  reports_generated: 生成报告数
}
```

**事件流**:
```
miningreg:events:user_actions -> Stream
miningreg:events:legal_queries -> Stream
miningreg:events:document_uploads -> Stream
```

## 🔄 数据流设计

### 1. 文档处理流程
```
用户上传 → PostgreSQL(元数据) → MongoDB(内容) → 向量化 → Pinecone(向量) → Elasticsearch(索引)
```

### 2. RAG查询流程
```
用户查询 → 向量化 → Pinecone(相似度搜索) → PostgreSQL(元数据) → MongoDB(内容) → LLM(生成) → Redis(缓存)
```

### 3. 报告生成流程
```
选择模板 → MongoDB(模板) → PostgreSQL(项目数据) → LLM(生成) → MongoDB(内容) → PostgreSQL(记录)
```

## 🛡️ 安全和性能

### 安全措施
- **数据加密**: 传输和存储加密
- **访问控制**: RBAC权限模型
- **审计日志**: 完整的操作记录
- **数据备份**: 多层备份策略

### 性能优化
- **索引策略**: 25个PostgreSQL索引 + MongoDB复合索引
- **缓存层**: 多级缓存架构
- **连接池**: 数据库连接优化
- **异步处理**: 后台任务队列

## 📈 扩展性设计

### 水平扩展
- **数据库分片**: 按组织或地区分片
- **读写分离**: 主从复制架构
- **微服务**: 按功能模块拆分
- **CDN**: 静态资源分发

### 垂直扩展
- **资源监控**: 实时性能监控
- **自动扩容**: 基于负载的自动扩展
- **缓存优化**: 智能缓存策略
- **查询优化**: SQL和NoSQL查询优化

## 🚀 部署和维护

### 部署脚本
- `setup-database.sql` - PostgreSQL初始化
- `setup-mongodb.js` - MongoDB配置
- `setup-redis.sh` - Redis缓存配置
- `schema-extended.prisma` - 完整数据模型

### 监控指标
- **数据库性能**: 查询时间、连接数、缓存命中率
- **业务指标**: 用户活跃度、查询成功率、系统可用性
- **资源使用**: CPU、内存、磁盘、网络

### 备份策略
- **PostgreSQL**: 每日全量 + 实时WAL
- **MongoDB**: 每日快照备份
- **Redis**: RDB + AOF持久化
- **向量数据**: 定期导出备份

## 📊 数据统计

### 数据库规模预估
- **用户数据**: 10万用户 × 平均5KB = 500MB
- **项目数据**: 1万项目 × 平均50KB = 500MB
- **文档数据**: 10万文档 × 平均1MB = 100GB
- **对话历史**: 100万对话 × 平均10KB = 10GB
- **向量数据**: 100万向量 × 6KB = 6GB

### 性能目标
- **查询响应时间**: < 200ms (95%ile)
- **RAG检索时间**: < 2s (包含LLM生成)
- **系统可用性**: 99.9%
- **并发用户**: 1000+ 同时在线

这个数据库架构设计为MiningReg系统提供了强大、灵活、可扩展的数据存储和处理能力，支持所有核心功能的高效运行。
