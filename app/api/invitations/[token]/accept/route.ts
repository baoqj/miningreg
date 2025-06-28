import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InvitationType } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { token } = params

    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        organization: true,
        inviter: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation token" },
        { status: 404 }
      )
    }

    // Check if invitation has expired
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 400 }
      )
    }

    // Check if invitation has already been accepted
    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: "Invitation has already been accepted" },
        { status: 400 }
      )
    }

    // Check if the email matches the current user
    if (invitation.email !== session.user.email) {
      return NextResponse.json(
        { error: "This invitation is for a different email address" },
        { status: 400 }
      )
    }

    // Accept the invitation
    if (invitation.type === InvitationType.ORGANIZATION) {
      // Check if user is already a member
      const existingMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: session.user.id,
            organizationId: invitation.organizationId!
          }
        }
      })

      if (existingMembership) {
        return NextResponse.json(
          { error: "You are already a member of this organization" },
          { status: 400 }
        )
      }

      // Create organization membership
      await prisma.organizationMembership.create({
        data: {
          userId: session.user.id,
          organizationId: invitation.organizationId!,
          role: invitation.role as any
        }
      })
    } else if (invitation.type === InvitationType.TEAM) {
      // Check if user is already a member
      const existingMembership = await prisma.teamMembership.findUnique({
        where: {
          userId_teamId: {
            userId: session.user.id,
            teamId: invitation.teamId!
          }
        }
      })

      if (existingMembership) {
        return NextResponse.json(
          { error: "You are already a member of this team" },
          { status: 400 }
        )
      }

      // Create team membership
      await prisma.teamMembership.create({
        data: {
          userId: session.user.id,
          teamId: invitation.teamId!,
          role: invitation.role as any
        }
      })
    }

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        acceptedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "Invitation accepted successfully",
      organization: invitation.organization
    })

  } catch (error) {
    console.error("Invitation acceptance error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
