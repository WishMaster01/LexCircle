import type { LucideIcon } from "lucide-react";

export function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-background/60 p-4">
      <Icon className="size-5 text-accent" />
      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
