import type { DemoArticle } from "@/constants/demo-data";

export const rankingWeights = {
  viewWeight: 0.18,
  likeWeight: 0.24,
  commentWeight: 0.22,
  bookmarkWeight: 0.16,
  completionWeight: 0.08,
  recencyWeight: 0.12,
  gravity: 1.15,
};

export function recencyDecay(publishedAt: string | Date, gravity = rankingWeights.gravity) {
  const hours = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 36e5);
  return 1 / Math.pow(hours + 2, gravity);
}

export function trendingScore(
  article: Pick<DemoArticle, "viewCount" | "likeCount" | "commentCount" | "bookmarkCount" | "publishedAt"> & {
    completionRate?: number;
  },
) {
  return (
    rankingWeights.viewWeight * Math.log1p(article.viewCount) +
    rankingWeights.likeWeight * Math.log1p(article.likeCount) +
    rankingWeights.commentWeight * Math.log1p(article.commentCount) +
    rankingWeights.bookmarkWeight * Math.log1p(article.bookmarkCount) +
    rankingWeights.completionWeight * (article.completionRate ?? 0.6) +
    rankingWeights.recencyWeight * recencyDecay(article.publishedAt)
  );
}

export function rankTrendingArticles<T extends DemoArticle>(articles: T[]) {
  return [...articles].sort((left, right) => trendingScore(right) - trendingScore(left));
}

export function relatedArticleScore(source: DemoArticle, candidate: DemoArticle) {
  const sourceTags = new Set(source.tags.map((tag) => tag.slug));
  const candidateTags = new Set(candidate.tags.map((tag) => tag.slug));
  const intersection = [...sourceTags].filter((tag) => candidateTags.has(tag)).length;
  const union = new Set([...sourceTags, ...candidateTags]).size;
  const tagSimilarity = union === 0 ? 0 : intersection / union;
  const categoryBonus = source.category.slug === candidate.category.slug ? 0.35 : 0;
  const authorBonus = source.author.id === candidate.author.id ? 0.15 : 0;
  return tagSimilarity + categoryBonus + authorBonus;
}
