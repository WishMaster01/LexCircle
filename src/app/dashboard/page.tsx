import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FilePenLine,
  RefreshCcw,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";
import { formatRelativeDate } from "@/lib/utils";
import { getDashboardOverview } from "@/services/article-service";

export const dynamic = "force-dynamic";

const startOptions = [
  {
    label: "Blog",
    text: "Short legal commentary and current updates.",
    href: "/write?kind=blog",
  },
  {
    label: "Article",
    text: "Doctrine-focused long-form legal writing.",
    href: "/write?kind=article",
  },
  {
    label: "Case Analysis",
    text: "Judgment breakdown with issues, reasoning, and impact.",
    href: "/write?kind=case-analysis",
  },
  {
    label: "Research Paper",
    text: "Academic legal writing for seminar, journal, or dissertation work.",
    href: "/write?kind=research-paper",
  },
  {
    label: "Notes",
    text: "Compact legal notes for classes, revision, and exam preparation.",
    href: "/write?kind=notes",
  },
  {
    label: "Legal News",
    text: "Timely updates on cases, courts, statutes, and regulation.",
    href: "/write?kind=legal-news",
  },
] as const;

const workspaceActions = [
  {
    title: "Review writing history",
    text: "Track recent revisions, restores, and publishing checkpoints.",
    href: "/dashboard/history",
    icon: Clock3,
  },
  {
    title: "Continue editing",
    text: "Jump back into your latest article and keep momentum high.",
    href: "/dashboard/articles",
    icon: FilePenLine,
  },
  {
    title: "Revisit archived work",
    text: "Bring back older ideas when you are ready to refine them.",
    href: "/dashboard/articles",
    icon: RefreshCcw,
  },
] as const;

export default async function DashboardPage() {
  const session = await requireUserPageSession();
  const overview = await getDashboardOverview(session.user.id);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Writing performance and editorial activity in one place."
        description="A focused writing workspace for drafts, revisions, and recent editorial movement without a wall of statistics."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Workspace focus
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Move between pending drafts, case analysis, research work, and recent
            edits from one law-focused writing workspace.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <details className="group rounded-3xl border border-border/80 bg-background/70 p-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <Scale className="size-5 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">
                    Start
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Open a new legal writing draft and choose the format you
                    want to publish.
                  </p>
                </div>
                <ChevronDown className="mt-1 size-4 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-5 grid gap-3">
                {startOptions.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    className="rounded-2xl border border-border/80 bg-card/80 p-4 hover:-translate-y-0.5"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="mt-1 text-sm text-muted">{option.text}</p>
                  </Link>
                ))}
              </div>
            </details>

            {workspaceActions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-3xl border border-border/80 bg-background/70 p-5 hover:-translate-y-0.5"
                >
                  <Icon className="size-5 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                    Open
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Current editorial queue
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                label: "Active drafts",
                text: `${overview.draftArticles} approved drafts are ready for deeper editing.`,
              },
              {
                label: "Pending approval",
                text: `${overview.pendingApprovalArticles} draft submissions are waiting for admin review.`,
              },
              {
                label: "Published work",
                text: `${overview.publishedArticles} approved pieces are live in the community feed.`,
              },
              {
                label: "Returned by admin",
                text: `${overview.rejectedArticles} submissions need edits before resubmission.`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-border/80 bg-background/70 p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">
          Recently edited
        </h2>
        {overview.recentArticles.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {overview.recentArticles.map((article) => (
              <div
                key={article.id}
                className="rounded-3xl border border-border/80 bg-card/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {article.category?.name ?? "Uncategorized"}
                      </Badge>
                      <Badge
                        className={
                          article.approvalStatus === "PENDING"
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
                            : article.approvalStatus === "REJECTED"
                              ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                        }
                      >
                        {article.approvalStatus === "PENDING"
                          ? "Waiting for approval"
                          : article.approvalStatus === "REJECTED"
                            ? "Needs changes"
                            : "Approved"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.04em]">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted">{article.excerpt}</p>
                  </div>
                  {article.approvalStatus === "APPROVED" ? (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4 text-sm text-muted">
                  <div className="space-y-1">
                    <span className="block">
                      Updated {formatRelativeDate(article.updatedAt)}
                    </span>
                    {article.reviewedAt ? (
                      <span className="block text-xs">
                        Admin message:{" "}
                        {article.reviewFeedback ||
                          (article.approvalStatus === "APPROVED"
                            ? "Approved and published on LexCircle."
                            : "Needs revision before approval.")}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href="/dashboard/history"
                    className="inline-flex items-center gap-2 font-medium text-accent"
                  >
                    Open history
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/80 bg-card/80 p-5 text-sm text-muted">
            No drafts or approved submissions yet. Use the Start menu to create
            your first legal post.
          </div>
        )}
      </div>
    </div>
  );
}
