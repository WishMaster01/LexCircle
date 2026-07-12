import { demoAuthors, demoArticles } from "@/constants/demo-data";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { ArticleApprovalStatus, ArticleStatus } from "@prisma/client";

type SessionProfileUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  isPortalAdmin?: boolean;
};

function buildSubjectBreakdown(
  articles: Array<{ category?: { name?: string | null; slug?: string | null } | null }>,
) {
  const counts = new Map<string, { slug: string; name: string; count: number }>();

  for (const article of articles) {
    const slug = article.category?.slug ?? "miscellaneous";
    const name = article.category?.name ?? "Miscellaneous";
    const current = counts.get(slug);

    if (current) {
      current.count += 1;
      continue;
    }

    counts.set(slug, { slug, name, count: 1 });
  }

  return [...counts.values()]
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, 4);
}

function buildFallbackProfile(user: SessionProfileUser) {
  const author = demoAuthors.find((candidate) => candidate.username === user.username) ?? null;
  const articles = author
    ? demoArticles.filter((article) => article.author.username === author.username)
    : [];

  return {
    id: user.id,
    name: author?.name ?? user.name ?? "LexCircle User",
    username: author?.username ?? user.username ?? "user",
    email: user.email ?? "",
    image: user.image ?? author?.image ?? null,
    bio:
      author?.bio ??
      "Law student writer on LexCircle. Building a visible body of legal writing and research.",
    joinedAt: author?.joinedAt ?? new Date().toISOString(),
    stats: {
      totalPosts: articles.length,
      subjectsMostWrittenAbout: buildSubjectBreakdown(articles),
      recentPosts: [...articles]
        .sort(
          (left, right) =>
            +new Date(right.updatedAt ?? right.publishedAt) -
            +new Date(left.updatedAt ?? left.publishedAt),
        )
        .slice(0, 3)
        .map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          status: ArticleStatus.PUBLISHED,
          approvalStatus: ArticleApprovalStatus.APPROVED,
          updatedAt: article.updatedAt,
          reviewedAt: article.updatedAt,
          reviewFeedback: "Approved by admin and now published on LexCircle.",
          createdAt: article.updatedAt,
          category: {
            name: article.category.name,
            slug: article.category.slug,
          },
        })),
    },
  };
}

export async function getAuthorProfile(username: string) {
  if (!isDatabaseConfigured()) {
    const author = demoAuthors.find((candidate) => candidate.username === username);
    if (!author) return null;
    const articles = demoArticles.filter((article) => article.author.username === username);
    return {
      ...author,
      articles,
      stats: {
        totalArticles: articles.length,
        totalViews: articles.reduce((sum, article) => sum + article.viewCount, 0),
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        articles: {
          where: { deletedAt: null },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: true,
            tags: { include: { tag: true } },
          },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      articles: user.articles.map((article) => ({
        ...article,
        author: article.author ?? { name: user.name },
      })),
      stats: {
        totalArticles: user.articles.length,
        totalViews: user.articles.reduce((sum, article) => sum + article.viewCount, 0),
      },
    };
  } catch (error) {
    console.error("Author profile query failed.", error);
    const author = demoAuthors.find((candidate) => candidate.username === username);
    if (!author) return null;
    const articles = demoArticles.filter((article) => article.author.username === username);
    return {
      ...author,
      articles,
      stats: {
        totalArticles: articles.length,
        totalViews: articles.reduce((sum, article) => sum + article.viewCount, 0),
      },
    };
  }
}

export async function getCurrentUserProfile(user: SessionProfileUser) {
  if (!isDatabaseConfigured() || user.id === "env-admin") {
    return buildFallbackProfile(user);
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
        articles: {
          where: { deletedAt: null },
          orderBy: [{ updatedAt: "desc" }],
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            approvalStatus: true,
            reviewedAt: true,
            reviewFeedback: true,
            updatedAt: true,
            createdAt: true,
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!currentUser) {
      return buildFallbackProfile(user);
    }

    return {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      email: currentUser.email,
      image: currentUser.image,
      bio: currentUser.bio,
      joinedAt: currentUser.createdAt.toISOString(),
      stats: {
        totalPosts: currentUser.articles.length,
        subjectsMostWrittenAbout: buildSubjectBreakdown(currentUser.articles),
        recentPosts: currentUser.articles.slice(0, 3),
      },
    };
  } catch (error) {
    console.error("Current user profile query failed.", error);
    return buildFallbackProfile(user);
  }
}

export async function updateCurrentUserProfile(
  user: SessionProfileUser,
  input: {
    name: string;
    bio?: string | null;
    image?: string | null;
  },
) {
  if (!isDatabaseConfigured() || user.id === "env-admin") {
    return {
      ...buildFallbackProfile(user),
      name: input.name,
      bio: input.bio ?? "",
      image: input.image ?? null,
    };
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      name: input.name,
      bio: input.bio ?? null,
      image: input.image ?? null,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
    },
  });
}
