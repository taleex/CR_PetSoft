import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Rota API mínima do NextAuth. Não é exatamente o fluxo do tutorial Bytegrad,
// mas é necessária para o NextAuth funcionar no servidor.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
