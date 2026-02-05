import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { UnauthorizedError } from "./errors/status"

export class TokenService {
  private static secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  )

  static async generate(payload: JWTPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") 
      .sign(this.secret)
  }

  static async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, this.secret)
      return payload
    } catch (error) {
      throw new UnauthorizedError()
    }
  }
}