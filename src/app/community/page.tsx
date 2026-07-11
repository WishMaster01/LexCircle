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

      <form className="grid gap-4 rounded-[1.75rem] border border-border/80 bg-card/80 p-5 md:grid-cols-4">
        <input
          name="query"
          defaultValue={query}
          placeholder="Search by title, author, tag..."
          className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring md:col-span-2"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
        >
          <option value="">All categories</option>
          {demoCategories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
        >
          <option value="trending">Trending</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="most-viewed">Most viewed</option>
          <option value="most-liked">Most liked</option>
          <option value="most-commented">Most commented</option>
        </select>
        <select
          name="tag"
          defaultValue={tag}
          className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
        >
          <option value="">All tags</option>
          {demoTags.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-white">
          Apply filters
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article as never} />
        ))}
      </div>
    </div>
  );
}
