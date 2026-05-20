import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import prisma from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
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
  callbacks: {
  authorized: ({ auth, request }) => {
    const isLoggedin = Boolean(auth?.user?.email);

    const isTryingToAccessApp =
      request.nextUrl.pathname.includes("/app");

    if (!isLoggedin && isTryingToAccessApp) {
      return false;
    }

    if (isLoggedin && isTryingToAccessApp) {
      return true;
    }

    if (isLoggedin && !isTryingToAccessApp) {
      return Response.redirect(new URL("/app/dashboard", request.url));
    }

    if (!isLoggedin && !isTryingToAccessApp) {
      return true;
    }

    return false;
    
  },
  jwt: ({token, user}) => {
    if (user) {
      token.userId = user.id;
    }
    return token;
  },
  session: ({session, token}) => {
    if (session.user) {
      session.user.id = token.userId;
    }
    return session;
},
},
} satisfies NextAuthConfig;


export const { auth, signIn, signOut } = NextAuth(config);