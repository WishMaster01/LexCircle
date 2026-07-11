"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MoonStar,
  SunMedium,
  UserCircle2,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button-link";
import { mainNav } from "@/constants/site";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = session?.user;
  const isDarkTheme = resolvedTheme === "dark";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const authLinks = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
      { href: "/dashboard/history", label: "My History", icon: History },
      ...(user?.isPortalAdmin
        ? [{ href: "/admin", label: "Admin Center", icon: UserCircle2 }]
        : []),
    ],
    [user?.isPortalAdmin],
  );

  const sharedMobileLinks = useMemo(
    () => [
      ...mainNav,
      ...(status === "authenticated"
        ? [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/profile", label: "Profile" },
            { href: "/dashboard/history", label: "My History" },
            ...(user?.isPortalAdmin
              ? [{ href: "/admin", label: "Admin Center" }]
              : []),
          ]
        : [
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
          ]),
    ],
    [status, user?.isPortalAdmin],
  );

  return (
    <header className="sticky top-0 z-40 pt-4">
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            "fixed inset-0 z-30 md:hidden",
            isDarkTheme ? "bg-white/24" : "bg-slate-950/62",
          )}
        />
      ) : null}

      <div className="relative rounded-[1.75rem] border border-border/80 bg-card/85 px-3 py-3 shadow-[0_12px_48px_rgba(22,21,20,0.08)] backdrop-blur sm:rounded-full sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white sm:size-11">
              LC
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[-0.03em]">
                LexCircle
              </p>
              <p className="text-xs text-muted">
                A law student writing community
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm hover:bg-background/80",
                  (item.href === "/"
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`))
                    ? "bg-background/90 text-foreground"
                    : "text-muted hover:text-foreground",
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
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted hover:text-foreground"
            >
              {resolvedTheme === "dark" ? (
                <SunMedium className="size-4" />
              ) : (
                <MoonStar className="size-4" />
              )}
            </button>

            {status === "authenticated" ? (
              <details className="group relative hidden sm:block">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border/80 bg-background/80 px-2 py-2 text-sm text-foreground hover:bg-card">
                  <Avatar name={user?.name ?? "User"} image={user?.image} />
                  <div className="hidden text-left lg:block">
                    <p className="max-w-32 truncate font-medium">
                      {user?.name ?? "User"}
                    </p>
                    <p className="max-w-32 truncate text-xs text-muted">
                      @{user?.username ?? "account"}
                    </p>
                  </div>
                  <ChevronDown className="hidden size-4 text-muted transition-transform group-open:rotate-180 lg:block" />
                </summary>
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-64 rounded-3xl border border-border/80 bg-card/95 p-3 shadow-[0_20px_70px_rgba(22,21,20,0.14)] backdrop-blur">
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
              className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/80 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div
            className={cn(
              "absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(88vw,22rem)] rounded-3xl p-3 shadow-[0_20px_70px_rgba(22,21,20,0.14)] backdrop-blur md:hidden",
              isDarkTheme
                ? "border border-slate-200/80 bg-white/95 text-slate-900"
                : "border border-slate-800/80 bg-slate-950/95 text-slate-50",
            )}
          >
            {status === "authenticated" && user ? (
              <div
                className={cn(
                  "mb-3 rounded-2xl p-4",
                  isDarkTheme
                    ? "border border-slate-200 bg-slate-100/80"
                    : "border border-slate-800 bg-slate-900/80",
                )}
              >
                <p className="font-semibold">{user.name}</p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    isDarkTheme ? "text-slate-600" : "text-slate-300",
                  )}
                >
                  {user.email}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs uppercase tracking-[0.18em]",
                    isDarkTheme ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  {user.role}
                </p>
              </div>
            ) : null}
            <div className="space-y-1">
              {sharedMobileLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center rounded-2xl px-4 py-3 text-sm transition-colors",
                    isDarkTheme
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      : "text-slate-200 hover:bg-white/10 hover:text-white",
                    (item.href === "/"
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`))
                      ? isDarkTheme
                        ? "bg-slate-100 text-slate-950"
                        : "bg-white/10 text-white"
                      : "",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {status === "authenticated" ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void signOut({ callbackUrl: "/" });
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    isDarkTheme
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      : "text-slate-200 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
