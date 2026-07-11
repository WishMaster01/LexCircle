import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

type ArticleCommentNode = {
  id: string;
  author: string;
  content: string;
  createdAt?: string;
  replies?: ArticleCommentNode[];
};

function buildCommentTree(
  comments: Array<{
    id: string;
    content: string;
    parentId: string | null;
    createdAt: Date | string;
    author: {
      name: string;
    };
  }>,
) {
  const nodes = new Map<string, ArticleCommentNode>();

  for (const comment of comments) {
    nodes.set(comment.id, {
      id: comment.id,
      author: comment.author.name,
      content: comment.content,
      createdAt:
        typeof comment.createdAt === "string"
          ? comment.createdAt
          : comment.createdAt.toISOString(),
      replies: [],
    });
  }

  const rootComments: ArticleCommentNode[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id);
    if (!node) continue;

    if (comment.parentId) {
      const parent = nodes.get(comment.parentId);
      if (parent) {
        parent.replies = [...(parent.replies ?? []), node];
        continue;
      }
    }

    rootComments.push(node);
  }

  return rootComments;
}

export async function getUserArticleInteractionMap(articleIds: string[], userId?: string | null) {
  const map = new Map<string, { liked: boolean; bookmarked: boolean }>();

  for (const articleId of articleIds) {
    map.set(articleId, { liked: false, bookmarked: false });
  }

  if (!userId || !articleIds.length || !isDatabaseConfigured()) {
    return map;
  }

  const [likes, bookmarks] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
      select: { articleId: true },
    }),
    prisma.bookmark.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
      select: { articleId: true },
    }),
  ]);

  for (const like of likes) {
    map.set(like.articleId, {
      ...(map.get(like.articleId) ?? { liked: false, bookmarked: false }),
      liked: true,
    });
  }

  for (const bookmark of bookmarks) {
    map.set(bookmark.articleId, {
      ...(map.get(bookmark.articleId) ?? { liked: false, bookmarked: false }),
      bookmarked: true,
    });
  }

  return map;
}

export async function likeArticle(articleId: string, userId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for likes.");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!existing) {
      await tx.like.create({
        data: {
          userId,
          articleId,
        },
      });

      await tx.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
    }

    const article = await tx.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { likeCount: true },
    });

    return {
      liked: true,
      likeCount: article.likeCount,
    };
  });
}

export async function unlikeArticle(articleId: string, userId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for likes.");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existing) {
      await tx.like.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      await tx.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    }

    const article = await tx.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { likeCount: true },
    });

    return {
      liked: false,
      likeCount: Math.max(article.likeCount, 0),
    };
  });
}

export async function bookmarkArticle(articleId: string, userId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for bookmarks.");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!existing) {
      await tx.bookmark.create({
        data: {
          userId,
          articleId,
        },
      });

      await tx.article.update({
        where: { id: articleId },
        data: {
          bookmarkCount: {
            increment: 1,
          },
        },
      });
    }

    const article = await tx.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { bookmarkCount: true },
    });

    return {
      bookmarked: true,
      bookmarkCount: article.bookmarkCount,
    };
  });
}

export async function removeBookmark(articleId: string, userId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for bookmarks.");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existing) {
      await tx.bookmark.delete({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      await tx.article.update({
        where: { id: articleId },
        data: {
          bookmarkCount: {
            decrement: 1,
          },
        },
      });
    }

    const article = await tx.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { bookmarkCount: true },
    });

    return {
      bookmarked: false,
      bookmarkCount: Math.max(article.bookmarkCount, 0),
    };
  });
}

export async function listArticleComments(articleId: string) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const comments = await prisma.comment.findMany({
    where: {
      articleId,
      deletedAt: null,
      isHidden: false,
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      parentId: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return buildCommentTree(comments);
}

export async function createArticleComment(input: {
  articleId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database configuration is required for comments.");
  }

  return prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        articleId: input.articleId,
        authorId: input.userId,
        parentId: input.parentId ?? null,
        content: input.content,
      },
      select: {
        id: true,
        content: true,
        parentId: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    await tx.article.update({
      where: { id: input.articleId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return {
      id: comment.id,
      author: comment.author.name,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    };
  });
}
