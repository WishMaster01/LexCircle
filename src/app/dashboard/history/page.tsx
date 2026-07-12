import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";
import { formatRelativeDate } from "@/lib/utils";
import { listUserHistory } from "@/services/article-service";

function getHistoryMessage(
  approvalStatus: string,
  reviewFeedback?: string | null,
) {
  if (approvalStatus === "PENDING") {
    return "Waiting for admin approval before this article moves into your approved dashboard list.";
  }

  if (approvalStatus === "APPROVED") {
    return (
      reviewFeedback ||
      "Approved by admin and now available in the public LexCircle feed."
    );
  }

  if (approvalStatus === "REJECTED") {
    return (
      reviewFeedback || "Admin requested revisions before approval."
    );
  }

  return "Approved by admin and available inside your article workspace.";
}

export default async function HistoryPage() {
  const session = await requireUserPageSession();
  const history = await listUserHistory(session.user.id);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="History"
        title="Lifecycle events and revision checkpoints"
        description="Track approval decisions, resubmission states, and major editorial checkpoints without flooding the timeline."
      />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "New submissions remain here until an admin approves them.",
            "Pending and rejected drafts stay visible with clear editorial status.",
            "Approval feedback is surfaced before the article moves into your main workspace.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/80 bg-card/80 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold sm:text-lg">
                    {item.title}
                  </h2>
                  <Badge
                    className={
                      item.approvalStatus === "PENDING"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
                        : item.approvalStatus === "REJECTED"
                          ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                    }
                  >
                    {item.approvalStatus === "PENDING"
                      ? "Waiting for approval"
                      : item.approvalStatus === "REJECTED"
                        ? "Changes requested"
                        : "Approved"}
                  </Badge>
                </div>
                <span className="text-sm text-muted">
                  {formatRelativeDate(
                    item.reviewedAt ?? item.submittedAt ?? item.updatedAt,
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {item.approvalStatus === "PENDING"
                  ? "This submission is still waiting for admin review."
                  : item.approvalStatus === "REJECTED"
                    ? "This submission was returned for revision."
                    : "This submission has been approved and moved forward."}
              </p>
              {item.reviewedAt ? (
                <div className="mt-3 rounded-2xl border border-border/80 bg-background/70 p-3 text-sm text-muted">
                  <span className="font-medium text-foreground">
                    Admin message:
                  </span>{" "}
                  {getHistoryMessage(item.approvalStatus, item.reviewFeedback)}
                </div>
              ) : null}
              <p className="mt-3 text-sm text-foreground/80">{item.excerpt}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card/80 p-5 text-sm text-muted">
          Your submission history is empty. Start a draft from the dashboard to
          create your first legal writing entry.
        </div>
      )}
    </div>
  );
}
