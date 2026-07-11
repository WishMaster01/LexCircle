import Link from "next/link";
import { AlertTriangle, BarChart3, Mailbox, ShieldCheck, Users } from "lucide-react";
import { AdminAnalyticsPanel } from "@/components/admin/admin-analytics-panel";
import { SectionHeading } from "@/components/layout/section-heading";
import { StatCard } from "@/components/dashboard/stat-card";
import { getContactMessageSummary } from "@/services/contact-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const contactSummary = await getContactMessageSummary();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="Operational intelligence for the publishing platform"
        description="A responsive admin workspace for moderation flow, content mix, growth signals, and contact operations across mobile, tablet, and desktop."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Users" value="2,347" />
        <StatCard icon={AlertTriangle} label="Open reports" value="12" />
        <StatCard icon={ShieldCheck} label="Audit events" value="184" />
        <StatCard icon={BarChart3} label="Monthly reads" value="38.9k" />
      </div>
      <AdminAnalyticsPanel />
      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">Contact inbox</h2>
            <p className="mt-2 text-sm text-muted">
              Support, demo, and partnership requests now persist through the contact service when
              PostgreSQL is configured.
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
          >
            <Mailbox className="size-4" />
            Open inbox
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard icon={Mailbox} label="Total messages" value={contactSummary.total} />
          <StatCard icon={AlertTriangle} label="Pending" value={contactSummary.pending} />
          <StatCard icon={ShieldCheck} label="In progress" value={contactSummary.inProgress} />
        </div>
      </section>
    </div>
  );
}
