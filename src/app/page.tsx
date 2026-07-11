import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  Compass,
  PenLine,
  Sparkles,
  Users,
} from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { HeroStat } from "@/components/layout/hero-stat";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { demoArticles, demoAuthors, demoCategories } from "@/constants/demo-data";

export default function Home() {
  const featuredArticles = demoArticles.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-border/80 bg-card px-4 py-6 shadow-[0_24px_90px_rgba(22,21,20,0.08)] backdrop-blur sm:px-6 sm:py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-10 lg:px-14">
        <div className="space-y-6 sm:space-y-8">
          <Badge>Editorial publishing for teams and independent writers</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Publish with structure, discover with context, and keep your writing history intact.
            </h1>
            <p className="max-w-2xl text-base text-muted sm:text-lg">
              InkSphere combines a modern writing dashboard, public community feed, role-aware
              moderation, and analytics that stay explainable.
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
          <div className="grid gap-4 sm:grid-cols-3">
            <HeroStat icon={PenLine} label="Published articles" value="12.8k" />
            <HeroStat icon={Users} label="Active authors" value="2.3k" />
            <HeroStat icon={BarChart3} label="Monthly reads" value="1.1M" />
          </div>
        </div>
        <div className="grid gap-4 rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.1))] p-3 sm:p-4 dark:bg-[linear-gradient(180deg,rgba(18,23,25,0.92),rgba(18,23,25,0.7))]">
          <div className="rounded-[1.5rem] border border-border/80 bg-background/70 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">Trending now</span>
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
                    <span>{article.category.name}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{article.title}</h2>
                  <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-border/80 bg-background/80 p-5">
              <Compass className="size-5 text-accent" />
              <p className="mt-4 text-sm font-medium text-muted">Discovery with ranking reasons</p>
              <p className="mt-2 text-sm text-muted">
                Trending, latest, following, and related feeds remain deterministic and explainable.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-border/80 bg-background/80 p-5">
              <BookOpenText className="size-5 text-secondary" />
              <p className="mt-4 text-sm font-medium text-muted">Draft-safe workflow</p>
              <p className="mt-2 text-sm text-muted">
                Autosave, revisions, and restore points protect every stage of the writing flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8">
        <SectionHeading
          eyebrow="Featured articles"
          title="Stories with strong signal, not a noisy firehose."
          description="The community feed blends fresh writing, strong engagement, and recent momentum."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-3">
          <SectionHeading
            eyebrow="Why writers switch"
            title="A dashboard that treats writing like a product."
          />
          <p className="text-sm text-muted">
            Drafts, revisions, moderation, search ranking, and analytics live in one system instead
            of being bolted on after launch.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Role-based moderation and audit logs",
            "Protected drafts, scheduled publishing, and soft deletion",
            "Search, filters, bookmarks, likes, comments, and follows",
            "Neon + Prisma backend with production-ready schemas",
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
        <div className="space-y-6 rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Popular categories"
            title="Editorial lanes for every kind of technical writing."
          />
          <div className="flex flex-wrap gap-3">
            {demoCategories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading eyebrow="Top authors" title="Writers building loyal followings." />
          <div className="grid gap-4 sm:grid-cols-2">
            {demoAuthors.slice(0, 4).map((author) => (
              <div key={author.id} className="rounded-2xl border border-border/80 bg-background/70 p-4">
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
