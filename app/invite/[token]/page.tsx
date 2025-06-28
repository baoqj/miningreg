"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building, Users, Mail, Calendar, CheckCircle, XCircle } from "lucide-react"

interface InvitationData {
  id: string
  email: string
  type: string
  role: string
  expiresAt: string
  organization?: {
    name: string
    description?: string
  }
  inviter: {
    name: string
    email: string
  }
}

export default function InvitePage({ params }: { params: { token: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchInvitation()
  }, [params.token])

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/${params.token}`)
      const data = await response.json()

      if (response.ok) {
        setInvitation(data)
      } else {
        setError(data.error || "Invalid invitation")
      }
    } catch (error) {
      setError("Failed to load invitation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/invite/${params.token}`)
      return
    }

    setIsAccepting(true)
    setError("")

    try {
      const response = await fetch(`/api/invitations/${params.token}/accept`, {
        method: "POST"
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Invitation accepted successfully!")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError(data.error || "Failed to accept invitation")
      }
    } catch (error) {
      setError("An error occurred while accepting the invitation")
    } finally {
      setIsAccepting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {invitation?.type === "ORGANIZATION" ? (
              <Building className="h-12 w-12 text-blue-600" />
            ) : (
              <Users className="h-12 w-12 text-blue-600" />
            )}
          </div>
          <CardTitle>
            You're invited to join {invitation?.organization?.name}
          </CardTitle>
          <CardDescription>
            {invitation?.type === "ORGANIZATION" 
              ? "Join this organization to collaborate with your team"
              : "Join this team to work together on projects"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {invitation && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    {invitation.inviter.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{invitation.inviter.name}</p>
                  <p className="text-xs text-gray-500">{invitation.inviter.email}</p>
                </div>
                <Badge variant="secondary">{invitation.role}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>Invited: {invitation.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {invitation.organization?.description && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {invitation.organization.description}
                  </p>
                </div>
              )}

              {!session ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">
                    You need to sign in to accept this invitation
                  </p>
                  <Button 
                    onClick={() => router.push(`/auth/signin?callbackUrl=/invite/${params.token}`)}
                    className="w-full"
                  >
                    Sign In to Accept
                  </Button>
                  <Button 
                    onClick={() => router.push(`/auth/signup?callbackUrl=/invite/${params.token}`)}
                    variant="outline"
                    className="w-full"
                  >
                    Create Account
                  </Button>
                </div>
              ) : session.user.email !== invitation.email ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    This invitation is for {invitation.email}, but you're signed in as {session.user.email}.
                    Please sign in with the correct account.
                  </AlertDescription>
                </Alert>
              ) : (
                <Button 
                  onClick={handleAcceptInvitation}
                  disabled={isAccepting}
                  className="w-full"
                >
                  {isAccepting ? "Accepting..." : "Accept Invitation"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
