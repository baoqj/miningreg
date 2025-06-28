import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SubscriptionType, SubscriptionPlan, SubscriptionStatus } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's personal subscription
    const personalSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        type: SubscriptionType.PERSONAL
      }
    })

    // Get organization subscriptions
    const organizationSubscriptions = await prisma.subscription.findMany({
      where: {
        organization: {
          memberships: {
            some: {
              userId: session.user.id
            }
          }
        },
        type: {
          in: [SubscriptionType.TEAM, SubscriptionType.ORGANIZATION]
        }
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({
      personal: personalSubscription,
      organizations: organizationSubscriptions
    })

  } catch (error) {
    console.error("Subscriptions fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { type, plan, organizationId } = await request.json()

    if (!type || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate subscription type and organization
    if (type !== SubscriptionType.PERSONAL && !organizationId) {
      return NextResponse.json(
        { error: "Organization ID required for team/organization subscriptions" },
        { status: 400 }
      )
    }

    if (type !== SubscriptionType.PERSONAL) {
      // Check if user has permission to create subscription for organization
      const membership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: session.user.id,
            organizationId
          }
        }
      })

      if (!membership || membership.role === 'MEMBER') {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        )
      }
    }

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        type,
        ...(type === SubscriptionType.PERSONAL 
          ? { userId: session.user.id }
          : { organizationId }
        )
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Subscription already exists" },
        { status: 400 }
      )
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        type,
        plan,
        status: SubscriptionStatus.ACTIVE,
        ...(type === SubscriptionType.PERSONAL 
          ? { userId: session.user.id }
          : { organizationId }
        ),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    return NextResponse.json({
      message: "Subscription created successfully",
      subscription
    })

  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
