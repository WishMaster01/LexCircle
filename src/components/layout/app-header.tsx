"use client";

import Link from "next/link";
import { Menu, MoonStar, PenSquare, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button-link";
import { mainNav } from "@/constants/site";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 pt-4">
      <div className="flex items-center justify-between rounded-full border border-border/80 bg-card/85 px-4 py-3 shadow-[0_12px_48px_rgba(22,21,20,0.08)] backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              IS
            </div>
            <div>
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
        </div>
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
          <ButtonLink href="/dashboard/articles/new" size="sm">
            <PenSquare className="size-4" />
            Write
          </ButtonLink>
          <Avatar name="Demo User" />
          <button
            type="button"
            aria-label="Open navigation"
            className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-background/80 md:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
