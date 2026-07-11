import { ArticleCard } from "@/components/articles/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { demoArticles } from "@/constants/demo-data";

export default function BookmarksPage() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Bookmarks" title="Articles saved for later reading" />
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {demoArticles.slice(0, 3).map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
