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

    const preferences = await prisma.jurisdictionPreference.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        priority: 'asc'
      }
    })

    return NextResponse.json(preferences)

  } catch (error) {
    console.error("Jurisdiction preferences fetch error:", error)
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

    const { preferences } = await request.json()

    if (!Array.isArray(preferences)) {
      return NextResponse.json(
        { error: "Invalid preferences format" },
        { status: 400 }
      )
    }

    // Delete existing preferences
    await prisma.jurisdictionPreference.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    // Create new preferences
    if (preferences.length > 0) {
      await prisma.jurisdictionPreference.createMany({
        data: preferences.map((pref: any, index: number) => ({
          userId: session.user.id,
          jurisdiction: pref.jurisdiction,
          enabled: pref.enabled,
          priority: index + 1
        }))
      })
    }

    const updatedPreferences = await prisma.jurisdictionPreference.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        priority: 'asc'
      }
    })

    return NextResponse.json({
      message: "Jurisdiction preferences updated successfully",
      preferences: updatedPreferences
    })

  } catch (error) {
    console.error("Jurisdiction preferences update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
