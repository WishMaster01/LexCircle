import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { env, isAdminCredentialsConfigured, isGoogleAuthConfigured } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const normalizedEmail = credentials.email.toLowerCase();

        if (
          isAdminCredentialsConfigured() &&
          normalizedEmail === env.ADMIN_EMAIL?.toLowerCase() &&
          credentials.password === env.ADMIN_PASSWORD
        ) {
          return {
            id: "env-admin",
            name: env.ADMIN_NAME ?? "LexCircle Admin",
            email: env.ADMIN_EMAIL?.toLowerCase(),
            image: null,
            username: "admin",
            role: UserRole.ADMIN,
            isSuspended: false,
            isPortalAdmin: true,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid || user.isSuspended) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username,
          role: user.role,
          isSuspended: user.isSuspended,
          isPortalAdmin: false,
        };
      },
    }),
    ...(isGoogleAuthConfigured()
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as { username?: string | null }).username ?? null;
        token.role = (user as { role?: UserRole }).role ?? UserRole.USER;
        token.isSuspended = (user as { isSuspended?: boolean }).isSuspended ?? false;
        token.isPortalAdmin = (user as { isPortalAdmin?: boolean }).isPortalAdmin ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string | null | undefined) ?? null;
        session.user.role = (token.role as UserRole | undefined) ?? UserRole.USER;
        session.user.isSuspended = (token.isSuspended as boolean | undefined) ?? false;
        session.user.isPortalAdmin = (token.isPortalAdmin as boolean | undefined) ?? false;
      }

      return session;
    },
  },
};

export const nextAuth = NextAuth(authOptions);
