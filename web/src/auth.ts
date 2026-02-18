import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { AuthService }  from "@core/src/services/_auth" 
import { CreateAdminType } from "@packages/index"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await AuthService.login(credentials as CreateAdminType)
          
          if (user) {
            return {
              ...user,
              id: user.id.toString(),
            }
          }
          return null
        } catch (error) {
          return null
        }
      },
    }),
  ],
})