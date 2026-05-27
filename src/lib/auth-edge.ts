import { NextAuthConfig } from "next-auth";
import prisma  from "./db";

export const nextAuthEdgeConfig = {
      pages: {
    signIn: "/login",
  },callbacks: {
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
  
      // Logged in + trying to access login/signup + has access → dashboard
      if (isLoggedin && (request.nextUrl.pathname.includes("/login") || request.nextUrl.pathname.includes("/signup")) && auth?.user.hasAccess) {
        return Response.redirect(new URL("/app/dashboard", request.url));
      }
  
      // Logged in + trying to access login/signup + no access → payment
      if (isLoggedin && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          (request.nextUrl.pathname.includes("/login") ||
            request.nextUrl.pathname.includes("/signup")) 
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
    jwt: async ({token, user, trigger}) => {
      if (user) {
        token.userId = user.id!
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }
  
      if (trigger === "update") {
        const userFromDb = await prisma.user.findUnique({
        where: {
            email: token.email,
        },
    });
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }
  
      return token;
    },
    session: ({session, token}) => {
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess;
   
        return session;
  },
  },
  providers: [],
} satisfies NextAuthConfig;