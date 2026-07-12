import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { demoAuthors } from "@/constants/demo-data";
import { inferDocumentType } from "@/constants/legal-writing";
import { getOptionalAuthSession } from "@/lib/auth-guards";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getOptionalAuthSession();
  const [latestArticles, trendingArticles, caseAnalysisArticles, researchPapers] =
    await Promise.all([
      listCommunityArticles({ sort: "latest" }),
      listCommunityArticles({ sort: "trending" }),
      listCommunityArticles({ sort: "latest", type: "case-analysis" }),
      listCommunityArticles({ sort: "latest", type: "research-paper" }),
    ]);

  const latestPosts = latestArticles.slice(0, 3);
  const featuredArticles = trendingArticles
    .filter((article) => article.featured)
    .slice(0, 3);
  const featured = featuredArticles.length
    ? featuredArticles
    : trendingArticles.slice(0, 3);
  const recentCaseAnalysis = (
    caseAnalysisArticles.length
      ? caseAnalysisArticles
      : latestArticles.filter(
          (article) => inferDocumentType(article) === "case-analysis",
        )
  ).slice(0, 2);
  const recentResearchPapers = (
    researchPapers.length
      ? researchPapers
      : latestArticles.filter(
          (article) => inferDocumentType(article) === "research-paper",
        )
  ).slice(0, 2);

  const interactionIds = [
    ...new Set(
      [
        ...latestPosts,
        ...featured,
        ...recentCaseAnalysis,
        ...recentResearchPapers,
      ].map((article) => article.id),
    ),
  ];
  const interactionMap = await getUserArticleInteractionMap(
    interactionIds,
    session?.user.id,
  );
  const topAuthors = [
    ...demoAuthors.filter((author) => author.username === "rahulkumar"),
    ...demoAuthors.filter((author) => author.username !== "rahulkumar"),
  ].slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <section className="grid gap-6 rounded-4xl border border-border/80 bg-card px-5 py-6 shadow-[0_24px_90px_rgba(22,21,20,0.08)] sm:px-8 sm:py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-12">
        <div className="space-y-6">
          <Badge>LexCircle for law students, journals, and legal writing communities</Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl">
              Publish legal blogs, articles, case analysis, research papers,
              notes, and legal news from one writing space.
            </h1>
            <p className="max-w-2xl text-base text-muted sm:text-lg">
              LexCircle gives law students a clean structure for writing,
              discovery, reading, sharing, and building a serious legal
              portfolio.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/write">
              Start writing
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/latest" variant="secondary">
              Browse latest posts
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border/80 bg-background/70 p-4 sm:p-5">
          <form action="/latest" className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              name="query"
              placeholder="Search constitutional law, bail, arbitration, environmental law..."
              className="w-full rounded-full border border-border/80 bg-card/85 py-3 pl-11 pr-28 outline-none focus:ring-4 focus:ring-ring"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Latest Posts"
          title="Fresh writing from the LexCircle community."
          description="Latest legal blogs, articles, notes, case analysis, and research writing from students and contributors."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestPosts.map((article) => (
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
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured Articles"
          title="Selected writing with depth and relevance."
          description="Highlighted work from across the platform based on featured status and community interest."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((article) => (
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
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Recent Case Analysis"
            title="Judgments explained with structure."
          />
          <div className="grid gap-4">
            {recentCaseAnalysis.map((article) => (
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
        </div>

        <div className="space-y-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Recent Research Papers"
            title="Long-form legal scholarship and deeper analysis."
          />
          <div className="grid gap-4">
            {recentResearchPapers.map((article) => (
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
        </div>
      </section>

      <section className="space-y-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
        <SectionHeading
          eyebrow="Top Authors"
          title="Writers building visible legal portfolios."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {topAuthors.map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.username}`}
              className="rounded-2xl border border-border/80 bg-background/70 p-4 hover:-translate-y-0.5"
            >
              <p className="text-sm text-muted">@{author.username}</p>
              <h3 className="mt-2 text-lg font-semibold">{author.name}</h3>
              <p className="mt-2 text-sm text-muted">{author.bio}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">
                {author.followers.toLocaleString()} followers
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
