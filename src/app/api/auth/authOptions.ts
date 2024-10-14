import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import connect from "@/app/utils/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Interface para as credenciais
interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        // Verifica se as credenciais foram fornecidas
        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        await connect();

        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error("Invalid credentials");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (err) {
          console.log(err);
          throw new Error(
            `Authorization error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
        }
      },
    }),
  ],
};
