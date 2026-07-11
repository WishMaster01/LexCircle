import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { getAuthorProfile } from "@/services/user-service";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const author = await getAuthorProfile(username);
  if (!author) notFound();

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
        <Badge>@{author.username}</Badge>
        <SectionHeading eyebrow="Author profile" title={author.name} description={author.bio ?? ""} />
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <span>{author.stats.totalArticles} published articles</span>
          <span>{author.stats.totalViews.toLocaleString()} views</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {author.articles.map((article) => (
          <ArticleCard key={article.id} article={article as never} />
        ))}
      </div>
    </div>
  );
}
