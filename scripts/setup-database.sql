-- MiningReg Database Setup Script
-- 数据库初始化和基础数据插入脚本

-- ================================
-- 创建扩展 (Extensions)
-- ================================

-- 启用UUID生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 启用向量扩展 (如果使用pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- 启用全文搜索
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================
-- 创建自定义函数 (Custom Functions)
-- ================================

-- 更新updated_at字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================
-- 初始化基础数据 (Seed Data)
-- ================================

-- 插入默认组织
INSERT INTO organizations (id, name, slug, description, industry, size, country, status, created_at, updated_at)
VALUES 
  ('org_default', 'Default Organization', 'default', 'Default organization for individual users', 'consulting', 'SMALL', 'CA', 'ACTIVE', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 插入法律知识库基础数据
INSERT INTO legal_knowledge_base (id, title, content, type, jurisdiction, language, source, effective_date, last_updated, tags)
VALUES 
  (
    'kb_impact_assessment_act',
    'Impact Assessment Act',
    'An Act respecting impact assessments of certain activities and the prevention of significant adverse environmental effects...',
    'ACT',
    'federal',
    'en',
    'https://laws-lois.justice.gc.ca/eng/acts/I-2.75/',
    '2019-08-28',
    NOW(),
    ARRAY['environmental', 'impact assessment', 'federal']
  ),
  (
    'kb_fisheries_act',
    'Fisheries Act',
    'An Act respecting fisheries...',
    'ACT',
    'federal',
    'en',
    'https://laws-lois.justice.gc.ca/eng/acts/F-14/',
    '1985-01-01',
    NOW(),
    ARRAY['fisheries', 'environmental', 'federal']
  ),
  (
    'kb_ontario_mining_act',
    'Ontario Mining Act',
    'An Act respecting mining...',
    'ACT',
    'ontario',
    'en',
    'https://www.ontario.ca/laws/statute/90m14',
    '1990-01-01',
    NOW(),
    ARRAY['mining', 'ontario', 'provincial']
  )
ON CONFLICT (id) DO NOTHING;

-- 插入法语版本的法律知识库
INSERT INTO legal_knowledge_base (id, title, content, type, jurisdiction, language, source, effective_date, last_updated, tags)
VALUES 
  (
    'kb_impact_assessment_act_fr',
    'Loi sur l''évaluation d''impact',
    'Loi concernant l''évaluation d''impact de certaines activités et la prévention d''effets environnementaux négatifs importants...',
    'ACT',
    'federal',
    'fr',
    'https://laws-lois.justice.gc.ca/fra/lois/I-2.75/',
    '2019-08-28',
    NOW(),
    ARRAY['environnemental', 'évaluation impact', 'fédéral']
  )
ON CONFLICT (id) DO NOTHING;

-- 插入默认Prompt模板
INSERT INTO prompt_templates (id, name, description, category, jurisdiction, language, content, variables, tags, is_public, complexity, user_id, created_at, updated_at)
VALUES 
  (
    'template_eia_scoping',
    'EIA Scoping Requirements',
    'Template for determining EIA scoping requirements under the Impact Assessment Act',
    'EIA',
    'federal',
    'en',
    'Based on the project details provided: {project_name} located in {location}, please analyze the EIA scoping requirements under the Impact Assessment Act. Consider the following factors: project type ({project_type}), scale ({project_scale}), and potential environmental impacts ({potential_impacts}).',
    '{"project_name": "string", "location": "string", "project_type": "string", "project_scale": "string", "potential_impacts": "array"}',
    ARRAY['eia', 'scoping', 'federal', 'impact assessment'],
    true,
    'INTERMEDIATE',
    'system',
    NOW(),
    NOW()
  ),
  (
    'template_indigenous_consultation',
    'Indigenous Consultation Requirements',
    'Template for analyzing Indigenous consultation requirements',
    'INDIGENOUS',
    'federal',
    'en',
    'For the proposed {project_type} project "{project_name}" in {traditional_territory}, please outline the Indigenous consultation requirements. Consider: consultation level ({consultation_level}), timeline ({timeline}), and specific requirements for this jurisdiction ({jurisdiction}).',
    '{"project_name": "string", "project_type": "string", "traditional_territory": "string", "consultation_level": "string", "timeline": "string", "jurisdiction": "string"}',
    ARRAY['indigenous', 'consultation', 'rights', 'engagement'],
    true,
    'ADVANCED',
    'system',
    NOW(),
    NOW()
  ),
  (
    'template_permit_checklist',
    'Mining Permit Checklist',
    'Template for generating mining permit application checklist',
    'PERMITTING',
    'federal',
    'en',
    'Generate a comprehensive permit application checklist for a {mining_type} operation in {jurisdiction}. Include federal, provincial, and municipal requirements. Project details: {project_details}.',
    '{"mining_type": "string", "jurisdiction": "string", "project_details": "string"}',
    ARRAY['permitting', 'mining', 'checklist', 'compliance'],
    true,
    'BEGINNER',
    'system',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 插入法语版本的Prompt模板
INSERT INTO prompt_templates (id, name, description, category, jurisdiction, language, content, variables, tags, is_public, complexity, user_id, created_at, updated_at)
VALUES 
  (
    'template_eia_scoping_fr',
    'Exigences de cadrage d''EIE',
    'Modèle pour déterminer les exigences de cadrage d''EIE sous la Loi sur l''évaluation d''impact',
    'EIA',
    'federal',
    'fr',
    'Basé sur les détails du projet fournis: {project_name} situé à {location}, veuillez analyser les exigences de cadrage d''EIE sous la Loi sur l''évaluation d''impact. Considérez les facteurs suivants: type de projet ({project_type}), échelle ({project_scale}), et impacts environnementaux potentiels ({potential_impacts}).',
    '{"project_name": "string", "location": "string", "project_type": "string", "project_scale": "string", "potential_impacts": "array"}',
    ARRAY['eie', 'cadrage', 'fédéral', 'évaluation impact'],
    true,
    'INTERMEDIATE',
    'system',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ================================
-- 创建索引 (Indexes)
-- ================================

-- 用户相关索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);

-- 组织相关索引
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_org ON organization_members(user_id, organization_id);

-- 项目相关索引
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_jurisdiction ON projects(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_project_members_user_project ON project_members(user_id, project_id);

-- 文档相关索引
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_jurisdiction ON documents(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_documents_language ON documents(language);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);

-- 法律知识库索引
CREATE INDEX IF NOT EXISTS idx_legal_kb_type ON legal_knowledge_base(type);
CREATE INDEX IF NOT EXISTS idx_legal_kb_jurisdiction ON legal_knowledge_base(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_legal_kb_language ON legal_knowledge_base(language);
CREATE INDEX IF NOT EXISTS idx_legal_kb_tags ON legal_knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_legal_kb_effective_date ON legal_knowledge_base(effective_date);

-- 向量嵌入索引
CREATE INDEX IF NOT EXISTS idx_document_embeddings_document ON document_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_embeddings_kb ON legal_embeddings(knowledge_base_id);

-- 咨询和查询索引
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_project ON consultations(project_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_legal_queries_user ON legal_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_queries_consultation ON legal_queries(consultation_id);
CREATE INDEX IF NOT EXISTS idx_legal_queries_jurisdiction ON legal_queries(jurisdiction);

-- 对话相关索引
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project ON conversations(project_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation ON conversation_messages(conversation_id);

-- Prompt模板索引
CREATE INDEX IF NOT EXISTS idx_prompt_templates_category ON prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_jurisdiction ON prompt_templates(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_language ON prompt_templates(language);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_public ON prompt_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_tags ON prompt_templates USING GIN(tags);

-- 报告索引
CREATE INDEX IF NOT EXISTS idx_reports_project ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 订阅索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_organization ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ================================
-- 创建触发器 (Triggers)
-- ================================

-- 为所有有updated_at字段的表创建触发器
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'users', 'user_preferences', 'organizations', 'organization_members',
        'projects', 'project_members', 'project_milestones', 'documents',
        'legal_knowledge_base', 'consultations', 'legal_queries',
        'conversations', 'prompt_templates', 'reports', 'subscriptions'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', table_name, table_name);
    END LOOP;
END $$;

-- ================================
-- 创建视图 (Views)
-- ================================

-- 项目统计视图
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.compliance_score,
    p.risk_level,
    COUNT(DISTINCT pm.user_id) as member_count,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT c.id) as consultation_count,
    COUNT(DISTINCT r.id) as report_count
FROM projects p
LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.status = 'ACTIVE'
LEFT JOIN documents d ON p.id = d.project_id
LEFT JOIN consultations c ON p.id = c.project_id
LEFT JOIN reports r ON p.id = r.project_id
GROUP BY p.id, p.name, p.status, p.compliance_score, p.risk_level;

-- 用户活动统计视图
CREATE OR REPLACE VIEW user_activity_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT lq.id) as query_count,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT pt.id) as template_count,
    MAX(lq.created_at) as last_query_at
FROM users u
LEFT JOIN legal_queries lq ON u.id = lq.user_id
LEFT JOIN documents d ON u.id = d.user_id
LEFT JOIN prompt_templates pt ON u.id = pt.user_id
GROUP BY u.id, u.name, u.email;

-- ================================
-- 数据完整性检查 (Data Integrity)
-- ================================

-- 检查必要的数据是否存在
DO $$
BEGIN
    -- 检查是否有默认组织
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE slug = 'default') THEN
        RAISE EXCEPTION 'Default organization not found';
    END IF;
    
    -- 检查是否有基础法律知识库数据
    IF (SELECT COUNT(*) FROM legal_knowledge_base) < 3 THEN
        RAISE WARNING 'Insufficient legal knowledge base data';
    END IF;
    
    -- 检查是否有基础Prompt模板
    IF (SELECT COUNT(*) FROM prompt_templates WHERE is_public = true) < 3 THEN
        RAISE WARNING 'Insufficient public prompt templates';
    END IF;
    
    RAISE NOTICE 'Database setup completed successfully';
END $$;
