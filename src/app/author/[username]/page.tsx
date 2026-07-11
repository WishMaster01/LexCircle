import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";
import { getAuthorProfile } from "@/services/user-service";

export const dynamic = "force-dynamic";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const author = await getAuthorProfile(username);
  if (!author) notFound();

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-border/80 bg-card/80 p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar
            name={author.name}
            image={"image" in author ? author.image : null}
            className="size-20"
          />
          <div className="flex-1 space-y-4">
            <Badge>@{author.username}</Badge>
            <SectionHeading
              eyebrow="Author profile"
              title={author.name}
              description={author.bio ?? ""}
            />
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span>{author.stats.totalArticles} total posts</span>
              <span>
                Joined{" "}
                {formatDisplayDate(
                  ("joinedAt" in author ? author.joinedAt : author.createdAt) ??
                    new Date(),
                )}
              </span>
              <span>{author.stats.totalViews.toLocaleString()} views</span>
            </div>
          </div>
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
