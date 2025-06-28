import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        phone: true,
        language: true,
        timezone: true,
        role: true,
        image: true,
        jurisdictionPreferences: {
          select: {
            jurisdiction: true,
            enabled: true,
            priority: true,
          },
          orderBy: {
            priority: 'asc'
          }
        },
        notificationSettings: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, title, phone, language, timezone } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        title,
        phone,
        language,
        timezone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        phone: true,
        language: true,
        timezone: true,
        role: true,
        image: true,
      }
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
