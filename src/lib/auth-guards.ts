import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { errorResponse } from "@/lib/api-response";
import { authOptions } from "@/lib/auth";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function getOptionalAuthSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Optional session lookup failed", error);
    return null;
  }
}

export function isPortalAdminSession(session: Session | null | undefined) {
  return Boolean(session?.user && session.user.role === UserRole.ADMIN && session.user.isPortalAdmin);
}

export async function requireUserPageSession() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminPageSession(signInPath = "/login") {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(signInPath);
  }

  if (!isPortalAdminSession(session)) {
    redirect("/dashboard");
  }

  return session;
}

export async function requireUserRouteSession() {
  const session = await getAuthSession();

  if (!session?.user) {
    return { response: errorResponse("Authentication required", 401) };
  }

  return { session };
}

export async function requireAdminRouteSession() {
  const result = await requireUserRouteSession();

  if ("response" in result) {
    return result;
  }

  if (!isPortalAdminSession(result.session)) {
    return { response: errorResponse("Admin access required", 403) };
  }

  return result;
}
