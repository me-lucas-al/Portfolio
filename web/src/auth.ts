import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { AuthService } from "@portfolio/core/src/services/_auth";
import { CreateUserType } from "@portfolio/packages/index";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const user = await AuthService.login(credentials as CreateUserType);

          if (user) {
            return {
              ...user,
              id: user.id.toString(),
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
