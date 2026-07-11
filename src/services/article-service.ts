import sanitizeHtml from "sanitize-html";
import { ArticleStatus, ArticleVisibility, Prisma } from "@prisma/client";
import { demoArticles, demoAuthors } from "@/constants/demo-data";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { estimateReadingTime } from "@/lib/algorithms/reading-time";
import { rankTrendingArticles } from "@/lib/algorithms/ranking";
import { resolveSlugCollision, slugify } from "@/lib/algorithms/slug";
import { canTransitionArticle } from "@/lib/algorithms/state-transitions";

type CommunityQuery = {
  query?: string;
  category?: string;
  tag?: string;
  sort?: "latest" | "oldest" | "most-viewed" | "most-liked" | "most-commented" | "trending";
};

function sanitizeContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4"]),
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      "*": ["class"],
    },
  });
}

export async function listCommunityArticles(query: CommunityQuery = {}) {
  if (!isDatabaseConfigured()) {
    let articles = [...demoArticles];
    if (query.query) {
      const normalized = query.query.toLowerCase();
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(normalized) ||
          article.excerpt.toLowerCase().includes(normalized) ||
          article.author.name.toLowerCase().includes(normalized) ||
          article.tags.some((tag) => tag.name.toLowerCase().includes(normalized)),
      );
    }
    if (query.category) {
      articles = articles.filter((article) => article.category.slug === query.category);
    }
    if (query.tag) {
      articles = articles.filter((article) => article.tags.some((tag) => tag.slug === query.tag));
    }

    switch (query.sort) {
      case "latest":
        articles.sort((left, right) => +new Date(right.publishedAt) - +new Date(left.publishedAt));
        break;
      case "oldest":
        articles.sort((left, right) => +new Date(left.publishedAt) - +new Date(right.publishedAt));
        break;
      case "most-viewed":
        articles.sort((left, right) => right.viewCount - left.viewCount);
        break;
      case "most-liked":
        articles.sort((left, right) => right.likeCount - left.likeCount);
        break;
      case "most-commented":
        articles.sort((left, right) => right.commentCount - left.commentCount);
        break;
      default:
        articles = rankTrendingArticles(articles);
    }

    return articles;
  }

  const where: Prisma.ArticleWhereInput = {
    status: ArticleStatus.PUBLISHED,
    visibility: ArticleVisibility.PUBLIC,
    deletedAt: null,
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
    ...(query.query
      ? {
          OR: [
            { title: { contains: query.query, mode: "insensitive" } },
            { excerpt: { contains: query.query, mode: "insensitive" } },
            { author: { name: { contains: query.query, mode: "insensitive" } } },
            { tags: { some: { tag: { name: { contains: query.query, mode: "insensitive" } } } } },
          ],
        }
      : {}),
  };

  const orderBy =
    query.sort === "oldest"
      ? [{ publishedAt: "asc" as const }, { id: "asc" as const }]
      : query.sort === "most-viewed"
        ? [{ viewCount: "desc" as const }, { publishedAt: "desc" as const }]
        : query.sort === "most-liked"
          ? [{ likeCount: "desc" as const }, { publishedAt: "desc" as const }]
          : query.sort === "most-commented"
            ? [{ commentCount: "desc" as const }, { publishedAt: "desc" as const }]
            : [{ publishedAt: "desc" as const }, { id: "desc" as const }];

  return prisma.article.findMany({
    where,
    orderBy,
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getArticleBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return demoArticles.find((article) => article.slug === slug) ?? null;
  }

  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
      comments: {
        where: { deletedAt: null, isHidden: false },
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function listAuthorArticles(username: string) {
  if (!isDatabaseConfigured()) {
    return demoArticles.filter((article) => article.author.username === username);
  }

  return prisma.article.findMany({
    where: {
      author: { username },
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
    },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getDashboardOverview() {
  if (!isDatabaseConfigured()) {
    return {
      totalArticles: demoArticles.length,
      publishedArticles: demoArticles.length,
      draftArticles: 2,
      archivedArticles: 1,
      totalViews: demoArticles.reduce((sum, article) => sum + article.viewCount, 0),
      totalLikes: demoArticles.reduce((sum, article) => sum + article.likeCount, 0),
      totalComments: demoArticles.reduce((sum, article) => sum + article.commentCount, 0),
      totalBookmarks: demoArticles.reduce((sum, article) => sum + article.bookmarkCount, 0),
      recentArticles: demoArticles.slice(0, 3),
      authors: demoAuthors.slice(0, 3),
    };
  }

  const articles = await prisma.article.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  const aggregate = await prisma.article.aggregate({
    _count: { id: true },
    _sum: {
      viewCount: true,
      likeCount: true,
      commentCount: true,
      bookmarkCount: true,
    },
  });

  return {
    totalArticles: aggregate._count.id,
    publishedArticles: articles.filter((article) => article.status === ArticleStatus.PUBLISHED).length,
    draftArticles: articles.filter((article) => article.status === ArticleStatus.DRAFT).length,
    archivedArticles: articles.filter((article) => article.status === ArticleStatus.ARCHIVED).length,
    totalViews: aggregate._sum.viewCount ?? 0,
    totalLikes: aggregate._sum.likeCount ?? 0,
    totalComments: aggregate._sum.commentCount ?? 0,
    totalBookmarks: aggregate._sum.bookmarkCount ?? 0,
    recentArticles: articles,
    authors: [],
  };
}

export async function createArticle(input: {
  authorId: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  tags: string[];
}) {
  const sanitizedContent = sanitizeContent(input.content);
  const { readingTime, wordCount } = estimateReadingTime(input.content);
  const baseSlug = slugify(input.title);

  if (!isDatabaseConfigured()) {
    const slug = resolveSlugCollision(baseSlug, new Set(demoArticles.map((article) => article.slug)));
    return {
      id: `draft-${Date.now()}`,
      slug,
      title: input.title,
      subtitle: input.subtitle ?? "",
      excerpt: input.excerpt,
      content: input.content,
      sanitizedContent,
      coverImage: input.coverImage ?? null,
      readingTime,
      wordCount,
      status: ArticleStatus.DRAFT,
    };
  }

  const existingSlugs = new Set((await prisma.article.findMany({ select: { slug: true } })).map((article) => article.slug));
  const slug = resolveSlugCollision(baseSlug, existingSlugs);

  return prisma.article.create({
    data: {
      authorId: input.authorId,
      categoryId: input.categoryId,
      title: input.title,
      slug,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      content: input.content,
      sanitizedContent,
      coverImage: input.coverImage,
      readingTime,
      wordCount,
      tags: {
        createMany: {
          data: input.tags.map((tagId) => ({ tagId })),
        },
      },
    },
  });
}

export async function changeArticleState(id: string, nextStatus: ArticleStatus) {
  if (!isDatabaseConfigured()) {
    return { id, status: nextStatus };
  }

  const article = await prisma.article.findUniqueOrThrow({ where: { id } });
  if (!canTransitionArticle(article.status, nextStatus)) {
    throw new Error(`Invalid transition from ${article.status} to ${nextStatus}`);
  }

  return prisma.article.update({
    where: { id },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === ArticleStatus.PUBLISHED ? new Date() : article.publishedAt,
      archivedAt: nextStatus === ArticleStatus.ARCHIVED ? new Date() : null,
      deletedAt: nextStatus === ArticleStatus.DELETED ? new Date() : null,
    },
  });
}
