import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      language?: string | null
    }
  }

  interface User {
    role: UserRole
    language?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    language: string
  }
}
