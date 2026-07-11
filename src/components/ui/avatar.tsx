import { initials } from "@/lib/utils";

export function Avatar({ name }: { name: string }) {
  return (
    <div className="flex size-10 items-center justify-center rounded-full border border-border/80 bg-secondary/10 text-sm font-semibold text-secondary">
      {initials(name)}
    </div>
  );
}
