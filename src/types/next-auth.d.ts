import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username?: string | null;
      role: UserRole;
      isSuspended?: boolean;
    };
  }

  interface User {
    username?: string | null;
    role: UserRole;
    isSuspended?: boolean;
  }
}
