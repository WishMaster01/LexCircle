import { AdminMessageCard } from "@/components/contact/admin-message-card";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  getContactMessageSummary,
  listContactHandlers,
  listContactMessages,
} from "@/services/contact-service";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const [summary, messages, handlers] = await Promise.all([
    getContactMessageSummary(),
    listContactMessages(),
    listContactHandlers(),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin inbox"
        title="Contact messages from support, demo, and partnership requests"
        description="This inbox gives administrators a persistent view of incoming requests when PostgreSQL is configured."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total", value: summary.total },
          { label: "Pending", value: summary.pending },
          { label: "In progress", value: summary.inProgress },
          { label: "Resolved", value: summary.resolved },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-border/80 bg-card/80 p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Message controls stack into a single column on mobile for easier triage.",
            "Assignments and notes stay editable without forcing horizontal scrolling.",
            "The inbox is optimized for compact admin review sessions on tablet screens.",
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <AdminMessageCard key={message.id} message={message} handlers={handlers} />
        ))}
      </div>
    </div>
  );
}
