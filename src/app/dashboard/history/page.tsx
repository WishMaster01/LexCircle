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
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{item.action}</h2>
              <span className="text-sm text-muted">{item.date}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
