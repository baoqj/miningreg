"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  Check, 
  Star, 
  Building, 
  User,
  Calendar,
  DollarSign
} from "lucide-react"

interface Subscription {
  id: string
  type: string
  plan: string
  status: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  organization?: {
    id: string
    name: string
    slug: string
  }
}

interface SubscriptionData {
  personal: Subscription | null
  organizations: Subscription[]
}

const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "Basic legal consultation",
      "5 queries per month",
      "Standard templates",
      "Email support"
    ]
  },
  BASIC: {
    name: "Basic",
    price: 29,
    features: [
      "Unlimited legal consultation",
      "Advanced templates",
      "Priority email support",
      "Basic compliance tracking"
    ]
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 99,
    features: [
      "Everything in Basic",
      "AI report generation",
      "Advanced compliance dashboard",
      "Phone support",
      "Team collaboration (up to 5 members)"
    ]
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 299,
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee"
    ]
  }
}

export default function SubscriptionsPage() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<SubscriptionData>({
    personal: null,
    organizations: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (session) {
      fetchSubscriptions()
    }
  }, [session])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions")
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data)
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (plan: string, type: string = "PERSONAL", organizationId?: string) => {
    setMessage("")

    if (plan === "FREE") {
      // Handle downgrade to free plan
      setMessage("Downgrade functionality will be implemented")
      return
    }

    try {
      // Get the price ID for the plan
      const priceId = getPriceIdForPlan(plan)

      if (!priceId) {
        setMessage("Invalid plan selected")
        return
      }

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priceId,
          subscriptionType: type,
          organizationId
        })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setMessage(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      setMessage("An error occurred")
    }
  }

  const getPriceIdForPlan = (plan: string) => {
    // These would be your actual Stripe price IDs from environment variables
    const priceIds: Record<string, string> = {
      BASIC: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "price_basic_test",
      PROFESSIONAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || "price_professional_test",
      ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || "price_enterprise_test"
    }
    return priceIds[plan]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "CANCELED":
        return <Badge variant="destructive">Canceled</Badge>
      case "PAST_DUE":
        return <Badge variant="secondary">Past Due</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions & Billing</h1>
          <p className="text-gray-600">Manage your subscription plans and billing</p>
        </div>

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Subscription</TabsTrigger>
            <TabsTrigger value="organizations">Organization Subscriptions</TabsTrigger>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Subscription</span>
                  </CardTitle>
                  <CardDescription>
                    Your individual subscription for personal use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptions.personal ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium">
                            {PLANS[subscriptions.personal.plan as keyof typeof PLANS]?.name || subscriptions.personal.plan}
                          </h3>
                          <p className="text-gray-600">
                            ${PLANS[subscriptions.personal.plan as keyof typeof PLANS]?.price || 0}/month
                          </p>
                        </div>
                        {getStatusBadge(subscriptions.personal.status)}
                      </div>

                      {subscriptions.personal.currentPeriodEnd && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Renews on {new Date(subscriptions.personal.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Manage Billing
                        </Button>
                        <Button variant="outline">Cancel Subscription</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscription</h3>
                      <p className="text-gray-600 mb-4">
                        You're currently on the free plan with limited features
                      </p>
                      <Button onClick={() => handleUpgrade("BASIC")}>
                        Upgrade to Basic
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Organization Subscriptions</h2>
              
              {subscriptions.organizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.organizations.map((sub) => (
                    <Card key={sub.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Building className="h-5 w-5" />
                          <span>{sub.organization?.name}</span>
                        </CardTitle>
                        <CardDescription>
                          {PLANS[sub.plan as keyof typeof PLANS]?.name || sub.plan} Plan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-medium">
                                ${PLANS[sub.plan as keyof typeof PLANS]?.price || 0}/month
                              </p>
                              <p className="text-sm text-gray-600">{sub.type} subscription</p>
                            </div>
                            {getStatusBadge(sub.status)}
                          </div>

                          {sub.currentPeriodEnd && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Renews on {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No organization subscriptions</h3>
                    <p className="text-gray-600 mb-4">
                      Create an organization and upgrade to unlock team features
                    </p>
                    <Button variant="outline">
                      Create Organization
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="plans">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choose Your Plan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <Card key={key} className={`relative ${key === 'PROFESSIONAL' ? 'border-blue-500 shadow-lg' : ''}`}>
                    {key === 'PROFESSIONAL' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        ${plan.price}
                        <span className="text-lg font-normal text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className="w-full" 
                        variant={key === 'PROFESSIONAL' ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(key)}
                        disabled={subscriptions.personal?.plan === key}
                      >
                        {subscriptions.personal?.plan === key ? 'Current Plan' : 
                         key === 'FREE' ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
