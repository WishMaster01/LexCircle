import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Heart, Share2 } from "lucide-react";
import { CommentThread } from "@/components/comments/comment-thread";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatRelativeDate } from "@/lib/utils";
import { getArticleBySlug } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const tags =
    "tags" in article && Array.isArray(article.tags)
      ? article.tags.map((tag) => ("tag" in tag ? tag.tag : tag))
      : [];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-8">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-4">
            <Badge>{("category" in article && article.category?.name) || "Article"}</Badge>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted sm:text-lg">{article.excerpt}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-[1.5rem] border border-border/80 bg-card/70 p-4 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:bg-transparent sm:p-0">
            <span className="font-medium text-foreground">
              By {("author" in article && article.author.name) || "Unknown author"}
            </span>
            <span>{formatRelativeDate(article.publishedAt ?? article.updatedAt)}</span>
            <span>{article.readingTime} min read</span>
          </div>
          <div className="relative h-[240px] overflow-hidden rounded-[1.75rem] border border-border/80 sm:h-[320px] lg:h-[420px]">
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
              __html: ("sanitizedContent" in article ? article.sanitizedContent : article.content) ?? article.content,
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
          <div className="rounded-[1.5rem] border border-border/80 bg-card/80 p-4 sm:p-5">
            <p className="text-sm font-medium text-muted">Engagement</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2">
                <Heart className="size-4" />
                {formatCompactNumber(article.likeCount)}
              </span>
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2">
                <Bookmark className="size-4" />
                {formatCompactNumber(article.bookmarkCount)}
              </span>
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2">
                <Share2 className="size-4" />
                Share
              </span>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-border/80 bg-card/80 p-4 sm:p-5">
            <p className="text-sm font-medium text-muted">Author</p>
            <p className="mt-2 text-xl font-semibold">{("author" in article && article.author.name) || "Unknown"}</p>
            <p className="mt-2 text-sm text-muted">
              {"author" in article && "bio" in article.author ? article.author.bio : "Writes for the community."}
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Comments</h2>
        <CommentThread
          comments={[
            {
              id: "1",
              author: "Jordan Lee",
              content: "The revision checkpoint idea is the part most teams miss.",
              replies: [
                {
                  id: "2",
                  author: "Maya Raman",
                  content: "Exactly. Autosave and revision history solve different problems.",
                },
              ],
            },
          ]}
        />
      </section>
    </div>
  );
}
