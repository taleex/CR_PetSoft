import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserbyEmail } from "./server-utils";
import { authSchema } from "@/lib/validations";
import { nextAuthEdgeConfig } from "./auth-edge";

const config = {
  ...nextAuthEdgeConfig,
  providers: [
    Credentials({
      async authorize(credentials) {

        //validation
        const validdatedFormData = authSchema.safeParse(credentials); 
          if (!validdatedFormData.success) {
              return null;
          }

        // extract values
        const { email, password } = validdatedFormData.data;

        const user = await getUserbyEmail(email);
        
        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;


export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);