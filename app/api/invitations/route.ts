import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InvitationType } from "@prisma/client"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { email, type, role, organizationId, teamId } = await request.json()

    if (!email || !type || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Check if user is already a member
      if (type === InvitationType.ORGANIZATION && organizationId) {
        const existingMembership = await prisma.organizationMembership.findUnique({
          where: {
            userId_organizationId: {
              userId: existingUser.id,
              organizationId
            }
          }
        })

        if (existingMembership) {
          return NextResponse.json(
            { error: "User is already a member of this organization" },
            { status: 400 }
          )
        }
      }

      if (type === InvitationType.TEAM && teamId) {
        const existingMembership = await prisma.teamMembership.findUnique({
          where: {
            userId_teamId: {
              userId: existingUser.id,
              teamId
            }
          }
        })

        if (existingMembership) {
          return NextResponse.json(
            { error: "User is already a member of this team" },
            { status: 400 }
          )
        }
      }
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        type,
        role,
        organizationId,
        teamId,
        invitedBy: session.user.id,
        expiresAt
      },
      include: {
        inviter: {
          select: {
            name: true,
            email: true
          }
        },
        organization: {
          select: {
            name: true
          }
        }
      }
    })

    // TODO: Send invitation email
    // await sendInvitationEmail(invitation)

    return NextResponse.json({
      message: "Invitation sent successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        type: invitation.type,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        inviteUrl: `${process.env.APP_URL}/invite/${invitation.token}`
      }
    })

  } catch (error) {
    console.error("Invitation creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get invitations sent by the user
    const sentInvitations = await prisma.invitation.findMany({
      where: {
        invitedBy: session.user.id,
        acceptedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get pending invitations for the user
    const pendingInvitations = await prisma.invitation.findMany({
      where: {
        email: session.user.email!,
        acceptedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        inviter: {
          select: {
            name: true,
            email: true
          }
        },
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      sent: sentInvitations,
      pending: pendingInvitations
    })

  } catch (error) {
    console.error("Invitations fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
