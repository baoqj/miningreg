"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication."
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
              Authentication Error
            </CardTitle>
            <CardDescription>
              {errorMessages[error] || errorMessages.Default}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Error code: {error || "Unknown"}</p>
            </div>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  Try Again
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {error === "Configuration" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  If you're the administrator, please check your environment variables and OAuth configuration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
