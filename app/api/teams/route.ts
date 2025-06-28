import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TeamRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    let whereClause: any = {
      memberships: {
        some: {
          userId: session.user.id
        }
      }
    }

    if (organizationId) {
      whereClause.organizationId = organizationId
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        memberships: {
          where: {
            userId: session.user.id
          },
          select: {
            role: true
          }
        },
        _count: {
          select: {
            memberships: true
          }
        }
      }
    })

    return NextResponse.json(teams)

  } catch (error) {
    console.error("Teams fetch error:", error)
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

    const { name, description, organizationId } = await request.json()

    if (!name || !organizationId) {
      return NextResponse.json(
        { error: "Team name and organization are required" },
        { status: 400 }
      )
    }

    // Check if user has permission to create teams in this organization
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

    const team = await prisma.team.create({
      data: {
        name,
        description,
        organizationId,
        memberships: {
          create: {
            userId: session.user.id,
            role: TeamRole.ADMIN
          }
        }
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        memberships: {
          where: {
            userId: session.user.id
          }
        }
      }
    })

    return NextResponse.json({
      message: "Team created successfully",
      team
    })

  } catch (error) {
    console.error("Team creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
