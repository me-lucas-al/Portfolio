import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { makeAuthService } from "@portfolio/core/src/factories/_index";
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
          const user = await makeAuthService().login(credentials as CreateUserType);

          if (user) {
            return {
              ...user,
              id: user.id.toString(),
              role: user.role,
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
