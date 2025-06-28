# MiningReg 双语系统演示指南

## 🌐 双语功能概述

MiningReg 现在支持加拿大官方语言：**英语 (English)** 和 **法语 (Français)**

### 主要特性

1. **无路由前缀设计** - 保持通用路由不变，通过用户设置控制语言
2. **实时语言切换** - 点击即可切换，无需刷新页面
3. **用户偏好保存** - 语言设置保存到用户个人资料和本地存储
4. **智能初始化** - 根据用户设置 → 本地存储 → 浏览器语言自动选择
5. **可扩展架构** - 为未来添加西班牙语、中文等语言做好准备

## 🚀 测试步骤

### 1. 访问测试页面
打开浏览器访问：http://localhost:3000/test-i18n

### 2. 语言切换测试
- 点击右上角的地球图标 🌐
- 选择 "English" 或 "Français"
- 观察页面文本实时切换

### 3. 主要页面测试
- **主页面**: http://localhost:3000
- **登录页面**: http://localhost:3000/auth/signin
- **注册页面**: http://localhost:3000/auth/signup
- **个人资料**: http://localhost:3000/profile

### 4. 用户设置集成
1. 登录系统
2. 访问个人资料页面
3. 在"General"标签下找到"Language"设置
4. 切换语言，设置会自动保存到用户资料

## 📋 已翻译的内容

### 通用词汇 (Common)
- 加载中、保存、取消、删除、编辑等基础操作
- 搜索、筛选、排序等界面元素
- 设置、帮助、关闭等功能按钮

### 导航菜单 (Navigation)
- 仪表板 / Tableau de bord
- 个人资料 / Profil
- 团队和组织 / Équipes et organisations
- 订阅和警报 / Abonnements et alertes
- 管辖区偏好 / Préférences de juridiction
- 登出 / Se déconnecter

### 认证系统 (Authentication)
- 登录页面完整翻译
- 注册页面完整翻译
- 错误消息和提示文本
- 表单标签和占位符

### 个人资料 (Profile)
- 个人信息设置
- 安全设置
- 通知设置
- 管辖区偏好

### 团队管理 (Teams)
- 组织创建和管理
- 团队创建和管理
- 角色和权限
- 邀请系统

### 订阅系统 (Subscriptions)
- 订阅计划描述
- 功能列表
- 状态显示
- 计费信息

## 🔧 技术实现

### 语言上下文 (Language Context)
```typescript
const { locale, setLocale, t } = useLanguage()
```

### 翻译函数使用
```typescript
// 基础翻译
t('common.save') // "Save" / "Enregistrer"

// 命名空间翻译
const tAuth = useTranslations('auth.signin')
tAuth('title') // "Sign in to your account" / "Connectez-vous à votre compte"

// 参数化翻译
t('dashboard.welcome', { name: 'John' }) // "Welcome back, John" / "Bon retour, John"
```

### 语言切换组件
```typescript
<LanguageSwitcher /> // 下拉菜单样式
<LanguageSwitcherCompact /> // 紧凑按钮样式
```

## 🌍 未来扩展

系统架构支持轻松添加更多语言：

### 添加新语言步骤
1. 在 `messages/` 目录添加新的翻译文件（如 `es.json`, `zh.json`）
2. 更新 `LanguageProvider` 中的语言列表
3. 更新 `LanguageSwitcher` 组件的语言选项
4. 更新数据库和API以支持新语言代码

### 建议的未来语言
- **西班牙语 (es)** - 适应拉丁美洲市场
- **中文 (zh)** - 适应亚洲市场
- **德语 (de)** - 适应欧洲市场

## 📊 测试检查清单

- [ ] 语言切换器在所有页面正常显示
- [ ] 点击切换语言后文本立即更新
- [ ] 刷新页面后语言设置保持
- [ ] 登录用户的语言偏好正确保存
- [ ] 新用户根据浏览器语言自动选择
- [ ] 所有翻译文本正确显示，无缺失
- [ ] 参数化翻译（如用户名）正确替换
- [ ] 表单验证消息正确翻译
- [ ] 错误提示消息正确翻译

## 🎯 演示重点

1. **无缝切换** - 展示语言切换的即时性
2. **用户体验** - 强调保持路由不变的优势
3. **数据持久化** - 展示设置保存功能
4. **完整覆盖** - 展示各个页面的翻译效果
5. **扩展性** - 说明未来添加更多语言的可能性

## 📝 注意事项

- 当前系统使用客户端翻译，适合中小型应用
- 翻译文件在构建时打包，确保性能
- 支持嵌套翻译键和参数化文本
- 自动回退到英语（如果翻译缺失）
- 语言设置与用户会话同步
