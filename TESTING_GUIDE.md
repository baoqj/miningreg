# MiningReg 测试指南

## 本地开发环境设置

### 1. 启动开发服务器
```bash
cd miningreg
npm run dev
```

服务器将在 http://localhost:3000 启动

### 2. 数据库设置
数据库已经初始化完成，使用SQLite存储在 `dev.db` 文件中。

## 功能测试流程

### 用户注册和登录测试

1. **访问注册页面**
   - 打开 http://localhost:3000/auth/signup
   - 填写用户信息（姓名、邮箱、密码）
   - 点击"Create account"

2. **登录测试**
   - 注册成功后会自动登录
   - 或者访问 http://localhost:3000/auth/signin
   - 使用邮箱密码登录

3. **Google OAuth登录**
   - 需要配置真实的Google OAuth凭据
   - 在 `.env` 文件中设置 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`

### 主要功能测试

1. **用户个人资料**
   - 登录后点击右上角用户头像 → Profile
   - 测试个人信息编辑
   - 测试管辖区偏好设置

2. **团队和组织管理**
   - 点击用户菜单 → Teams & Organizations
   - 创建新组织
   - 在组织内创建团队
   - 测试邀请功能

3. **订阅管理**
   - 点击用户菜单 → Subscriptions & Alerts
   - 查看当前订阅状态
   - 测试升级计划（需要配置Stripe）

## Stripe支付测试

### 设置Stripe测试环境

1. **获取Stripe测试密钥**
   - 注册 https://stripe.com 账户
   - 获取测试环境的 Publishable Key 和 Secret Key
   - 更新 `.env` 文件中的Stripe配置

2. **创建产品和价格**
   ```bash
   # 设置环境变量后运行
   node scripts/setup-stripe.js
   ```

3. **测试支付流程**
   - 访问订阅页面
   - 选择升级计划
   - 使用Stripe测试卡号：4242 4242 4242 4242
   - 任意未来日期和CVC

### Stripe测试卡号
- **成功支付**: 4242 4242 4242 4242
- **需要验证**: 4000 0025 0000 3155
- **被拒绝**: 4000 0000 0000 0002

## 数据库管理

### 查看数据库
```bash
npx prisma studio
```

### 重置数据库
```bash
npx prisma db push --force-reset
```

### 查看数据库结构
```bash
npx prisma db pull
```

## 常见问题解决

### 1. 注册时出现"An error occurred"
- 检查数据库是否正确初始化
- 查看终端错误日志
- 确认所有必需字段都已填写

### 2. Stripe支付失败
- 确认Stripe密钥配置正确
- 检查价格ID是否存在
- 使用正确的测试卡号

### 3. 环境变量问题
- 确保 `.env` 文件存在且配置正确
- 重启开发服务器以加载新的环境变量

## API端点测试

### 用户相关
- `POST /api/auth/register` - 用户注册
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `GET /api/user/jurisdictions` - 获取管辖区偏好
- `PUT /api/user/jurisdictions` - 更新管辖区偏好

### 组织和团队
- `GET /api/organizations` - 获取用户组织
- `POST /api/organizations` - 创建组织
- `GET /api/teams` - 获取用户团队
- `POST /api/teams` - 创建团队

### 邀请系统
- `POST /api/invitations` - 发送邀请
- `GET /api/invitations` - 获取邀请列表
- `POST /api/invitations/[token]/accept` - 接受邀请

### 订阅管理
- `GET /api/subscriptions` - 获取订阅信息
- `POST /api/stripe/checkout` - 创建支付会话
- `POST /api/stripe/webhook` - Stripe webhook处理

## 生产环境部署注意事项

1. **环境变量**
   - 设置生产环境的数据库URL
   - 配置真实的Stripe密钥
   - 设置安全的NEXTAUTH_SECRET

2. **数据库**
   - 使用PostgreSQL或MySQL替代SQLite
   - 运行数据库迁移

3. **Stripe Webhook**
   - 配置生产环境的webhook端点
   - 设置正确的webhook密钥
