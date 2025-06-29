#!/usr/bin/env node

console.log("🔍 检查环境变量配置")
console.log("===================")

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL'
]

const optionalVars = [
  'HUGGINGFACE_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY'
]

console.log("\n📋 必需的环境变量:")
requiredVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? "✅" : "❌"
  const display = value ? (varName.includes('SECRET') || varName.includes('KEY') ? '[HIDDEN]' : value) : 'NOT SET'
  console.log(`${status} ${varName}: ${display}`)
})

console.log("\n📋 可选的环境变量:")
optionalVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? "✅" : "⚠️"
  const display = value ? '[SET]' : 'NOT SET'
  console.log(`${status} ${varName}: ${display}`)
})

console.log("\n🔧 修复建议:")

if (!process.env.NEXTAUTH_SECRET) {
  console.log("❌ NEXTAUTH_SECRET 未设置")
  console.log("   生成命令: openssl rand -base64 32")
}

if (!process.env.NEXTAUTH_URL) {
  console.log("❌ NEXTAUTH_URL 未设置")
  console.log("   生产环境应设置为: https://mining-reg-ai.vercel.app")
  console.log("   开发环境应设置为: http://localhost:3000")
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log("❌ Google OAuth 配置不完整")
  console.log("   请在 Google Cloud Console 配置 OAuth 2.0")
  console.log("   回调URL: https://mining-reg-ai.vercel.app/api/auth/callback/google")
}

console.log("\n🎯 下一步:")
console.log("1. 在 Vercel Dashboard 设置环境变量")
console.log("2. 确保 Google OAuth 回调URL 正确")
console.log("3. 重新部署应用")
