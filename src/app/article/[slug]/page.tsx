import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, FileText, Layers3, RefreshCcw } from "lucide-react";
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
import {
  formatCompactNumber,
  formatDisplayDate,
  formatRelativeDate,
} from "@/lib/utils";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { getArticleBySlug } from "@/services/article-service";

export const dynamic = "force-dynamic";

function extractHeadings(html: string) {
  const headings = [...html.matchAll(/<h([1-3])[^>]*>(.*?)<\/h\1>/gi)];

  return headings
    .map((heading, index) => ({
      id: `section-${index + 1}`,
      level: Number(heading[1]),
      text: heading[2].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    }))
    .filter((heading) => heading.text.length > 0);
}

function injectHeadingIds(html: string) {
  let headingIndex = 0;

  return html.replace(/<h([1-3])([^>]*)>/gi, (_match, level, attributes) => {
    headingIndex += 1;
    return `<h${level}${attributes} id="section-${headingIndex}">`;
  });
}

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

  const renderedContent =
    ("sanitizedContent" in article ? article.sanitizedContent : article.content) ??
    article.content;
  const contentWithAnchors = injectHeadingIds(renderedContent);
  const outline = extractHeadings(renderedContent);
  const tags =
    "tags" in article && Array.isArray(article.tags)
      ? article.tags
          .map((tag) => ("tag" in tag ? tag.tag : tag))
          .filter((tag) => !isDocumentTypeTag(tag))
      : [];
  const documentType = inferDocumentType(article);
  const interactionMap = await getUserArticleInteractionMap(
    [article.id],
    session?.user.id,
  );
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
      <article className="space-y-6">
        <div className="relative h-64 overflow-hidden rounded-[2rem] border border-border/80 bg-card/80 sm:h-80 lg:h-[30rem]">
          <Image
            src={article.coverImage ?? "/globe.svg"}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8 lg:p-10">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge>{article.category?.name || "Miscellaneous"}</Badge>
              <Badge variant="secondary">{getDocumentTypeLabel(documentType)}</Badge>
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 sm:p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                Hook
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/85 sm:text-lg">
                {article.excerpt}
              </p>
            </div>

            {outline.length ? (
              <div className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 sm:p-5">
                <p className="text-sm font-medium text-muted">In this article</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {outline.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm text-foreground/80 hover:text-accent"
                      style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section
          className="prose-article rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-6 lg:p-10"
          dangerouslySetInnerHTML={{
            __html: contentWithAnchors,
          }}
        />

        {tags.length ? (
          <section className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5">
            <p className="text-sm font-medium text-muted">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5 sm:p-6">
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
                content={renderedContent}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5 sm:p-6">
            <p className="text-sm font-medium text-muted">Publication details</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Author
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {("author" in article && article.author.name) || "Unknown author"}
                </p>
              </div>
              <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Published
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {formatDisplayDate(article.publishedAt ?? article.updatedAt)}
                </p>
              </div>
              <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Reading Time
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {article.readingTime} min read
                </p>
              </div>
              <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  Updated
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {formatRelativeDate(article.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted">
                <FileText className="size-4 text-accent" />
                <span>{getDocumentTypeLabel(documentType)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted">
                <Layers3 className="size-4 text-accent" />
                <span>{article.category?.name ?? "Miscellaneous"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted">
                <Eye className="size-4 text-accent" />
                <span>{formatCompactNumber(article.viewCount)} views</span>
              </div>
              <div className="flex items-center gap-3 rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted">
                <RefreshCcw className="size-4 text-accent" />
                <span>Updated {formatRelativeDate(article.updatedAt)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-border/80 bg-background/70 p-4 sm:p-5">
              <p className="text-sm font-medium text-muted">About the author</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
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
          </div>
        </section>
      </article>

      <section id="comments" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Comments</h2>
        <ArticleCommentsPanel articleId={article.id} comments={comments} />
      </section>
    </div>
  );
}
