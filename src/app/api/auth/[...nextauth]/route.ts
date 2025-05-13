// /app/api/auth/[...nextauth]/route.ts (or /pages/api/auth/[...nextauth].ts if using Pages router)
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Users from "@/models/Users";
import { mongooseConnection } from "@/lib/mongooseconnection";
import { applyRateLimit } from "@/lib/ratelimiter";
import { RateLimitRequestInterface } from "@/types/rateLimitTypes";

// Extend Session and JWT types
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      username?: string | null;
      email?: string | null;
      accessToken?: string;
      provider?: string;
      role?: string;
      error?: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    provider?: string;
    role?: string;
    email?: string;
    name?: string;
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = (req as RateLimitRequestInterface)?.headers["x-forwarded-for"] || "";
        await applyRateLimit(ip);

        const { email, password } = credentials || {};
        if (!email || !password) throw new Error("Email and password are required.");

        await mongooseConnection();

        const user = await Users.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) throw new Error("User not found.");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password.");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      await mongooseConnection();

      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        let email = profile?.email?.toLowerCase()?.trim();
        if (!email && token.email) email = token.email;

        let user;

        if (account) {
          token.accessToken = account.access_token;
          token.provider = account.provider;
        
          let email = profile?.email?.toLowerCase()?.trim();
          if (!email && token.email) email = token.email;
        
          let user;
        
          if (email) {
            user = await Users.findOne({ email });
        
            if (!user) {
              user = await Users.create({
                username: profile?.name || "New User",
                email,
                role: "buyer",
                provider: account.provider,
              });
            } else if (user.provider !== account.provider) {
              user.provider = account.provider;
              await user.save();
            }
            // ✅ Always assign token values
            token.id = user._id.toString();
            token.role = user.role;
            token.email = user.email;
            token.name = user.username;
          }
        }
        
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.id) {
        delete session.user;
      } else {
        session.user = {
          id: token.id,
          accessToken: token.accessToken,
          provider: token.provider,
          role: token.role,
          error: token.error,
          email: token.email || null,
          username: token.name || null,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/authentication/signin",
    error: "/authentication/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
