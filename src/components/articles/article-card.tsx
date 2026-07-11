import Image from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ArticleEngagementControls } from "@/components/articles/article-engagement-controls";
import { formatCompactNumber, formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ArticleCardArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | Date | null;
  updatedAt?: string | Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  category: {
    name: string;
  } | null;
  tags: Array<{ id: string; name: string } | { tag: { id: string; name: string } }>;
  author: {
    name: string;
  };
  initialLiked?: boolean;
  initialBookmarked?: boolean;
};

export function ArticleCard({ article }: { article: ArticleCardArticle }) {
  const normalizedTags = article.tags.map((tag) => ("tag" in tag ? tag.tag : tag));

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/85 shadow-[0_16px_60px_rgba(22,21,20,0.06)]">
      <div className="relative h-52 sm:h-56">
        <Image
          src={article.coverImage ?? "/globe.svg"}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="secondary">{article.category?.name ?? "Article"}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted">
            <TrendingUp className="size-3.5" />
            {formatCompactNumber(article.viewCount)} views
          </div>
        </div>
        <div className="space-y-2">
          <Link
            href={`/article/${article.slug}`}
            className="block text-xl font-semibold tracking-[-0.04em] sm:text-2xl"
          >
            {article.title}
          </Link>
          <p className="text-sm text-muted">{article.excerpt ?? "No excerpt available yet."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {normalizedTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="normal-case tracking-normal">
              #{tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-border/80 pt-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{article.author.name}</p>
            <p>{formatRelativeDate(article.publishedAt ?? article.updatedAt ?? new Date())}</p>
          </div>
          <ArticleEngagementControls
            articleId={article.id}
            commentCount={article.commentCount}
            initialLikeCount={article.likeCount}
            initialBookmarkCount={article.bookmarkCount}
            initialLiked={article.initialLiked}
            initialBookmarked={article.initialBookmarked}
            commentHref={`/article/${article.slug}#comments`}
            compact
          />
        </div>
      </div>
    </article>
  );
}
