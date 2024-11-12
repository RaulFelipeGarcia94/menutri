import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import connect from "@/app/utils/db";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { ObjectId } from "mongoose";

interface Credentials {
  email: string;
  password: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    id: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
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
              return user; // Retorna o objeto user diretamente
            } else {
              throw new Error("Invalid credentials");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (err) {
          throw new Error(`Authorization error: ${err}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = user as typeof user & { _id: ObjectId }; // Asserção de tipo
        token.id = dbUser._id.toString();
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
