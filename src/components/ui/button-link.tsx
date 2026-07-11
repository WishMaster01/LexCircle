import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  default:
    "bg-accent text-white shadow-[0_16px_48px_rgba(216,95,56,0.26)] hover:-translate-y-0.5 hover:bg-accent-strong",
  secondary: "border border-border/80 bg-background/80 text-foreground hover:bg-card",
};

export function ButtonLink({
  children,
  href,
  variant = "default",
  size = "md",
}: {
  children: React.ReactNode;
  href: string;
  variant?: keyof typeof styles;
  size?: "sm" | "md";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium",
        size === "sm" ? "h-10 px-4 text-sm" : "h-11 px-5 text-sm",
        styles[variant],
      )}
    >
      {children}
    </Link>
  );
}
