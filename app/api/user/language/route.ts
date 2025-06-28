import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { language } = await request.json()

    if (!language || !['en', 'fr'].includes(language)) {
      return NextResponse.json(
        { error: "Invalid language. Must be 'en' or 'fr'" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { language },
      select: {
        id: true,
        language: true,
      }
    })

    return NextResponse.json({
      message: "Language preference updated successfully",
      language: updatedUser.language
    })

  } catch (error) {
    console.error("Language update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
