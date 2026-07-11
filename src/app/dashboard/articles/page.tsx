import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";
import { formatRelativeDate } from "@/lib/utils";
import { listUserArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function MyArticlesPage() {
  const session = await requireUserPageSession();
  const articles = await listUserArticles(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading
          eyebrow="My articles"
          title="Drafts, published posts, and archived work"
        />
        <Link
          href="/write"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
        >
          <Plus className="size-4" />
          Write
        </Link>
      </div>
      <div className="rounded-3xl border border-border/80 bg-card/80 p-4 text-sm text-muted">
        Only admin-approved articles appear here. Newly submitted drafts stay in
        history until review is complete.
      </div>
      {articles.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className="rounded-3xl border border-border/80 bg-card/80 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {article.category?.name ?? "Uncategorized"}
                    </Badge>
                    <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
                      {article.status === "PUBLISHED"
                        ? "Published"
                        : article.status}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                </div>
                <p className="text-sm text-muted">
                  Updated {formatRelativeDate(article.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card/80 p-5 text-sm text-muted">
          No approved articles yet. Submitted drafts remain in history until an
          admin approves them.
        </div>
      )}
    </div>
  );
}
