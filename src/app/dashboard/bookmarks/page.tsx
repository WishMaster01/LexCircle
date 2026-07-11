import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { demoArticles } from "@/constants/demo-data";

export default function BookmarksPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Bookmarks"
        title="Articles saved for later reading"
        description="Keep your reading queue tidy across mobile, tablet, and desktop with a calmer card layout."
      />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Recent saves stay at the top of your queue.",
            "Use tags and categories to scan quickly on smaller screens.",
            "Bookmarks are optimized for touch-friendly reading sessions.",
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {demoArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
