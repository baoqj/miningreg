# MiningReg 数据库架构设计

## 概述

MiningReg系统采用混合数据库架构，结合关系型数据库和非关系型数据库，以支持项目管理、用户/团队管理、文档管理、RAG、LLM问答、prompt模板等功能。

## 1. 关系型数据库 (PostgreSQL)

### 核心业务数据
- **用户管理**: 用户账户、偏好设置、认证信息
- **组织管理**: 组织信息、成员关系、角色权限
- **项目管理**: 项目信息、成员、里程碑、风险评估
- **文档管理**: 文档元数据、版本控制、权限管理
- **法律咨询**: 咨询记录、查询历史、反馈评价
- **订阅计费**: 订阅计划、支付记录、使用统计

### 主要数据表

#### 用户相关
```sql
users                 -- 用户基本信息
accounts              -- OAuth账户关联
sessions              -- 用户会话
user_preferences      -- 用户偏好设置
```

#### 组织相关
```sql
organizations         -- 组织信息
organization_members  -- 组织成员关系
```

#### 项目相关
```sql
projects              -- 项目基本信息
project_members       -- 项目成员关系
project_milestones    -- 项目里程碑
```

#### 文档相关
```sql
documents             -- 文档元数据
document_embeddings   -- 文档向量嵌入
```

#### 法律知识库
```sql
legal_knowledge_base  -- 法律文档库
legal_embeddings      -- 法律文档向量
```

#### 咨询和查询
```sql
consultations         -- 法律咨询
legal_queries         -- 法律查询记录
conversations         -- LLM对话历史
conversation_messages -- 对话消息
```

#### 模板和报告
```sql
prompt_templates      -- Prompt模板
reports               -- 报告管理
```

#### 订阅计费
```sql
subscriptions         -- 订阅信息
```

## 2. 非关系型数据库架构

### 2.1 向量数据库 (Pinecone/Weaviate)

#### 用途
- 存储文档和法律条文的向量嵌入
- 支持语义搜索和RAG检索
- 多语言文档检索（英语/法语）

#### 数据结构
```json
{
  "id": "doc_123_chunk_1",
  "vector": [0.1, 0.2, ...], // 1536维向量
  "metadata": {
    "document_id": "doc_123",
    "chunk_index": 1,
    "content": "文档内容片段",
    "document_type": "regulation",
    "jurisdiction": "federal",
    "language": "en",
    "source": "Impact Assessment Act",
    "section": "Section 7",
    "effective_date": "2019-08-28"
  }
}
```

#### 索引策略
- **按管辖区分索引**: federal, ontario, bc, alberta
- **按文档类型分索引**: regulation, guideline, case_law
- **按语言分索引**: en, fr

### 2.2 文档存储 (MongoDB)

#### 用途
- 存储大型文档内容
- 存储复杂的JSON结构数据
- 存储报告生成的中间结果

#### 集合设计

