import { BarChart3, Bookmark, FileText, Heart, MessageSquare, PenSquare, TrendingUp } from "lucide-react";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCompactNumber } from "@/lib/utils";
import { getDashboardOverview } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Writing performance and editorial activity in one place."
        description="Track production, reach, engagement, and recent edits without losing the signal."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total articles" value={overview.totalArticles} />
        <StatCard icon={PenSquare} label="Drafts" value={overview.draftArticles} />
        <StatCard icon={BarChart3} label="Views" value={formatCompactNumber(overview.totalViews)} />
        <StatCard icon={Heart} label="Likes" value={formatCompactNumber(overview.totalLikes)} />
        <StatCard icon={MessageSquare} label="Comments" value={formatCompactNumber(overview.totalComments)} />
        <StatCard icon={Bookmark} label="Bookmarks" value={formatCompactNumber(overview.totalBookmarks)} />
        <StatCard icon={TrendingUp} label="Published" value={overview.publishedArticles} />
        <StatCard icon={FileText} label="Archived" value={overview.archivedArticles} />
      </div>

      <PerformanceChart />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Recently edited</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {overview.recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article as never} />
          ))}
        </div>
      </div>
    </div>
  );
}
