import Link from "next/link";
import { Plus } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function MyArticlesPage() {
  const articles = await listCommunityArticles({ sort: "latest" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading eyebrow="My articles" title="Drafts, published posts, and archived work" />
        <Link href="/dashboard/articles/new" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white">
          <Plus className="size-4" />
          New article
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article as never} />
        ))}
      </div>
    </div>
  );
}
