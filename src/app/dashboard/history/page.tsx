import { SectionHeading } from "@/components/layout/section-heading";

const history = [
  { id: "h1", action: "Article published", date: "2026-07-10 09:15", summary: "Published from draft" },
  { id: "h2", action: "Title updated", date: "2026-07-09 14:22", summary: "Refined headline for clarity" },
  { id: "h3", action: "Draft autosaved", date: "2026-07-09 14:18", summary: "Checkpoint revision stored" },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="History"
        title="Lifecycle events and revision checkpoints"
        description="Track important article changes without flooding the timeline with insignificant autosaves."
      />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Creation, publication, archive, and restore events are surfaced first.",
            "Timeline cards collapse cleanly on narrow screens to keep scanning readable.",
            "Revision history stays contextual instead of becoming a noisy activity log.",
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-border/80 bg-card/80 p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
              <h2 className="text-base font-semibold sm:text-lg">{item.action}</h2>
              <span className="text-sm text-muted">{item.date}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
