import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { legalCategories, legalWritingFormats } from "@/constants/legal-writing";
import { getOptionalAuthSession } from "@/lib/auth-guards";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function SubjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getOptionalAuthSession();
  const { slug } = await params;
  const subject = legalCategories.find((category) => category.value === slug);
  if (!subject) {
    notFound();
  }

  const paramsData = await searchParams;
  const type =
    typeof paramsData.type === "string" ? paramsData.type : undefined;
  const sort = typeof paramsData.sort === "string" ? paramsData.sort : "latest";

  const articles = await listCommunityArticles({
    category: slug,
    type,
    sort: sort as
      | "latest"
      | "oldest"
      | "most-viewed"
      | "most-liked"
      | "most-commented"
      | "trending",
  });
  const interactionMap = await getUserArticleInteractionMap(
    articles.map((article) => article.id),
    session?.user.id,
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Subject"
        title={subject.label}
        description={`Every LexCircle format in ${subject.label}, including blogs, articles, case analysis, research papers, notes, and legal news.`}
      />

      <form className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,0.85fr))_minmax(0,1.3fr)]">
          <div className="space-y-2">
            <label
              htmlFor="subject-type"
              className="text-sm font-medium text-foreground"
            >
              Type
            </label>
            <select
              id="subject-type"
              name="type"
              defaultValue={type}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="">All</option>
              {legalWritingFormats.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="subject-sort"
              className="text-sm font-medium text-foreground"
            >
              Sort
            </label>
            <select
              id="subject-sort"
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="latest">Latest</option>
              <option value="most-viewed">Most Read</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
          <input type="hidden" name="category" value={slug} />
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              Apply filters
            </button>
          </div>
        </div>
      </form>

      {articles.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={{
                ...article,
                coverImage: article.coverImage ?? null,
                initialLiked: interactionMap.get(article.id)?.liked ?? false,
                initialBookmarked:
                  interactionMap.get(article.id)?.bookmarked ?? false,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm text-muted">
          No posts are available in {subject.label} for the current filters.
        </div>
      )}
    </div>
  );
}
