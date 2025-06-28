#!/bin/bash

# Quick GitHub Push Script for MiningReg
# 快速推送代码到GitHub仓库

set -e

echo "🚀 MiningReg GitHub Push Script"
echo "==============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 仓库信息
REPO_URL="https://github.com/baoqj/miningreg.git"
BRANCH="main"

# 检查Git状态
check_git_status() {
    echo -e "${BLUE}📋 Checking Git status...${NC}"
    
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}⚠️ Not a Git repository. Initializing...${NC}"
        git init
        echo -e "${GREEN}✅ Git repository initialized${NC}"
    fi
    
    # 检查远程仓库
    if ! git remote get-url origin &> /dev/null; then
        echo -e "${YELLOW}⚠️ No remote origin found. Adding remote...${NC}"
        git remote add origin $REPO_URL
        echo -e "${GREEN}✅ Remote origin added: $REPO_URL${NC}"
    else
        echo -e "${GREEN}✅ Remote origin already configured${NC}"
    fi
}

# 检查文件状态
check_files() {
    echo -e "${BLUE}📁 Checking files...${NC}"
    
    # 检查重要文件是否存在
    important_files=(
        "package.json"
        "next.config.js"
        "tailwind.config.ts"
        "prisma/schema.prisma"
        "lib/huggingface.ts"
        "app/api/ai/chat/route.ts"
        ".env.example"
        "README.md"
    )
    
    missing_files=()
    for file in "${important_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing important files:${NC}"
        for file in "${missing_files[@]}"; do
            echo -e "${RED}   - $file${NC}"
        done
        echo -e "${YELLOW}⚠️ Please ensure all files are present before pushing${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All important files present${NC}"
}

# 检查环境文件
check_env_files() {
    echo -e "${BLUE}🔐 Checking environment files...${NC}"
    
    if [ -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️ .env.local found - make sure it's in .gitignore${NC}"
        
        # 检查.gitignore
        if ! grep -q ".env.local" .gitignore 2>/dev/null; then
            echo ".env.local" >> .gitignore
            echo -e "${GREEN}✅ Added .env.local to .gitignore${NC}"
        fi
    fi
    
    if [ ! -f ".env.example" ]; then
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Environment files check passed${NC}"
}

# 安装依赖并构建
build_check() {
    echo -e "${BLUE}🔨 Running build check...${NC}"
    
    # 检查node_modules
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies...${NC}"
        npm install
    fi
    
    # 生成Prisma客户端
    echo -e "${BLUE}🗄️ Generating Prisma client...${NC}"
    npx prisma generate
    
    # 类型检查
    echo -e "${BLUE}🔍 Running type check...${NC}"
    npm run type-check
    
    # 构建检查
    echo -e "${BLUE}🏗️ Running build check...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ Build check passed${NC}"
}

# 提交更改
commit_changes() {
    echo -e "${BLUE}📝 Preparing commit...${NC}"
    
    # 添加所有文件
    git add .
    
    # 检查是否有更改
    if git diff --staged --quiet; then
        echo -e "${YELLOW}⚠️ No changes to commit${NC}"
        return 0
    fi
    
    # 显示将要提交的文件
    echo -e "${BLUE}📋 Files to be committed:${NC}"
    git diff --staged --name-only | sed 's/^/   /'
    
    # 询问提交信息
    echo ""
    echo -e "${BLUE}💬 Enter commit message (or press Enter for default):${NC}"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Deploy MiningReg with Hugging Face integration

🚀 Features:
- Integrated Hugging Face API for LLM functionality
- Added AI chat, embeddings, and report generation
- Configured complete database schema with Prisma
- Set up Vercel deployment configuration
- Added health check and monitoring endpoints
- Implemented bilingual support (EN/FR)
- Ready for production deployment

🛠️ Technical:
- Next.js 15 with TypeScript
- Hugging Face Inference API
- PostgreSQL + MongoDB + Redis architecture
- Comprehensive API routes
- Automated CI/CD pipeline"
    fi
    
    # 提交更改
    git commit -m "$commit_message"
    echo -e "${GREEN}✅ Changes committed${NC}"
}

# 推送到GitHub
push_to_github() {
    echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
    
    # 检查当前分支
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$BRANCH" ]; then
        echo -e "${YELLOW}⚠️ Current branch is '$current_branch', switching to '$BRANCH'${NC}"
        git checkout -b $BRANCH 2>/dev/null || git checkout $BRANCH
    fi
    
    # 推送到远程仓库
    echo -e "${BLUE}📤 Pushing to origin/$BRANCH...${NC}"
    
    if git push -u origin $BRANCH; then
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to push to GitHub${NC}"
        echo -e "${YELLOW}💡 This might be due to:${NC}"
        echo -e "${YELLOW}   1. Authentication issues${NC}"
        echo -e "${YELLOW}   2. Repository permissions${NC}"
        echo -e "${YELLOW}   3. Network connectivity${NC}"
        echo ""
        echo -e "${BLUE}🔧 Try these solutions:${NC}"
        echo -e "${BLUE}   1. Check your GitHub authentication:${NC}"
        echo -e "${BLUE}      git config --global user.name 'Your Name'${NC}"
        echo -e "${BLUE}      git config --global user.email 'your.email@example.com'${NC}"
        echo -e "${BLUE}   2. Use GitHub CLI: gh auth login${NC}"
        echo -e "${BLUE}   3. Use SSH instead of HTTPS${NC}"
        return 1
    fi
}

# 显示下一步
show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Code successfully pushed to GitHub!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps for Vercel Deployment:${NC}"
    echo ""
    echo -e "${YELLOW}1. 🌐 Visit Vercel Dashboard:${NC}"
    echo "   https://vercel.com/dashboard"
    echo ""
    echo -e "${YELLOW}2. 📦 Import Project:${NC}"
    echo "   - Click 'New Project'"
    echo "   - Import from GitHub: $REPO_URL"
    echo ""
    echo -e "${YELLOW}3. ⚙️ Configure Environment Variables:${NC}"
    echo "   - HUGGINGFACE_API_KEY=hf_your_api_key"
    echo "   - DATABASE_URL=postgresql://..."
    echo "   - NEXTAUTH_SECRET=your_secret_key"
    echo "   - GOOGLE_CLIENT_ID=your_google_client_id"
    echo "   - GOOGLE_CLIENT_SECRET=your_google_client_secret"
    echo ""
    echo -e "${YELLOW}4. 🚀 Deploy:${NC}"
    echo "   - Click 'Deploy'"
    echo "   - Wait for build to complete"
    echo ""
    echo -e "${YELLOW}5. 🗄️ Initialize Database:${NC}"
    echo "   - Run database migrations"
    echo "   - Import seed data"
    echo ""
    echo -e "${BLUE}📖 For detailed instructions, see:${NC}"
    echo "   - VERCEL_DEPLOYMENT_GUIDE.md"
    echo "   - README.md"
    echo ""
    echo -e "${GREEN}🔗 Repository URL: $REPO_URL${NC}"
}

# 主函数
main() {
    echo -e "${BLUE}Starting GitHub push process...${NC}"
    echo ""
    
    check_git_status
    check_files
    check_env_files
    build_check
    commit_changes
    
    if push_to_github; then
        show_next_steps
    else
        echo ""
        echo -e "${RED}❌ Push failed. Please resolve the issues and try again.${NC}"
        exit 1
    fi
}

# 运行主函数
main "$@"
