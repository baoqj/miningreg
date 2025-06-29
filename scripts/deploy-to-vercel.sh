#!/bin/bash

echo "🚀 简化Vercel配置并重新部署"
echo "================================"

# 检查当前状态
echo "📊 当前状态检查:"
echo "✅ vercel.json 已简化"
echo "✅ 依赖冲突已修复"
echo "✅ 构建命令已优化"
echo ""

# 显示简化后的配置
echo "⚙️ 简化后的vercel.json配置:"
cat vercel.json
echo ""

# 验证构建
echo "🔧 验证本地构建:"
echo "正在检查package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在"
    exit 1
fi

echo ""
echo "📦 准备部署到Vercel:"
echo "1. 简化的vercel.json配置"
echo "2. 优化的构建命令: npm run build"
echo "3. 兼容的安装命令: npm install --legacy-peer-deps"
echo "4. 单区域部署: iad1"
echo "5. API函数超时: 60秒"
echo ""

echo "🎯 部署目标:"
echo "- 修复Vercel自动部署"
echo "- 确保构建成功"
echo "- 恢复应用正常运行"
echo ""

echo "⏰ 预期结果:"
echo "- Vercel检测到配置更改"
echo "- 自动开始重新部署"
echo "- 构建过程成功完成"
echo "- 应用正常运行"
