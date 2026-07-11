import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { demoCategories } from "@/constants/demo-data";
import { legalWritingFormats } from "@/constants/legal-writing";
import { getOptionalAuthSession } from "@/lib/auth-guards";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getOptionalAuthSession();
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "latest";

  const articles = await listCommunityArticles({
    query,
    category,
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
        eyebrow="Latest"
        title="Latest legal posts across all subjects and formats"
        description="Filter by subject, document type, or sort order without leaving the main latest feed."
      />

      <form className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.72fr))]">
          <div className="space-y-2 md:col-span-2 xl:col-span-1">
            <label
              htmlFor="latest-query"
              className="text-sm font-medium text-foreground"
            >
              Search
            </label>
            <input
              id="latest-query"
              name="query"
              defaultValue={query}
              placeholder="Search by title, author, issue, or tag..."
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="latest-category"
              className="text-sm font-medium text-foreground"
            >
              Subject
            </label>
            <select
              id="latest-category"
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="">All</option>
              {demoCategories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="latest-type"
              className="text-sm font-medium text-foreground"
            >
              Type
            </label>
            <select
              id="latest-type"
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
              htmlFor="latest-sort"
              className="text-sm font-medium text-foreground"
            >
              Sort
            </label>
            <select
              id="latest-sort"
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="latest">Latest</option>
              <option value="most-viewed">Most Read</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Use the latest feed for cross-subject reading and quick legal discovery.
          </p>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-white sm:min-w-40"
          >
            Apply filters
          </button>
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
          No posts match the current filters yet.
        </div>
      )}
    </div>
  );
}
