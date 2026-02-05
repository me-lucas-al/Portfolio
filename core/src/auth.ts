import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AuthService } from "./services/_auth" 
import { CreateAdminSchema } from "@packages/schemas/admin"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await AuthService.login(credentials as any)
          return user
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.username = user.username as string
        token.accessToken = (user as any).accessToken 
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.username = token.username as string
        session.user.accessToken = token.accessToken as string 
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login", 
  },
})