import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        variant === "default"
          ? "border-accent/20 bg-accent/10 text-accent-strong"
          : "border-border/80 bg-background/70 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
