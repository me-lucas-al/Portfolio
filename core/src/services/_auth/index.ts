// src/services/auth-service.ts
import { prisma } from "@/lib/prisma"
import { AdminSchema } from "@packages/schemas/admin"
import bcrypt from "bcryptjs"
import { z } from "zod"



export class AuthService {
  static async login(credentials: unknown) {
    const { username, password } = AdminSchema.parse(credentials)

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) throw new Error("Usuário não encontrado.")

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) throw new Error("Senha incorreta.")

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    }
  }

  static async register(data: unknown) {
    const { username, password, name } = registerSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      throw new Error("Este username já está em uso.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
      },
    })

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}