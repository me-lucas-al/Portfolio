import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.username = user.name as string
        token.accessToken = user.accessToken 
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.name = token.username as string
        session.user.accessToken = token.accessToken as string 
      }
      return session
    },
  },
  providers: [], 
} satisfies NextAuthConfig