import prisma  from "@portfolio/database"
import { CreateUserSchema, CreateUserType } from "@portfolio/packages/schemas/user"
import bcrypt from "bcryptjs"
import { BadRequestError, ConflictError } from "./errors/status"
import { TokenService } from "./token"
export class AuthService {
  static async login(credentials: CreateUserType) {
    const { username, password } = CreateUserSchema.parse(credentials)

    const user = await prisma.user.findUnique({
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
      role: user.role,
      accessToken,
    }
  }

  static async register(data: CreateUserType) {
    const { username, password } = CreateUserSchema.parse(data)

    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) throw new ConflictError("Nome de usuário já existente")

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'USER'
      },
    })

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}