import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { priceId, subscriptionType = "PERSONAL", organizationId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: {
            type: subscriptionType,
            ...(organizationId && { organizationId })
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user already has a Stripe customer ID
    const existingSubscription = user.subscriptions.find(sub => sub.stripeCustomerId)
    
    if (existingSubscription?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(existingSubscription.stripeCustomerId)
    } else {
      // Create new Stripe customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
          subscriptionType,
          ...(organizationId && { organizationId })
        }
      })
    }

    // Create Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/subscriptions?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/subscriptions?canceled=true`,
      metadata: {
        userId: session.user.id,
        subscriptionType,
        ...(organizationId && { organizationId })
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          subscriptionType,
          ...(organizationId && { organizationId })
        }
      }
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })

  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
