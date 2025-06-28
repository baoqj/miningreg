#!/bin/bash

# MiningReg Redis Setup Script
# Redis缓存和会话存储配置脚本

echo "🔧 Setting up Redis for MiningReg..."

# ================================
# Redis配置检查 (Configuration Check)
# ================================

# 检查Redis是否运行
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start Redis first."
    echo "   macOS: brew services start redis"
    echo "   Ubuntu: sudo systemctl start redis-server"
    echo "   Docker: docker run -d -p 6379:6379 redis:alpine"
    exit 1
fi

echo "✅ Redis is running"

# ================================
# 创建Redis键命名空间 (Key Namespaces)
# ================================

# 定义键前缀
SESSION_PREFIX="miningreg:session:"
USER_PREFIX="miningreg:user:"
CACHE_PREFIX="miningreg:cache:"
STATS_PREFIX="miningreg:stats:"
QUEUE_PREFIX="miningreg:queue:"

echo "📝 Setting up Redis key namespaces..."

# ================================
# 初始化缓存配置 (Cache Configuration)
# ================================

redis-cli << EOF
-- 设置默认缓存配置
SET miningreg:config:cache_ttl 3600
SET miningreg:config:session_ttl 86400
SET miningreg:config:api_cache_ttl 1800
SET miningreg:config:stats_ttl 604800

-- 设置API限流配置
SET miningreg:config:rate_limit:default 100
SET miningreg:config:rate_limit:premium 1000
SET miningreg:config:rate_limit:window 3600

-- 初始化系统统计
HSET miningreg:stats:system total_users 0
HSET miningreg:stats:system total_queries 0
HSET miningreg:stats:system total_documents 0
HSET miningreg:stats:system total_projects 0

-- 设置过期时间
EXPIRE miningreg:stats:system 604800

EOF

echo "✅ Cache configuration initialized"

# ================================
# 创建示例数据 (Sample Data)
# ================================

echo "📊 Creating sample cache data..."

# 示例用户会话
redis-cli << EOF
-- 示例用户会话
HSET ${SESSION_PREFIX}demo_session_123 user_id "user_demo"
HSET ${SESSION_PREFIX}demo_session_123 organization_id "org_demo"
HSET ${SESSION_PREFIX}demo_session_123 language "en"
HSET ${SESSION_PREFIX}demo_session_123 jurisdiction "federal"
HSET ${SESSION_PREFIX}demo_session_123 created_at "$(date -u +%s)"
EXPIRE ${SESSION_PREFIX}demo_session_123 86400

-- 示例用户偏好缓存
HSET ${USER_PREFIX}demo:preferences language "en"
HSET ${USER_PREFIX}demo:preferences jurisdiction "federal"
HSET ${USER_PREFIX}demo:preferences theme "light"
HSET ${USER_PREFIX}demo:preferences timezone "America/Toronto"
EXPIRE ${USER_PREFIX}demo:preferences 86400

-- 示例API响应缓存
SET ${CACHE_PREFIX}legal_query:hash_123 '{"response":"Based on the Impact Assessment Act...","confidence":0.95,"sources":[{"document_id":"kb_impact_assessment_act","relevance":0.95}],"cached_at":"$(date -u +%s)"}'
EXPIRE ${CACHE_PREFIX}legal_query:hash_123 1800

-- 示例用户统计
HSET ${STATS_PREFIX}user:demo:daily queries_count 5
HSET ${STATS_PREFIX}user:demo:daily documents_uploaded 2
HSET ${STATS_PREFIX}user:demo:daily reports_generated 1
HSET ${STATS_PREFIX}user:demo:daily date "$(date +%Y-%m-%d)"
EXPIRE ${STATS_PREFIX}user:demo:daily 604800

-- 示例实时统计
HSET ${STATS_PREFIX}realtime:$(date +%Y-%m-%d) active_users 10
HSET ${STATS_PREFIX}realtime:$(date +%Y-%m-%d) queries_per_hour 25
HSET ${STATS_PREFIX}realtime:$(date +%Y-%m-%d) avg_response_time 1.2
EXPIRE ${STATS_PREFIX}realtime:$(date +%Y-%m-%d) 86400

EOF

echo "✅ Sample data created"

# ================================
# 设置Redis Streams (Event Streaming)
# ================================

echo "🌊 Setting up Redis Streams for real-time events..."

redis-cli << EOF
-- 创建事件流
XADD miningreg:events:user_actions * action "user_login" user_id "demo" timestamp "$(date -u +%s)"
XADD miningreg:events:legal_queries * action "query_submitted" user_id "demo" query_id "query_123" timestamp "$(date -u +%s)"
XADD miningreg:events:document_uploads * action "document_uploaded" user_id "demo" document_id "doc_123" timestamp "$(date -u +%s)"

-- 创建消费者组
XGROUP CREATE miningreg:events:user_actions analytics_group $ MKSTREAM
XGROUP CREATE miningreg:events:legal_queries processing_group $ MKSTREAM
XGROUP CREATE miningreg:events:document_uploads indexing_group $ MKSTREAM

EOF

echo "✅ Redis Streams configured"

# ================================
# 创建Lua脚本 (Lua Scripts)
# ================================

