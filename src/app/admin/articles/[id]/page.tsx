import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminArticleReviewForm } from "@/components/admin/admin-article-review-form";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/layout/section-heading";
import { formatDisplayDate, formatRelativeDate } from "@/lib/utils";
import {
  getDocumentTypeLabel,
  inferDocumentType,
  isDocumentTypeTag,
} from "@/constants/legal-writing";
import { getAdminArticleSubmissionById } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function AdminArticleReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticleSubmissionById(id);

  if (!article) {
    notFound();
  }

  const documentType = inferDocumentType(article);
  const tags =
    "tags" in article && Array.isArray(article.tags)
      ? article.tags
          .map((tag) => ("tag" in tag ? tag.tag : tag))
          .filter((tag) => !isDocumentTypeTag(tag))
      : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading
          eyebrow="Admin Review"
          title="Review full article before approval"
          description="Read the full draft, check its structure, and send a clear decision message to the author."
        />
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-3 text-sm font-medium text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to admin
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_22rem]">
        <div className="space-y-6">
          <section className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {article.category?.name ?? "Miscellaneous"}
                </Badge>
                <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-700">
                  {article.approvalStatus === "PENDING"
                    ? "Waiting for approval"
                    : article.approvalStatus}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted">
                {(article.category?.name ?? "Miscellaneous")} •{" "}
                {getDocumentTypeLabel(documentType)}
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {article.title}
              </h1>
              <p className="text-base text-muted">{article.excerpt}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted">
                <span>Author: {article.author.name}</span>
                <span>
                  Submitted{" "}
                  {formatRelativeDate(article.submittedAt ?? article.createdAt)}
                </span>
                <span>{article.readingTime} min read</span>
                <span>
                  Last updated {formatRelativeDate(article.updatedAt)}
                </span>
              </div>
            </div>

            <div className="relative mt-6 h-60 overflow-hidden rounded-[1.75rem] border border-border/80 sm:h-80">
              <Image
                src={article.coverImage ?? "/globe.svg"}
                alt={article.title}
                fill
                sizes="(max-width: 1280px) 100vw, 65vw"
                className="object-cover"
              />
            </div>

            <div
              className="prose-article mt-6 rounded-[1.75rem] border border-border/80 bg-background/60 p-4 sm:p-6 lg:p-8"
              dangerouslySetInnerHTML={{
                __html:
                  ("sanitizedContent" in article
                    ? article.sanitizedContent
                    : article.content) || article.content,
              }}
            />

            {tags.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <section className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-6">
            <h2 className="text-xl font-semibold tracking-[-0.04em]">
              Submission details
            </h2>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p>
                <span className="font-medium text-foreground">Author:</span>{" "}
                {article.author.name}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                {"email" in article.author
                  ? article.author.email
                  : "Unavailable in demo mode"}
              </p>
              <p>
                <span className="font-medium text-foreground">Created:</span>{" "}
                {formatDisplayDate(article.createdAt)}
              </p>
              <p>
                <span className="font-medium text-foreground">Subject:</span>{" "}
                {article.category?.name ?? "Miscellaneous"}
              </p>
              <p>
                <span className="font-medium text-foreground">Type:</span>{" "}
                {getDocumentTypeLabel(documentType)}
              </p>
            </div>
          </section>

          <AdminArticleReviewForm
            articleId={article.id}
            initialFeedback={article.reviewFeedback}
          />
        </div>
      </div>
    </div>
  );
}
