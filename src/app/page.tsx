import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Compass,
  Sparkles,
} from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { demoAuthors, demoCategories } from "@/constants/demo-data";
import { getOptionalAuthSession } from "@/lib/auth-guards";
import { getUserArticleInteractionMap } from "@/services/article-engagement-service";
import { listCommunityArticles } from "@/services/article-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getOptionalAuthSession();
  const featuredArticles = (await listCommunityArticles({ sort: "trending" })).slice(0, 3);
  const interactionMap = await getUserArticleInteractionMap(
    featuredArticles.map((article) => article.id),
    session?.user.id,
  );

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <section className="grid gap-6 overflow-hidden rounded-4xl border border-border/80 bg-card px-4 py-6 shadow-[0_24px_90px_rgba(22,21,20,0.08)] backdrop-blur sm:px-6 sm:py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-10 lg:px-14">
        <div className="space-y-6 sm:space-y-8">
          <Badge>Legal publishing for law students, researchers, and aspiring practitioners</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-6xl">
              Publish legal blogs, articles, case notes, and research papers
              with a workflow built for law students.
            </h1>
            <p className="max-w-2xl text-base text-muted sm:text-lg">
              LexCircle gives legal writers one place to draft, organize by
              subject area, submit for review, and build a public writing
              portfolio with discussion and saved reading.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/dashboard/articles/new">
              Start writing
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/community" variant="secondary">
              Explore community
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-background/80 p-5">
              <p className="text-sm font-medium text-muted">Real feed content</p>
              <p className="mt-2 text-sm text-muted">
                Featured stories now come from published legal writing instead of static homepage metrics.
              </p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-background/80 p-5">
              <p className="text-sm font-medium text-muted">Persistent user actions</p>
              <p className="mt-2 text-sm text-muted">
                Signed-in users can like, save, and discuss legal writing with changes stored in the platform data.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 rounded-4xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.1))] p-3 sm:p-4 dark:bg-[linear-gradient(180deg,rgba(18,23,25,0.92),rgba(18,23,25,0.7))]">
          <div className="rounded-3xl border border-border/80 bg-background/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">
                Trending now
              </span>
              <Sparkles className="size-4 text-accent" />
            </div>
            <div className="mt-5 space-y-4">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="block rounded-2xl border border-border/70 bg-card/70 p-4 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                    <span>{article.category?.name ?? "Article"}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-background/80 p-5">
              <Compass className="size-5 text-accent" />
              <p className="mt-4 text-sm font-medium text-muted">
                Discovery with legal relevance
              </p>
              <p className="mt-2 text-sm text-muted">
                Trending, latest, and related feeds help students find useful
                legal commentary without losing explainable discovery.
              </p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-background/80 p-5">
              <BookOpenText className="size-5 text-secondary" />
              <p className="mt-4 text-sm font-medium text-muted">
                Draft-safe legal writing
              </p>
              <p className="mt-2 text-sm text-muted">
                Autosave, revisions, and approval routing protect every stage of
                your article, case note, or research paper workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8">
        <SectionHeading
          eyebrow="Featured articles"
          title="Legal writing with substance, structure, and useful commentary."
          description="The community feed highlights persuasive student scholarship, fresh case analysis, and timely legal discussion."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={{
                ...article,
                coverImage: article.coverImage ?? null,
                publishedAt: article.publishedAt,
                initialLiked: interactionMap.get(article.id)?.liked ?? false,
                initialBookmarked: interactionMap.get(article.id)?.bookmarked ?? false,
              }}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-3">
          <SectionHeading
            eyebrow="Why law students use it"
            title="A writing workspace built for legal publishing."
          />
          <p className="text-sm text-muted">
            Drafts, revisions, moderation, subject-based discovery, and legal
            discussion live in one system.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Law-focused categories for civil, criminal, constitutional, corporate, and more",
            "Case notes, blogs, articles, and research papers in one draft flow",
            "Search, filters, saved articles, likes, and legal discussion threads",
            "A real database-backed workflow for editorial review and publication",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/80 bg-background/70 p-4 text-sm text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Popular categories"
            title="Practice areas and subjects for legal writing."
          />
          <div className="flex flex-wrap gap-3">
            {demoCategories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Top authors"
            title="Writers building strong legal portfolios."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {demoAuthors.slice(0, 4).map((author) => (
              <div
                key={author.id}
                className="rounded-2xl border border-border/80 bg-background/70 p-4"
              >
                <p className="text-sm text-muted">@{author.username}</p>
                <h3 className="mt-2 text-lg font-semibold">{author.name}</h3>
                <p className="mt-2 text-sm text-muted">{author.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
