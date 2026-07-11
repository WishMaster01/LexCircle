import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ArticleEngagementControls } from "@/components/articles/article-engagement-controls";
import {
  getDocumentTypeLabel,
  inferDocumentType,
  isDocumentTypeTag,
} from "@/constants/legal-writing";
import { formatCompactNumber, formatDisplayDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ArticleCardArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | Date | null;
  updatedAt?: string | Date;
  readingTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  category: {
    name: string;
    slug?: string;
  } | null;
  tags: Array<{ id: string; name: string; slug?: string } | { tag: { id: string; name: string; slug?: string } }>;
  author: {
    name: string;
  };
  documentType?: string | null;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
};

export function ArticleCard({ article }: { article: ArticleCardArticle }) {
  const normalizedTags = article.tags
    .map((tag) => ("tag" in tag ? tag.tag : tag))
    .filter((tag) => !isDocumentTypeTag(tag));
  const documentType = inferDocumentType(article);

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted">
            {article.category?.name ?? "Miscellaneous"} • {getDocumentTypeLabel(documentType)}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Eye className="size-3.5" />
            {formatCompactNumber(article.viewCount)}
          </span>
        </div>

        <div className="space-y-2">
          <Link
            href={`/article/${article.slug}`}
            className="block text-xl font-semibold tracking-[-0.04em] sm:text-2xl"
          >
            {article.title}
          </Link>
          <p className="text-sm text-muted">
            {article.excerpt ?? "No excerpt available yet."}
          </p>
        </div>

        {normalizedTags.length ? (
          <div className="flex flex-wrap gap-2">
            {normalizedTags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="normal-case tracking-normal">
                #{tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="space-y-3 border-t border-border/80 pt-4 text-sm text-muted">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{article.author.name}</p>
            <p>
              {article.readingTime} min read •{" "}
              {formatDisplayDate(article.publishedAt ?? article.updatedAt ?? new Date())}
            </p>
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