##### documents_content
```json
{
  "_id": "doc_123",
  "title": "Impact Assessment Act",
  "content": "完整文档内容...",
  "sections": [
    {
      "title": "Section 7",
      "content": "章节内容...",
      "subsections": [...]
    }
  ],
  "metadata": {
    "jurisdiction": "federal",
    "language": "en",
    "document_type": "act",
    "effective_date": "2019-08-28"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

##### llm_conversations
```json
{
  "_id": "conv_123",
  "user_id": "user_456",
  "project_id": "proj_789",
  "title": "EIA Requirements Discussion",
  "messages": [
    {
      "role": "user",
      "content": "What are the EIA requirements for copper mining?",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Based on the Impact Assessment Act...",
      "timestamp": "2024-01-01T10:00:05Z",
      "sources": [
        {
          "document_id": "doc_123",
          "section": "Section 7",
          "relevance_score": 0.95
        }
      ],
      "model_info": {
        "model": "gpt-4",
        "tokens_used": 1500,
        "processing_time_ms": 2500
      }
    }
  ],
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:05:00Z"
}
```

##### report_templates
```json
{
  "_id": "template_123",
  "name": "EIA Report Template",
  "type": "eia",
  "jurisdiction": "federal",
  "language": "en",
  "sections": [
    {
      "id": "executive_summary",
      "title": "Executive Summary",
      "required": true,
      "prompts": [
        {
          "type": "generation",
          "template": "Generate an executive summary for {project_name}..."
        }
      ]
    },
    {
      "id": "project_description",
      "title": "Project Description",
      "required": true,
      "subsections": [...]
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2.3 缓存层 (Redis)

#### 用途
- 用户会话缓存
- API响应缓存
- 实时数据缓存
- 任务队列

#### 数据结构

##### 用户会话
```
Key: session:{session_id}
Value: {
  "user_id": "user_123",
  "organization_id": "org_456",
  "preferences": {
    "language": "en",
    "jurisdiction": "federal"
  },
  "expires_at": 1704067200
}
TTL: 24小时
```

##### API缓存
```
Key: api:legal_query:{hash}
Value: {
  "response": "查询结果...",
  "sources": [...],
  "confidence": 0.95,
  "cached_at": 1704067200
}
TTL: 1小时
```

##### 实时统计
```
Key: stats:user:{user_id}:daily
Value: {
  "queries_count": 15,
  "documents_uploaded": 3,
  "reports_generated": 1,
  "date": "2024-01-01"
}
TTL: 7天
```

### 2.4 搜索引擎 (Elasticsearch)

#### 用途
- 全文搜索
- 多语言搜索
- 复杂查询和聚合
- 搜索建议和自动完成

#### 索引设计

##### legal_documents
```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {"type": "keyword"}
        }
      },
      "content": {
        "type": "text",
        "analyzer": "standard"
      },
      "jurisdiction": {"type": "keyword"},
      "language": {"type": "keyword"},
      "document_type": {"type": "keyword"},
      "effective_date": {"type": "date"},
      "tags": {"type": "keyword"},
      "suggest": {
        "type": "completion",
        "analyzer": "simple"
      }
    }
  }
}
```

## 3. 数据流架构

### 3.1 文档处理流程
```
1. 文档上传 → PostgreSQL (元数据)
2. 内容提取 → MongoDB (完整内容)
3. 文本分块 → 向量化 → Pinecone (向量存储)
4. 索引构建 → Elasticsearch (搜索索引)
```

### 3.2 RAG查询流程
```
1. 用户查询 → 向量化
2. Pinecone → 相似度搜索
3. PostgreSQL → 获取文档元数据
4. MongoDB → 获取完整内容
5. LLM → 生成回答
6. Redis → 缓存结果
```

### 3.3 报告生成流程
```
1. 选择模板 → MongoDB (模板数据)
2. 项目数据 → PostgreSQL (项目信息)
3. AI生成 → LLM API
4. 内容存储 → MongoDB (报告内容)
5. 元数据 → PostgreSQL (报告记录)
```

## 4. 数据安全和备份

### 4.1 数据加密
- 数据库连接使用SSL/TLS
- 敏感字段加密存储
- API传输使用HTTPS

### 4.2 备份策略
- PostgreSQL: 每日全量备份 + 实时WAL备份
- MongoDB: 每日快照备份
- Redis: RDB + AOF持久化
- 向量数据库: 定期导出备份

### 4.3 访问控制
- 基于角色的权限控制(RBAC)
- 行级安全策略(RLS)
- API访问限流
- 审计日志记录

## 5. 性能优化

### 5.1 数据库优化
- 适当的索引策略
- 查询优化和分析
- 连接池管理
- 读写分离

### 5.2 缓存策略
- 多层缓存架构
- 缓存预热和更新
- 缓存穿透保护
- 分布式缓存一致性

### 5.3 扩展性设计
- 数据库分片策略
- 微服务架构
- 异步任务处理
- 负载均衡

这个数据库架构设计支持MiningReg系统的所有核心功能，具有良好的扩展性、性能和安全性。
