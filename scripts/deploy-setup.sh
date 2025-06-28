#!/bin/bash

# MiningReg GitHub & Vercel Deployment Setup Script
# 自动化设置GitHub仓库和Vercel部署

set -e

echo "🚀 MiningReg Deployment Setup"
echo "=============================="

# 检查必要的工具
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    
    echo "✅ All dependencies are installed"
}

# 设置Git仓库
setup_git_repo() {
    echo "📦 Setting up Git repository..."
    
    # 检查是否已经是Git仓库
    if [ ! -d ".git" ]; then
        git init
        echo "✅ Git repository initialized"
    else
        echo "✅ Git repository already exists"
    fi
    
    # 设置远程仓库
    REPO_URL="https://github.com/baoqj/miningreg.git"
    
    if git remote get-url origin &> /dev/null; then
        echo "✅ Remote origin already configured"
    else
        git remote add origin $REPO_URL
        echo "✅ Remote origin added: $REPO_URL"
    fi
}

# 安装依赖
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# 设置环境变量
setup_environment() {
    echo "⚙️ Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo ""
        echo "🔧 Please edit .env.local and add your API keys:"
        echo "   - HUGGINGFACE_API_KEY"
        echo "   - DATABASE_URL"
        echo "   - NEXTAUTH_SECRET"
        echo "   - GOOGLE_CLIENT_ID"
        echo "   - GOOGLE_CLIENT_SECRET"
        echo ""
        echo "Press Enter to continue after editing .env.local..."
        read -r
    else
        echo "✅ .env.local already exists"
    fi
}

# 设置数据库
setup_database() {
    echo "🗄️ Setting up database..."
    
    # 检查环境变量
    if [ -f ".env.local" ]; then
        source .env.local
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        echo "⚠️ DATABASE_URL not set. Skipping database setup."
        echo "   Please configure your database and run: npm run db:push && npm run db:seed"
        return
    fi
    
    # 生成Prisma客户端
    npx prisma generate
    echo "✅ Prisma client generated"
    
    # 推送数据库架构
    echo "📊 Pushing database schema..."
    npx prisma db push
    echo "✅ Database schema pushed"
    
    # 导入种子数据
    echo "🌱 Seeding database..."
    npm run db:seed
    echo "✅ Database seeded"
}

# 构建项目
build_project() {
    echo "🔨 Building project..."
    npm run build
    echo "✅ Project built successfully"
}

# 提交到Git
commit_to_git() {
    echo "📝 Committing to Git..."
    
    # 添加所有文件
    git add .
    
    # 检查是否有更改
    if git diff --staged --quiet; then
        echo "✅ No changes to commit"
        return
    fi
    
    # 提交更改
    git commit -m "Initial MiningReg setup with Hugging Face integration

- Added Hugging Face API integration for LLM functionality
- Configured AI chat, embeddings, and report generation APIs
- Set up complete database schema with Prisma
- Added comprehensive deployment configuration
- Implemented health check and monitoring
- Ready for Vercel deployment"
    
    echo "✅ Changes committed to Git"
}

# 推送到GitHub
push_to_github() {
    echo "🚀 Pushing to GitHub..."
    
    # 检查是否有远程仓库
    if ! git remote get-url origin &> /dev/null; then
        echo "❌ No remote repository configured"
        return 1
    fi
    
    # 推送到main分支
    git push -u origin main
    echo "✅ Pushed to GitHub successfully"
}

# Vercel部署指导
vercel_deployment_guide() {
    echo ""
    echo "🌐 Vercel Deployment Guide"
    echo "=========================="
    echo ""
    echo "1. 访问 https://vercel.com 并登录"
    echo "2. 点击 'New Project'"
    echo "3. 导入GitHub仓库: https://github.com/baoqj/miningreg"
    echo "4. 配置环境变量:"
    echo "   - HUGGINGFACE_API_KEY=hf_your_api_key"
    echo "   - DATABASE_URL=postgresql://..."
    echo "   - MONGODB_URI=mongodb+srv://..."
    echo "   - REDIS_URL=redis://..."
    echo "   - NEXTAUTH_URL=https://your-domain.vercel.app"
    echo "   - NEXTAUTH_SECRET=your-secret-key"
    echo "   - GOOGLE_CLIENT_ID=your-google-client-id"
    echo "   - GOOGLE_CLIENT_SECRET=your-google-client-secret"
    echo "5. 点击 'Deploy'"
    echo ""
    echo "📚 详细部署指南请查看: docs/deployment-guide.md"
    echo ""
}

# 显示下一步
show_next_steps() {
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure your external services:"
    echo "   - Supabase (PostgreSQL): https://supabase.com"
    echo "   - MongoDB Atlas: https://cloud.mongodb.com"
    echo "   - Upstash (Redis): https://upstash.com"
    echo "   - Pinecone (Vector DB): https://pinecone.io"
    echo "   - Hugging Face API: https://huggingface.co/settings/tokens"
    echo ""
    echo "2. Update .env.local with your API keys"
    echo ""
    echo "3. Test locally:"
    echo "   npm run dev"
    echo ""
    echo "4. Deploy to Vercel (see guide above)"
    echo ""
    echo "5. Test deployment:"
    echo "   curl https://your-domain.vercel.app/api/health"
    echo ""
    echo "📖 For detailed instructions, see README.md"
}

# 主函数
main() {
    echo "Starting MiningReg deployment setup..."
    echo ""
    
    check_dependencies
    setup_git_repo
    install_dependencies
    setup_environment
    setup_database
    build_project
    commit_to_git
    
    # 尝试推送到GitHub
    if push_to_github; then
        echo "✅ Successfully pushed to GitHub"
    else
        echo "⚠️ Failed to push to GitHub. You may need to:"
        echo "   1. Authenticate with GitHub"
        echo "   2. Check repository permissions"
        echo "   3. Push manually: git push -u origin main"
    fi
    
    vercel_deployment_guide
    show_next_steps
}

# 运行主函数
main "$@"
