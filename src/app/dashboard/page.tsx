import Link from "next/link";
import { ArrowRight, Clock3, FilePenLine, PenSquare, RefreshCcw } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { getDashboardOverview } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Writing performance and editorial activity in one place."
        description="A focused writing workspace for drafts, revisions, and recent editorial movement without a wall of statistics."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Workspace focus</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Return to your active drafts, continue revisions, and move quickly between creation and
            history without scanning a metrics-heavy screen.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Start a new article",
                text: "Open the editor and begin with a clean draft workspace.",
                href: "/dashboard/articles/new",
                icon: PenSquare,
              },
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
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[1.5rem] border border-border/80 bg-background/70 p-5 hover:-translate-y-0.5"
                >
                  <Icon className="size-5 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">{item.title}</h3>
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

        <div className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Current editorial queue</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                label: "Active drafts",
                text: `${overview.draftArticles} draft workspaces currently need attention.`,
              },
              {
                label: "Published work",
                text: `${overview.publishedArticles} pieces are live in the community feed.`,
              },
              {
                label: "Archived ideas",
                text: `${overview.archivedArticles} articles are stored for later refinement.`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Recently edited</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {overview.recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article as never} />
          ))}
        </div>
      </div>
    </div>
  );
}
