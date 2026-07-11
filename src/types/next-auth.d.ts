import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username?: string | null;
      role: UserRole;
      isSuspended?: boolean;
      isPortalAdmin?: boolean;
    };
  }

  interface User {
    username?: string | null;
    role: UserRole;
    isSuspended?: boolean;
    isPortalAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    role?: UserRole;
    isSuspended?: boolean;
    isPortalAdmin?: boolean;
  }
}