echo "📜 Loading Lua scripts..."

# 限流脚本
RATE_LIMIT_SCRIPT='
local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local current_time = tonumber(ARGV[3])

local current = redis.call("GET", key)
if current == false then
    redis.call("SET", key, 1)
    redis.call("EXPIRE", key, window)
    return {1, limit}
else
    local count = tonumber(current)
    if count < limit then
        redis.call("INCR", key)
        return {count + 1, limit}
    else
        return {count, limit}
    end
end
'

# 加载限流脚本
RATE_LIMIT_SHA=$(redis-cli SCRIPT LOAD "$RATE_LIMIT_SCRIPT")
echo "Rate limit script SHA: $RATE_LIMIT_SHA"

# 用户活动统计脚本
USER_STATS_SCRIPT='
local user_id = ARGV[1]
local action = ARGV[2]
local date = ARGV[3]

local daily_key = "miningreg:stats:user:" .. user_id .. ":daily"
local monthly_key = "miningreg:stats:user:" .. user_id .. ":monthly"

redis.call("HINCRBY", daily_key, action, 1)
redis.call("HSET", daily_key, "date", date)
redis.call("EXPIRE", daily_key, 604800)

redis.call("HINCRBY", monthly_key, action, 1)
redis.call("EXPIRE", monthly_key, 2592000)

return "OK"
'

# 加载用户统计脚本
USER_STATS_SHA=$(redis-cli SCRIPT LOAD "$USER_STATS_SCRIPT")
echo "User stats script SHA: $USER_STATS_SHA"

# 保存脚本SHA到配置
redis-cli << EOF
SET miningreg:scripts:rate_limit "$RATE_LIMIT_SHA"
SET miningreg:scripts:user_stats "$USER_STATS_SHA"
EOF

echo "✅ Lua scripts loaded"

# ================================
# 创建监控键 (Monitoring Keys)
# ================================

echo "📊 Setting up monitoring..."

redis-cli << EOF
-- 系统健康检查
SET miningreg:health:redis "OK"
SET miningreg:health:last_check "$(date -u +%s)"

-- 性能指标
HSET miningreg:metrics:performance avg_query_time 1.2
HSET miningreg:metrics:performance cache_hit_rate 0.85
HSET miningreg:metrics:performance active_connections 50

-- 错误统计
HSET miningreg:metrics:errors total_errors 0
HSET miningreg:metrics:errors last_error_time 0

EOF

echo "✅ Monitoring configured"

# ================================
# 验证设置 (Validation)
# ================================

echo "🔍 Validating Redis setup..."

# 检查键是否存在
KEYS_COUNT=$(redis-cli EVAL "return #redis.call('KEYS', 'miningreg:*')" 0)
echo "Total MiningReg keys created: $KEYS_COUNT"

# 检查脚本是否加载
SCRIPTS_COUNT=$(redis-cli EVAL "return #redis.call('SCRIPT', 'EXISTS', '$RATE_LIMIT_SHA', '$USER_STATS_SHA')" 0)
echo "Lua scripts loaded: $SCRIPTS_COUNT/2"

# 测试限流脚本
RATE_LIMIT_TEST=$(redis-cli EVALSHA "$RATE_LIMIT_SHA" 1 "test:rate_limit" 60 10 $(date +%s))
echo "Rate limit test result: $RATE_LIMIT_TEST"

# 测试用户统计脚本
USER_STATS_TEST=$(redis-cli EVALSHA "$USER_STATS_SHA" 0 "test_user" "queries_count" $(date +%Y-%m-%d))
echo "User stats test result: $USER_STATS_TEST"

# ================================
# 输出配置信息 (Configuration Summary)
# ================================

echo ""
echo "🎉 Redis setup completed successfully!"
echo ""
echo "📋 Configuration Summary:"
echo "   Session TTL: 24 hours"
echo "   Cache TTL: 1 hour"
echo "   API Cache TTL: 30 minutes"
echo "   Stats TTL: 7 days"
echo ""
echo "🔑 Key Prefixes:"
echo "   Sessions: $SESSION_PREFIX"
echo "   Users: $USER_PREFIX"
echo "   Cache: $CACHE_PREFIX"
echo "   Stats: $STATS_PREFIX"
echo "   Queues: $QUEUE_PREFIX"
echo ""
echo "📜 Loaded Scripts:"
echo "   Rate Limit: $RATE_LIMIT_SHA"
echo "   User Stats: $USER_STATS_SHA"
echo ""
echo "🌊 Event Streams:"
echo "   User Actions: miningreg:events:user_actions"
echo "   Legal Queries: miningreg:events:legal_queries"
echo "   Document Uploads: miningreg:events:document_uploads"
echo ""
echo "💡 Usage Examples:"
echo "   Get user session: redis-cli HGETALL ${SESSION_PREFIX}<session_id>"
echo "   Check rate limit: redis-cli EVALSHA $RATE_LIMIT_SHA 1 user:<user_id> 3600 100 \$(date +%s)"
echo "   Update user stats: redis-cli EVALSHA $USER_STATS_SHA 0 <user_id> queries_count \$(date +%Y-%m-%d)"
echo ""
echo "✅ Redis is ready for MiningReg!"
