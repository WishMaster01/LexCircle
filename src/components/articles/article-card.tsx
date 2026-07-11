import Image from "next/image";
import Link from "next/link";
import { Bookmark, Heart, MessageSquare, TrendingUp } from "lucide-react";
import type { DemoArticle } from "@/constants/demo-data";
import { formatCompactNumber, formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ArticleCard({ article }: { article: DemoArticle }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/85 shadow-[0_16px_60px_rgba(22,21,20,0.06)]">
      <div className="relative h-52 sm:h-56">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="secondary">{article.category.name}</Badge>
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
          <p className="text-sm text-muted">{article.excerpt}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="normal-case tracking-normal">
              #{tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-border/80 pt-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{article.author.name}</p>
            <p>{formatRelativeDate(article.publishedAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Heart className="size-4" />
              {formatCompactNumber(article.likeCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="size-4" />
              {article.commentCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bookmark className="size-4" />
              {formatCompactNumber(article.bookmarkCount)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
