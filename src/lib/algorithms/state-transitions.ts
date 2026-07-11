import { ArticleStatus } from "@prisma/client";

const transitions: Record<ArticleStatus, ArticleStatus[]> = {
  DRAFT: [ArticleStatus.PUBLISHED, ArticleStatus.SCHEDULED, ArticleStatus.DELETED],
  SCHEDULED: [ArticleStatus.PUBLISHED, ArticleStatus.DRAFT, ArticleStatus.DELETED],
  PUBLISHED: [ArticleStatus.UNPUBLISHED, ArticleStatus.ARCHIVED, ArticleStatus.DELETED],
  UNPUBLISHED: [ArticleStatus.PUBLISHED, ArticleStatus.ARCHIVED, ArticleStatus.DELETED],
  ARCHIVED: [ArticleStatus.DRAFT, ArticleStatus.PUBLISHED, ArticleStatus.DELETED],
  DELETED: [ArticleStatus.DRAFT, ArticleStatus.PUBLISHED, ArticleStatus.UNPUBLISHED, ArticleStatus.ARCHIVED],
};

export function canTransitionArticle(from: ArticleStatus, to: ArticleStatus) {
  return transitions[from].includes(to);
}
