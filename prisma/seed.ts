import bcrypt from "bcryptjs";
import {
  PrismaClient,
  ArticleStatus,
  ArticleVisibility,
  ReportReason,
  UserRole,
} from "@prisma/client";
import {
  demoArticles,
  demoAuthors,
  demoCategories,
  demoTags,
} from "../src/constants/demo-data";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@LexCircle.dev" },
    update: {},
    create: {
      name: "Admin User",
      username: "admin",
      email: "admin@LexCircle.dev",
      passwordHash,
      role: UserRole.ADMIN,
      bio: "Platform administrator",
    },
  });

  const authors = await Promise.all(
    demoAuthors.map((author, index) =>
      prisma.user.upsert({
        where: { email: `${author.username}@LexCircle.dev` },
        update: {},
        create: {
          name: author.name,
          username: author.username,
          email: `${author.username}@LexCircle.dev`,
          passwordHash,
          bio: author.bio,
          role: index === 0 ? UserRole.MODERATOR : UserRole.USER,
        },
      }),
    ),
  );

  const categoryMap = new Map<string, string>();
  for (const category of demoCategories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        description: `${category.name} articles and community insights.`,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: `${category.name} articles and community insights.`,
      },
    });
    categoryMap.set(category.slug, record.id);
  }

  const tagMap = new Map<string, string>();
  for (const tag of demoTags) {
    const record = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: { name: tag.name, slug: tag.slug },
    });
    tagMap.set(tag.slug, record.id);
  }

  for (const article of demoArticles) {
    const author =
      authors.find(
        (candidate) => candidate.username === article.author.username,
      ) ?? admin;
    const created = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        authorId: author.id,
        categoryId: categoryMap.get(article.category.slug),
        title: article.title,
        slug: article.slug,
        subtitle: article.subtitle,
        excerpt: article.excerpt,
        content: article.content,
        sanitizedContent: article.content,
        coverImage: article.coverImage,
        status: ArticleStatus.PUBLISHED,
        visibility: ArticleVisibility.PUBLIC,
        publishedAt: new Date(article.publishedAt),
        readingTime: article.readingTime,
        wordCount: article.wordCount,
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        commentCount: article.commentCount,
        bookmarkCount: article.bookmarkCount,
      },
    });

    for (const tag of article.tags) {
      const tagId = tagMap.get(tag.slug);
      if (!tagId) continue;
      await prisma.articleTag.upsert({
        where: {
          articleId_tagId: {
            articleId: created.id,
            tagId,
          },
        },
        update: {},
        create: {
          articleId: created.id,
          tagId,
        },
      });
    }
  }

  const sampleArticle = await prisma.article.findFirstOrThrow();
  const sampleUser = authors[0] ?? admin;

  await prisma.comment.createMany({
    data: [
      {
        articleId: sampleArticle.id,
        authorId: sampleUser.id,
        content:
          "This structure for state transitions is exactly the right place to start.",
      },
      {
        articleId: sampleArticle.id,
        authorId: admin.id,
        content:
          "Analytics and revision history usually get postponed. Building them early changes the product quality.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.report.create({
    data: {
      reporterId: admin.id,
      articleId: sampleArticle.id,
      reason: ReportReason.OTHER,
      details: "Seed report for moderation dashboard wiring.",
    },
  });

  console.log("Seed complete", { adminEmail: admin.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
