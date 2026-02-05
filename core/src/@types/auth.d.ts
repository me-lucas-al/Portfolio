import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    username: string
    accessToken: string
  }

  interface Session {
    user: {
      username: string
      accessToken: string
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
    accessToken: string
  }
}