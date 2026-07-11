import { demoAuthors, demoArticles } from "@/constants/demo-data";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

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

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      articles: {
        where: { deletedAt: null },
        include: {
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
    stats: {
      totalArticles: user.articles.length,
      totalViews: user.articles.reduce((sum, article) => sum + article.viewCount, 0),
    },
  };
}
