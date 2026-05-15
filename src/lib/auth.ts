import type { NextAuthOptions } from "next-auth";

// Nota: esta configuração é uma versão simplificada e não segue o tutorial Bytegrad passo a passo.
// Aqui deixamos apenas o mínimo necessário para o NextAuth funcionar com a página de login.
export const authOptions: NextAuthOptions = {
  // Secret obrigatório para o NextAuth proteger sessões e JWT.
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [],
};
