import { withAuth } from "next-auth/middleware";

// Nota: esta middleware é uma forma simples de proteger /app e não segue o tutorial Bytegrad de forma estrita.
// O withAuth do next-auth redireciona para /login quando a rota é /app e o usuário não está autenticado.
export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ req }) => req.nextUrl.pathname.startsWith("/app"),
  },
});

export const config = {
  matcher: ["/app/:path*"],
};