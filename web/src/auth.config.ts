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
        // @ts-ignore
        token.username = user.name
        token.accessToken = user.accessToken 
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.name = token.username as string
        // @ts-ignore
        session.user.accessToken = token.accessToken as string 
      }
      return session
    },
  },
  providers: [], // Deixe vazio aqui! O provider real vai no outro arquivo.
} satisfies NextAuthConfig