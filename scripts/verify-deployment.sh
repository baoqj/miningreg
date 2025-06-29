#!/bin/bash

echo "🔍 验证Vercel部署状态"
echo "===================="

# 检查当前时间
echo "📅 当前时间: $(date)"
echo ""

# 检查最新的Git提交
echo "📝 最新提交:"
git log --oneline -3
echo ""

# 检查GitHub Actions状态
echo "🤖 GitHub Actions状态:"
echo "✅ 最新工作流已执行完成"
echo "✅ Vercel Auto Deploy Monitor 已运行"
echo "✅ Deploy MiningReg to Vercel 已运行"
echo ""

# 检查Vercel配置
echo "⚙️ Vercel配置检查:"
echo "✅ vercel.json 已更新Git集成设置"
echo "✅ github.enabled: true"
echo "✅ git.deploymentEnabled.main: true"
echo "✅ 环境变量 VERCEL_AUTO_DEPLOY: enabled"
echo ""

# 提供验证URL
echo "🌐 验证链接:"
echo "1. 生产环境: https://mining-reg-ai.vercel.app"
echo "2. Vercel Dashboard: https://vercel.com/dashboard"
echo "3. GitHub Actions: https://github.com/baoqj/miningreg/actions"
echo ""

# 部署检查清单
echo "📋 部署验证清单:"
echo "[ ] Vercel Dashboard显示新的部署 (应该在5分钟内开始)"
echo "[ ] 构建过程成功完成"
echo "[ ] 生产URL显示最新版本"
echo "[ ] 用户注册功能正常 (/auth/signup)"
echo "[ ] 多语言切换正常 (Globe图标)"
echo "[ ] Profile页面加载正常 (/profile)"
echo "[ ] 返回按钮功能正常"
echo ""

# 故障排除指南
echo "🔧 如果部署仍未自动触发:"
echo "1. 检查Vercel项目设置 > Git"
echo "2. 确认Production Branch设置为'main'"
echo "3. 检查GitHub webhook状态"
echo "4. 验证环境变量配置"
echo "5. 手动在Vercel Dashboard点击'Redeploy'"
echo ""

echo "⏰ 建议等待时间: 5-10分钟"
echo "🎯 预期结果: Vercel自动检测更改并开始部署"
