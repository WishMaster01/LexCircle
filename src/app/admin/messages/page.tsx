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

      <div className="grid gap-4 md:grid-cols-4">
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

      <div className="space-y-4">
        {messages.map((message) => (
          <AdminMessageCard key={message.id} message={message} handlers={handlers} />
        ))}
      </div>
    </div>
  );
}
