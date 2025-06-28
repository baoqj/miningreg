import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { SubscriptionStatus, SubscriptionType, SubscriptionPlan } from "@prisma/client"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { userId, subscriptionType, organizationId } = session.metadata || {}

  if (!userId || !subscriptionType) {
    console.error("Missing metadata in checkout session")
    return
  }

  // Get the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  // Get price to determine plan
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id)
  const plan = price.metadata?.plan as SubscriptionPlan || SubscriptionPlan.BASIC

  // Create or update subscription in database
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id
    },
    update: {
      status: SubscriptionStatus.ACTIVE,
      stripePriceId: price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      type: subscriptionType as SubscriptionType,
      plan,
      status: SubscriptionStatus.ACTIVE,
      userId: subscriptionType === 'PERSONAL' ? userId : undefined,
      organizationId: organizationId || undefined,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // This is handled in checkout.session.completed
  console.log("Subscription created:", subscription.id)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: subscription.status === 'active' ? SubscriptionStatus.ACTIVE :
             subscription.status === 'canceled' ? SubscriptionStatus.CANCELED :
             subscription.status === 'past_due' ? SubscriptionStatus.PAST_DUE :
             SubscriptionStatus.UNPAID,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: SubscriptionStatus.CANCELED
    }
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string
      },
      data: {
        status: SubscriptionStatus.ACTIVE
      }
    })
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string
      },
      data: {
        status: SubscriptionStatus.PAST_DUE
      }
    })
  }
}
