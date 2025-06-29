#!/bin/bash

echo "🔍 检查Vercel部署状态和GitHub集成"
echo "=================================="

echo ""
echo "📊 当前Git状态:"
git status
echo ""

echo "📝 最近的提交:"
git log --oneline -5
echo ""

echo "🌐 远程仓库信息:"
git remote -v
echo ""

echo "🔄 检查是否有未推送的更改:"
git log origin/main..HEAD --oneline
if [ $? -eq 0 ]; then
    echo "✅ 所有更改已推送到GitHub"
else
    echo "❌ 有未推送的更改"
fi
echo ""

echo "📦 检查package.json版本:"
grep -A 2 '"name"' package.json
echo ""

echo "🚀 建议的修复步骤:"
echo "1. 检查Vercel项目设置中的Git集成"
echo "2. 确认Production Branch设置为'main'"
echo "3. 检查Build & Development Settings"
echo "4. 验证Environment Variables"
echo "5. 手动触发重新部署"
echo ""

echo "⚡ 强制触发部署命令:"
echo "git commit --allow-empty -m 'trigger: force vercel redeploy' && git push origin main"
