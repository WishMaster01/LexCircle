import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Mailbox,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminAnalyticsPanel } from "@/components/admin/admin-analytics-panel";
import { ArticleApprovalActions } from "@/components/admin/article-approval-actions";
import { SectionHeading } from "@/components/layout/section-heading";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDate } from "@/lib/utils";
import {
  getArticleApprovalSummary,
  listPendingArticleApprovals,
} from "@/services/article-service";
import { getContactMessageSummary } from "@/services/contact-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [contactSummary, approvalSummary, pendingArticles] = await Promise.all([
    getContactMessageSummary(),
    getArticleApprovalSummary(),
    listPendingArticleApprovals(),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="Operational intelligence for the law student community"
        description="A responsive admin workspace for submission review, legal content mix, growth signals, and contact operations across mobile, tablet, and desktop."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Students" value="2,347" />
        <StatCard
          icon={AlertTriangle}
          label="Approval queue"
          value={approvalSummary.pending}
        />
        <StatCard
          icon={ShieldCheck}
          label="Approved drafts"
          value={approvalSummary.approved}
        />
        <StatCard icon={BarChart3} label="Community reads" value="38.9k" />
      </div>
      <AdminAnalyticsPanel />
      <section className="rounded-4xl border border-border/80 bg-card/80 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              Article approval queue
            </h2>
            <p className="mt-2 text-sm text-muted">
              Newly submitted drafts stay in user history until an admin
              approves or rejects them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-700">
              {approvalSummary.pending} pending
            </Badge>
            <Badge className="border-rose-500/20 bg-rose-500/10 text-rose-700">
              {approvalSummary.rejected} rejected
            </Badge>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {pendingArticles.length ? (
            pendingArticles.map((article) => (
              <div
                key={article.id}
                className="rounded-3xl border border-border/80 bg-background/70 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {article.category?.name ?? "Uncategorized"}
                      </Badge>
                      <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-700">
                        Waiting for approval
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.04em]">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted">{article.excerpt}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted">
                      <span>Author: {article.author.name}</span>
                      <span>
                        Submitted{" "}
                        {formatRelativeDate(
                          article.submittedAt ?? article.createdAt,
                        )}
                      </span>
                    </div>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent"
                    >
                      Review full article
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                  <ArticleApprovalActions articleId={article.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-border/80 bg-background/70 p-5 text-sm text-muted">
              No drafts are currently waiting for review.
            </div>
          )}
        </div>
      </section>
      <section className="rounded-4xl border border-border/80 bg-card/80 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              Contact inbox
            </h2>
            <p className="mt-2 text-sm text-muted">
              Support, campus demo, and partnership requests persist through the
              contact service when PostgreSQL is configured.
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
          <StatCard
            icon={Mailbox}
            label="Total messages"
            value={contactSummary.total}
          />
          <StatCard
            icon={AlertTriangle}
            label="Pending"
            value={contactSummary.pending}
          />
          <StatCard
            icon={ShieldCheck}
            label="In progress"
            value={contactSummary.inProgress}
          />
        </div>
      </section>
    </div>
  );
}
