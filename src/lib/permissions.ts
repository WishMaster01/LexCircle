import { ArticleStatus, ArticleVisibility, UserRole } from "@prisma/client";

type UserLike = {
  id: string;
  role: UserRole;
  isSuspended?: boolean;
};

type ArticleLike = {
  authorId: string;
  status: ArticleStatus;
  visibility: ArticleVisibility;
};

export function canCreateArticle(user?: UserLike | null) {
  return Boolean(user && !user.isSuspended);
}

export function canReadArticle(user: UserLike | null | undefined, article: ArticleLike) {
  if (article.status === ArticleStatus.PUBLISHED && article.visibility !== ArticleVisibility.PRIVATE) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
    return true;
  }

  return user.id === article.authorId;
}

export function canEditArticle(user: UserLike | null | undefined, article: ArticleLike) {
  if (!user || user.isSuspended) return false;
  return user.role === UserRole.ADMIN || user.id === article.authorId;
}

export function canDeleteArticle(user: UserLike | null | undefined, article: ArticleLike) {
  return canEditArticle(user, article);
}

export function canPublishArticle(user: UserLike | null | undefined, article: ArticleLike) {
  return canEditArticle(user, article) && article.status !== ArticleStatus.DELETED;
}

export function canModerateArticle(user: UserLike | null | undefined) {
  return Boolean(user && (user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN));
}

export function canEditComment(user: UserLike | null | undefined, authorId: string) {
  if (!user || user.isSuspended) return false;
  return user.role === UserRole.ADMIN || user.id === authorId;
}

export function canManageUsers(user: UserLike | null | undefined) {
  return Boolean(user && user.role === UserRole.ADMIN);
}

export function canViewAnalytics(user: UserLike | null | undefined, authorId: string) {
  if (!user) return false;
  return user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR || user.id === authorId;
}
