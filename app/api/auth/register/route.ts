import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, title } = await request.json()

    // Validate input
    if (!email || !password || !name) {
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
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with default settings
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        title,
        role: UserRole.USER,
        language: "en",
        timezone: "America/Toronto"
      },
      select: {
        id: true,
        email: true,
        name: true,
        title: true,
        role: true,
      }
    })

    return NextResponse.json({
      message: "User created successfully",
      user
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
