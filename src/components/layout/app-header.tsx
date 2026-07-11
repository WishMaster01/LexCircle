"use client";

import Link from "next/link";
import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  History,
  LogOut,
  Menu,
  MoonStar,
  PenSquare,
  SunMedium,
  UserCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button-link";
import { mainNav } from "@/constants/site";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const user = session?.user;
  const authLinks = useMemo(
    () => [
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
      { href: "/dashboard/history", label: "My History", icon: History },
    ],
    [],
  );
  const sharedMobileLinks = useMemo(
    () => [
      ...mainNav,
      ...(status === "authenticated"
        ? [
            { href: "/dashboard/profile", label: "Profile" },
            { href: "/dashboard/history", label: "My History" },
            { href: "/dashboard/articles/new", label: "Write" },
          ]
        : [
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
          ]),
    ],
    [status],
  );

  return (
    <header className="sticky top-0 z-40 pt-4">
      <div className="rounded-[1.75rem] border border-border/80 bg-card/85 px-3 py-3 shadow-[0_12px_48px_rgba(22,21,20,0.08)] backdrop-blur sm:rounded-full sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white sm:size-11">
              IS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[-0.03em]">InkSphere</p>
              <p className="text-xs text-muted">Publish with signal</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm text-muted hover:bg-background/80 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted hover:text-foreground"
            >
              {resolvedTheme === "dark" ? (
                <SunMedium className="size-4" />
              ) : (
                <MoonStar className="size-4" />
              )}
            </button>
            {status === "authenticated" ? (
              <>
                <div className="hidden sm:block">
                  <ButtonLink href="/dashboard/articles/new" size="sm">
                    <PenSquare className="size-4" />
                    Write
                  </ButtonLink>
                </div>
                <details className="group relative hidden sm:block">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border/80 bg-background/80 px-2 py-2 text-sm text-foreground hover:bg-card">
                    <Avatar name={user?.name ?? "User"} image={user?.image} />
                    <div className="hidden text-left lg:block">
                      <p className="max-w-32 truncate font-medium">{user?.name ?? "User"}</p>
                      <p className="max-w-32 truncate text-xs text-muted">
                        @{user?.username ?? "account"}
                      </p>
                    </div>
                    <ChevronDown className="hidden size-4 text-muted transition-transform group-open:rotate-180 lg:block" />
                  </summary>
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-64 rounded-[1.5rem] border border-border/80 bg-card/95 p-3 shadow-[0_20px_70px_rgba(22,21,20,0.14)] backdrop-blur">
                    <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
                      <p className="font-semibold">{user?.name ?? "User"}</p>
                      <p className="mt-1 text-sm text-muted">{user?.email}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                        {user?.role}
                      </p>
                    </div>
                    <div className="mt-3 space-y-1">
                      {authLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-background/80 hover:text-foreground"
                          >
                            <Icon className="size-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => void signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-background/80 hover:text-foreground"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </details>
              </>
            ) : status === "loading" ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-10 w-24 animate-pulse rounded-full bg-background/80" />
                <div className="size-10 animate-pulse rounded-full bg-background/80" />
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <ButtonLink href="/login" variant="secondary" size="sm">
                  Login
                </ButtonLink>
                <ButtonLink href="/register" size="sm">
                  Register
                </ButtonLink>
              </div>
            )}
            <details className="group relative md:hidden">
              <summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border/80 bg-background/80">
                <Menu className="size-4" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(88vw,22rem)] rounded-[1.5rem] border border-border/80 bg-card/95 p-3 shadow-[0_20px_70px_rgba(22,21,20,0.14)] backdrop-blur">
                {status === "authenticated" && user ? (
                  <div className="mb-3 rounded-2xl border border-border/80 bg-background/70 p-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="mt-1 text-sm text-muted">{user.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{user.role}</p>
                  </div>
                ) : null}
                <div className="space-y-1">
                  {sharedMobileLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center rounded-2xl px-4 py-3 text-sm text-muted hover:bg-background/80 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {status === "authenticated" ? (
                    <button
                      type="button"
                      onClick={() => void signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-background/80 hover:text-foreground"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  ) : null}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
