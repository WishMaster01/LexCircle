import { SectionHeading } from "@/components/layout/section-heading";
import { ArticleCard } from "@/components/articles/article-card";
import { demoCategories, demoTags } from "@/constants/demo-data";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const category = typeof params.category === "string" ? params.category : undefined;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "trending";

  const articles = await listCommunityArticles({
    query,
    category,
    tag,
    sort: sort as
      | "latest"
      | "oldest"
      | "most-viewed"
      | "most-liked"
      | "most-commented"
      | "trending",
  });

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Community"
        title="Published stories from the entire platform"
        description="Search, filter, and rank community articles with transparent discovery rules."
      />

      <form className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.7fr))]">
          <div className="space-y-2 md:col-span-2 xl:col-span-1">
            <label htmlFor="community-query" className="text-sm font-medium text-foreground">
              Search
            </label>
            <input
              id="community-query"
              name="query"
              defaultValue={query}
              placeholder="Search by title, author, tag..."
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="community-category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              id="community-category"
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="">All categories</option>
              {demoCategories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="community-sort" className="text-sm font-medium text-foreground">
              Sort
            </label>
            <select
              id="community-sort"
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="trending">Trending</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="most-viewed">Most viewed</option>
              <option value="most-liked">Most liked</option>
              <option value="most-commented">Most commented</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="community-tag" className="text-sm font-medium text-foreground">
              Tag
            </label>
            <select
              id="community-tag"
              name="tag"
              defaultValue={tag}
              className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="">All tags</option>
              {demoTags.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Use filters to narrow the feed without losing ranked discovery context.
          </p>
          <button type="submit" className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-white sm:min-w-40">
            Apply filters
          </button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article as never} />
        ))}
      </div>
    </div>
  );
}
