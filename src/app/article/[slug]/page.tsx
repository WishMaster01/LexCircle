import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEngagementControls } from "@/components/articles/article-engagement-controls";
import { ArticleShareActions } from "@/components/articles/article-share-actions";
import { ArticleCommentsPanel } from "@/components/comments/article-comments-panel";
import { Badge } from "@/components/ui/badge";
import {
  getDocumentTypeLabel,
  inferDocumentType,
  isDocumentTypeTag,
} from "@/constants/legal-writing";
import { getOptionalAuthSession } from "@/lib/auth-guards";
import { formatDisplayDate, formatRelativeDate } from "@/lib/utils";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { getArticleBySlug } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getOptionalAuthSession();
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const tags =
    "tags" in article && Array.isArray(article.tags)
      ? article.tags
          .map((tag) => ("tag" in tag ? tag.tag : tag))
          .filter((tag) => !isDocumentTypeTag(tag))
      : [];
  const documentType = inferDocumentType(article);
  const interactionMap = await getUserArticleInteractionMap([article.id], session?.user.id);
  const interactionState = interactionMap.get(article.id) ?? {
    liked: false,
    bookmarked: false,
  };
  const comments =
    "comments" in article && Array.isArray(article.comments)
      ? article.comments
          .filter((comment) => !comment.parentId)
          .map((comment) => ({
            id: comment.id,
            author: comment.author.name,
            content: comment.content,
            createdAt:
              comment.createdAt instanceof Date
                ? comment.createdAt.toISOString()
                : String(comment.createdAt),
            replies: article.comments
              .filter((reply) => reply.parentId === comment.id)
              .map((reply) => ({
                id: reply.id,
                author: reply.author.name,
                content: reply.content,
                createdAt:
                  reply.createdAt instanceof Date
                    ? reply.createdAt.toISOString()
                    : String(reply.createdAt),
              })),
          }))
      : [];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-8">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-4">
            <Badge>
              {("category" in article && article.category?.name) || "Miscellaneous"}
            </Badge>
            <p className="text-sm font-medium text-muted">
              {(("category" in article && article.category?.name) || "Miscellaneous")} •{" "}
              {getDocumentTypeLabel(documentType)}
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">
              {article.excerpt}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl border border-border/80 bg-card/70 p-4 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:bg-transparent sm:p-0">
            <span className="font-medium text-foreground">
              By{" "}
              {("author" in article && article.author.name) || "Unknown author"}
            </span>
            <span>
              {formatDisplayDate(article.publishedAt ?? article.updatedAt)}
            </span>
            <span>{article.readingTime} min read</span>
            <span>
              Updated {formatRelativeDate(article.updatedAt)}
            </span>
          </div>
          <div className="relative h-60 overflow-hidden rounded-[1.75rem] border border-border/80 sm:h-80 lg:h-105">
            <Image
              src={article.coverImage ?? "/globe.svg"}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 65vw"
              className="object-cover"
            />
          </div>
          <div
            className="prose-article rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-6 lg:p-8"
            dangerouslySetInnerHTML={{
              __html:
                ("sanitizedContent" in article
                  ? article.sanitizedContent
                  : article.content) ?? article.content,
            }}
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                #{tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border/80 bg-card/80 p-4 sm:p-5">
            <p className="text-sm font-medium text-muted">Engagement</p>
            <div className="mt-4 grid gap-3 text-sm">
              <ArticleEngagementControls
                articleId={article.id}
                commentCount={article.commentCount}
                initialLikeCount={article.likeCount}
                initialBookmarkCount={article.bookmarkCount}
                initialLiked={interactionState.liked}
                initialBookmarked={interactionState.bookmarked}
                commentHref="#comments"
              />
              <ArticleShareActions
                title={article.title}
                slug={article.slug}
                content={
                  ("sanitizedContent" in article
                    ? article.sanitizedContent
                    : article.content) ?? article.content
                }
              />
            </div>
          </div>
          <div className="rounded-3xl border border-border/80 bg-card/80 p-4 sm:p-5">
            <p className="text-sm font-medium text-muted">Author</p>
            <p className="mt-2 text-xl font-semibold">
              {("author" in article && article.author.name) || "Unknown"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {"author" in article && "bio" in article.author
                ? article.author.bio
                : "Writes for the legal community."}
            </p>
            <Link
              href={`/author/${("author" in article && article.author.username) || ""}`}
              className="mt-4 inline-block text-sm font-medium text-accent"
            >
              View public profile
            </Link>
          </div>
        </aside>
      </div>

      <section id="comments" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Comments</h2>
        <ArticleCommentsPanel articleId={article.id} comments={comments} />
      </section>
    </div>
  );
}
