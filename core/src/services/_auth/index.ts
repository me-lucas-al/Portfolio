import prisma  from "@portfolio/database"
import { CreateAdminSchema, CreateAdminType } from "@packages/schemas/admin"
import bcrypt from "bcryptjs"
import { BadRequestError, ConflictError } from "./errors/status"
import { TokenService } from "./token"
export class AuthService {
  static async login(credentials: CreateAdminType) {
    const { username, password } = CreateAdminSchema.parse(credentials)

    const user = await prisma.admin.findUnique({
      where: { username },
    })

    if (!user) throw new BadRequestError()

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) throw new BadRequestError()

    const accessToken = await TokenService.generate({
      sub: user.id.toString(),
      username: user.username
    })

    return {
      id: user.id,
      username: user.username,
      accessToken,
    }
  }

  static async register(data: CreateAdminType) {
    const { username, password } = CreateAdminSchema.parse(data)

    const existingUser = await prisma.admin.findUnique({
      where: { username },
    })

    if (existingUser) throw new ConflictError("Nome de usuário já existente")

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}