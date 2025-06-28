import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OrgRole } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const organizations = await prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        memberships: {
          where: {
            userId: session.user.id
          },
          select: {
            role: true,
            joinedAt: true
          }
        },
        _count: {
          select: {
            memberships: true,
            teams: true
          }
        }
      }
    })

    return NextResponse.json(organizations)

  } catch (error) {
    console.error("Organizations fetch error:", error)
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

    const { name, description, industry, size, website } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug }
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization name already taken" },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        industry,
        size,
        website,
        memberships: {
          create: {
            userId: session.user.id,
            role: OrgRole.OWNER
          }
        },
        settings: {
          create: {
            defaultJurisdictions: ["federal", "ontario"]
          }
        }
      },
      include: {
        memberships: {
          where: {
            userId: session.user.id
          }
        }
      }
    })

    return NextResponse.json({
      message: "Organization created successfully",
      organization
    })

  } catch (error) {
    console.error("Organization creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
