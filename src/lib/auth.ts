import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserbyEmail } from "./server-utils";
import { authSchema } from "@/lib/validations";

const config = {
  pages: {
    signIn: "/login",
  },
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
  callbacks: {
  authorized: ({ auth, request }) => {
    const isLoggedin = Boolean(auth?.user?.email);

    const isTryingToAccessApp =
      request.nextUrl.pathname.includes("/app");

    // Not logged in + trying to access app → block
    if (!isLoggedin && isTryingToAccessApp) {
      return false;
    }

    // Logged in + trying to access app + no access → payment
    if (isLoggedin && isTryingToAccessApp && !auth?.user.hasAccess) {
      return Response.redirect(new URL("/payment", request.url));
    }

    // Logged in + trying to access app + has access → allow
    if (isLoggedin && isTryingToAccessApp && auth?.user.hasAccess) {
      return true;
    }

    // Logged in + trying to access login/signup + no access → payment
    if (isLoggedin && !isTryingToAccessApp) {
      if (
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        !auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/payment", request.url));
      }
      return true;
    }

    // Not logged in + public route → allow
    if (!isLoggedin && !isTryingToAccessApp) {
      return true;
    }

return false;  
  },
  jwt: ({token, user}) => {
    if (user) {
      token.userId = user.id;
      token.hasAccess = user.hasAccess;
    }
    return token;
  },
  session: ({session, token}) => {
    if (session.user) {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;
    }
    return session;
},
},
} satisfies NextAuthConfig;


export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);