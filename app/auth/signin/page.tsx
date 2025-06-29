"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTranslations, useLanguage } from '@/components/providers/language-provider'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, Mail, Lock, Chrome, ArrowLeft } from "lucide-react"

export default function SignInPage() {
  const t = useTranslations('auth.signin')
  const { locale } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('invalidCredentials'))
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      setError(t('error'))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
          </Button>
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <Scale className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('welcome')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              {t('continueWithGoogle')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signinButton')}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {t('forgotPassword')}
              </Link>
              <div className="text-sm text-gray-600">
                {t('noAccount')}{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {t('signupLink')}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
