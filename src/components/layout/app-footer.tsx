import Link from "next/link";
import { footerNav } from "@/constants/site";

export function AppFooter() {
  return (
    <footer className="py-10">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-border/80 bg-card/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold tracking-[-0.03em]">LexCircle</p>
          <p className="text-sm text-muted">
            Law student writing, discussion, and legal publishing.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm text-muted">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
