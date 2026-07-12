import sanitizeHtml from "sanitize-html";
import {
  ArticleApprovalStatus,
  ArticleStatus,
  ArticleVisibility,
  Prisma,
  UserRole,
} from "@prisma/client";
import { demoArticles, demoAuthors, demoCategories, demoTags } from "@/constants/demo-data";
import {
  getDocumentTypeLabel,
  getDocumentTypeTagSlug,
  inferDocumentType,
} from "@/constants/legal-writing";
import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { estimateReadingTime } from "@/lib/algorithms/reading-time";
import { rankTrendingArticles } from "@/lib/algorithms/ranking";
import { resolveSlugCollision, slugify } from "@/lib/algorithms/slug";
import { canTransitionArticle } from "@/lib/algorithms/state-transitions";

type CommunityQuery = {
  query?: string;
  category?: string;
  type?: string;
  tag?: string;
  sort?: "latest" | "oldest" | "most-viewed" | "most-liked" | "most-commented" | "trending";
};

type ArticleActor = {
  id: string;
  role: UserRole;
  isSuspended?: boolean;
  isPortalAdmin?: boolean;
};

const articleListInclude = {
  author: true,
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
  reviewedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ArticleInclude;

type DemoWorkflowArticle = (typeof demoArticles)[number] & {
  status: ArticleStatus;
  approvalStatus: ArticleApprovalStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewFeedback: string | null;
  createdAt: string;
  reviewedBy:
    | {
        id: string;
        name: string;
        email: string;
      }
    | null;
};

function getDemoWorkflowArticles(): DemoWorkflowArticle[] {
  return [
    {
      ...demoArticles[0],
      status: ArticleStatus.PUBLISHED,
      approvalStatus: ArticleApprovalStatus.APPROVED,
      createdAt: "2026-07-07T10:30:00.000Z",
      submittedAt: "2026-07-07T10:30:00.000Z",
      reviewedAt: "2026-07-08T09:15:00.000Z",
      reviewFeedback: "Approved for publication.",
      reviewedBy: {
        id: "env-admin",
        name: "LexCircle Admin",
        email: "admin@example.com",
      },
    },
    {
      ...demoArticles[1],
      status: ArticleStatus.DRAFT,
      approvalStatus: ArticleApprovalStatus.PENDING,
      createdAt: "2026-07-11T08:45:00.000Z",
      submittedAt: "2026-07-11T08:45:00.000Z",
      reviewedAt: null,
      reviewFeedback: null,
      reviewedBy: null,
    },
    {
      ...demoArticles[2],
      status: ArticleStatus.DRAFT,
      approvalStatus: ArticleApprovalStatus.REJECTED,
      createdAt: "2026-07-10T07:30:00.000Z",
      submittedAt: "2026-07-10T07:30:00.000Z",
      reviewedAt: "2026-07-10T11:10:00.000Z",
      reviewFeedback: "Tighten the excerpt and add stronger supporting detail before resubmitting.",
      reviewedBy: {
        id: "env-admin",
        name: "LexCircle Admin",
        email: "admin@example.com",
      },
    },
  ];
}

function getDemoCommunityArticles(query: CommunityQuery = {}) {
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

  if (query.type) {
    const type = getDocumentTypeTagSlug(query.type);
    articles = articles.filter(
      (article) => inferDocumentType(article) === type,
    );
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

async function resolveCategoryId(input: string) {
  const normalized = input.trim();
  const demoCategory = demoCategories.find(
    (item) =>
      item.id === normalized ||
      item.slug.toLowerCase() === normalized.toLowerCase() ||
      item.name.toLowerCase() === normalized.toLowerCase(),
  );

  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { id: normalized },
        { slug: { equals: normalized, mode: "insensitive" } },
        { name: { equals: normalized, mode: "insensitive" } },
        ...(demoCategory
          ? [
              { slug: { equals: demoCategory.slug, mode: "insensitive" as const } },
              { name: { equals: demoCategory.name, mode: "insensitive" as const } },
            ]
          : []),
      ],
    },
    select: { id: true },
  });

  if (!category) {
    const label = demoCategory?.name ?? normalized.replace(/[-_]+/g, " ").trim();
    const created = await prisma.category.create({
      data: {
        name: label
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
          .join(" "),
        slug: demoCategory?.slug ?? slugify(normalized),
        description: `${label} articles, blogs, and legal research commentary.`,
      },
      select: { id: true },
    });

    return created.id;
  }

  return category.id;
}

async function resolveTagIds(inputs: string[]) {
  const normalizedInputs = [...new Set(inputs.map((item) => item.trim()).filter(Boolean))];
  const tagIds: string[] = [];

  for (const input of normalizedInputs) {
    const demoTag = demoTags.find(
      (item) =>
        item.id === input ||
        item.slug.toLowerCase() === input.toLowerCase() ||
        item.name.toLowerCase() === input.toLowerCase(),
    );

    const existing = await prisma.tag.findFirst({
      where: {
        OR: [
          { id: input },
          { slug: { equals: input, mode: "insensitive" } },
          { name: { equals: input, mode: "insensitive" } },
          ...(demoTag
            ? [
                { slug: { equals: demoTag.slug, mode: "insensitive" as const } },
                { name: { equals: demoTag.name, mode: "insensitive" as const } },
              ]
            : []),
        ],
      },
      select: { id: true },
    });

    if (existing) {
      tagIds.push(existing.id);
      continue;
    }

    const created = await prisma.tag.create({
      data: {
        name: demoTag?.name ?? input,
        slug: demoTag?.slug ?? slugify(input),
      },
      select: { id: true },
    });

    tagIds.push(created.id);
  }

  return tagIds;
}

export async function listCommunityArticles(query: CommunityQuery = {}) {
  if (!isDatabaseConfigured()) {
    return getDemoCommunityArticles(query);
  }

  try {
    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.PUBLISHED,
      approvalStatus: ArticleApprovalStatus.APPROVED,
      visibility: ArticleVisibility.PUBLIC,
      deletedAt: null,
      ...(query.category ? { category: { slug: query.category } } : {}),
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
      ...(query.type || query.tag
        ? {
            AND: [
              ...(query.type
                ? [
                    {
                      tags: {
                        some: {
                          tag: {
                            OR: [
                              {
                                slug: {
                                  equals: getDocumentTypeTagSlug(query.type),
                                  mode: "insensitive" as const,
                                },
                              },
                              {
                                name: {
                                  equals: getDocumentTypeLabel(query.type),
                                  mode: "insensitive" as const,
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ]
                : []),
              ...(query.tag
                ? [
                    {
                      tags: {
                        some: {
                          tag: {
                            slug: {
                              equals: query.tag,
                              mode: "insensitive" as const,
                            },
                          },
                        },
                      },
                    },
                  ]
                : []),
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

    return await prisma.article.findMany({
      where,
      orderBy,
      include: articleListInclude,
    });
  } catch (error) {
    console.error("Community article query failed, falling back to demo data.", error);
    return getDemoCommunityArticles(query);
  }
}

export async function getArticleBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return demoArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    return await prisma.article.findFirst({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
        approvalStatus: ArticleApprovalStatus.APPROVED,
        deletedAt: null,
        visibility: {
          not: ArticleVisibility.PRIVATE,
        },
      },
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
  } catch (error) {
    console.error("Article lookup failed, falling back to demo data.", error);
    return demoArticles.find((article) => article.slug === slug) ?? null;
  }
}

export async function listAuthorArticles(username: string) {
  if (!isDatabaseConfigured()) {
    return demoArticles.filter((article) => article.author.username === username);
  }

  return prisma.article.findMany({
    where: {
      author: { username },
      status: ArticleStatus.PUBLISHED,
      approvalStatus: ArticleApprovalStatus.APPROVED,
      deletedAt: null,
    },
    include: articleListInclude,
    orderBy: { publishedAt: "desc" },
  });
}

export async function listUserArticles(authorId: string) {
  if (!isDatabaseConfigured()) {
    return getDemoWorkflowArticles().filter(
      (article) => article.approvalStatus === ArticleApprovalStatus.APPROVED,
    );
  }

  return prisma.article.findMany({
    where: {
      authorId,
      approvalStatus: ArticleApprovalStatus.APPROVED,
      deletedAt: null,
    },
    include: articleListInclude,
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function listUserHistory(authorId: string) {
  if (!isDatabaseConfigured()) {
    return getDemoWorkflowArticles();
  }

  return prisma.article.findMany({
    where: {
      authorId,
      deletedAt: null,
    },
    include: articleListInclude,
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getDashboardOverview(authorId: string) {
  if (!isDatabaseConfigured()) {
    const articles = getDemoWorkflowArticles();
    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter((article) => article.status === ArticleStatus.PUBLISHED)
        .length,
      draftArticles: articles.filter(
        (article) =>
          article.status === ArticleStatus.DRAFT &&
          article.approvalStatus === ArticleApprovalStatus.APPROVED,
      ).length,
      archivedArticles: 0,
      pendingApprovalArticles: articles.filter(
        (article) => article.approvalStatus === ArticleApprovalStatus.PENDING,
      ).length,
      rejectedArticles: articles.filter(
        (article) => article.approvalStatus === ArticleApprovalStatus.REJECTED,
      ).length,
      totalViews: demoArticles.reduce((sum, article) => sum + article.viewCount, 0),
      totalLikes: demoArticles.reduce((sum, article) => sum + article.likeCount, 0),
      totalComments: demoArticles.reduce((sum, article) => sum + article.commentCount, 0),
      totalBookmarks: demoArticles.reduce((sum, article) => sum + article.bookmarkCount, 0),
      recentArticles: articles,
      authors: demoAuthors.slice(0, 3),
    };
  }

  const articleWhere: Prisma.ArticleWhereInput = {
    authorId,
    deletedAt: null,
  };

  const [
    articles,
    totalArticles,
    publishedArticles,
    draftArticles,
    archivedArticles,
    pendingApprovalArticles,
    rejectedArticles,
    aggregate,
  ] = await Promise.all([
    prisma.article.findMany({
      where: articleWhere,
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: articleListInclude,
    }),
    prisma.article.count({ where: articleWhere }),
    prisma.article.count({
      where: {
        ...articleWhere,
        status: ArticleStatus.PUBLISHED,
        approvalStatus: ArticleApprovalStatus.APPROVED,
      },
    }),
    prisma.article.count({
      where: {
        ...articleWhere,
        status: ArticleStatus.DRAFT,
        approvalStatus: ArticleApprovalStatus.APPROVED,
      },
    }),
    prisma.article.count({
      where: {
        ...articleWhere,
        status: ArticleStatus.ARCHIVED,
      },
    }),
    prisma.article.count({
      where: {
        ...articleWhere,
        approvalStatus: ArticleApprovalStatus.PENDING,
      },
    }),
    prisma.article.count({
      where: {
        ...articleWhere,
        approvalStatus: ArticleApprovalStatus.REJECTED,
      },
    }),
    prisma.article.aggregate({
      where: articleWhere,
      _sum: {
        viewCount: true,
        likeCount: true,
        commentCount: true,
        bookmarkCount: true,
      },
    }),
  ]);

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    archivedArticles,
    pendingApprovalArticles,
    rejectedArticles,
    totalViews: aggregate._sum.viewCount ?? 0,
    totalLikes: aggregate._sum.likeCount ?? 0,
    totalComments: aggregate._sum.commentCount ?? 0,
    totalBookmarks: aggregate._sum.bookmarkCount ?? 0,
    recentArticles: articles,
    authors: [],
  };
}

export async function listPendingArticleApprovals() {
  if (!isDatabaseConfigured()) {
    return getDemoWorkflowArticles().filter(
      (article) => article.approvalStatus === ArticleApprovalStatus.PENDING,
    );
  }

  return prisma.article.findMany({
    where: {
      approvalStatus: ArticleApprovalStatus.PENDING,
      deletedAt: null,
    },
    include: articleListInclude,
    orderBy: [{ submittedAt: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAdminArticleSubmissionById(id: string) {
  if (!isDatabaseConfigured()) {
    return getDemoWorkflowArticles().find((article) => article.id === id) ?? null;
  }

  return prisma.article.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getArticleApprovalSummary() {
  if (!isDatabaseConfigured()) {
    const articles = getDemoWorkflowArticles();
    return {
      pending: articles.filter((article) => article.approvalStatus === ArticleApprovalStatus.PENDING)
        .length,
      approved: articles.filter(
        (article) => article.approvalStatus === ArticleApprovalStatus.APPROVED,
      ).length,
      rejected: articles.filter(
        (article) => article.approvalStatus === ArticleApprovalStatus.REJECTED,
      ).length,
    };
  }

  const [pending, approved, rejected] = await Promise.all([
    prisma.article.count({
      where: {
        approvalStatus: ArticleApprovalStatus.PENDING,
        deletedAt: null,
      },
    }),
    prisma.article.count({
      where: {
        approvalStatus: ArticleApprovalStatus.APPROVED,
        deletedAt: null,
      },
    }),
    prisma.article.count({
      where: {
        approvalStatus: ArticleApprovalStatus.REJECTED,
        deletedAt: null,
      },
    }),
  ]);

  return { pending, approved, rejected };
}

export async function createArticle(input: {
  authorId: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  documentType: string;
  tags: string[];
}) {
  const sanitizedContent = sanitizeContent(input.content);
  const { readingTime, wordCount } = estimateReadingTime(input.content);
  const baseSlug = slugify(input.title);
  const tags = [
    getDocumentTypeLabel(input.documentType),
    ...input.tags,
  ].filter((tag, index, source) => source.indexOf(tag) === index);

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
      documentType: input.documentType,
      status: ArticleStatus.DRAFT,
      approvalStatus: ArticleApprovalStatus.PENDING,
      submittedAt: new Date().toISOString(),
    };
  }

  const [categoryId, tagIds] = await Promise.all([
    resolveCategoryId(input.categoryId),
    resolveTagIds(tags),
  ]);
  const existingSlugs = new Set((await prisma.article.findMany({ select: { slug: true } })).map((article) => article.slug));
  const slug = resolveSlugCollision(baseSlug, existingSlugs);

  return prisma.article.create({
    data: {
      authorId: input.authorId,
      categoryId,
      title: input.title,
      slug,
      subtitle: input.subtitle,
      excerpt: input.excerpt,
      content: input.content,
      sanitizedContent,
      coverImage: input.coverImage,
      readingTime,
      wordCount,
      approvalStatus: ArticleApprovalStatus.PENDING,
      submittedAt: new Date(),
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
    include: articleListInclude,
  });
}

export async function reviewArticleSubmission(input: {
  articleId: string;
  reviewerId?: string | null;
  decision: Extract<ArticleApprovalStatus, "APPROVED" | "REJECTED">;
  reviewFeedback?: string | null;
}) {
  const normalizedFeedback =
    input.reviewFeedback?.trim() ||
    (input.decision === ArticleApprovalStatus.APPROVED
      ? "Approved by admin and now published on LexCircle."
      : "This submission needs revision before it can be approved.");

  if (!isDatabaseConfigured()) {
    return {
      id: input.articleId,
      approvalStatus: input.decision,
      reviewedAt: new Date().toISOString(),
      reviewFeedback: normalizedFeedback,
      status:
        input.decision === ArticleApprovalStatus.APPROVED
          ? ArticleStatus.PUBLISHED
          : ArticleStatus.DRAFT,
      publishedAt:
        input.decision === ArticleApprovalStatus.APPROVED
          ? new Date().toISOString()
          : null,
    };
  }

  return prisma.article.update({
    where: { id: input.articleId },
    data: {
      approvalStatus: input.decision,
      reviewedAt: new Date(),
      reviewedById: input.reviewerId ?? null,
      reviewFeedback: normalizedFeedback,
      status:
        input.decision === ArticleApprovalStatus.APPROVED
          ? ArticleStatus.PUBLISHED
          : ArticleStatus.DRAFT,
      publishedAt:
        input.decision === ArticleApprovalStatus.APPROVED ? new Date() : null,
      archivedAt: null,
      deletedAt: null,
    },
    include: articleListInclude,
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

export async function transitionArticleStateForUser(input: {
  id: string;
  nextStatus: ArticleStatus;
  actor: ArticleActor;
}) {
  if (input.actor.isSuspended) {
    throw new Error("Suspended accounts cannot manage articles.");
  }

  if (!isDatabaseConfigured()) {
    return {
      id: input.id,
      status: input.nextStatus,
      approvalStatus:
        input.nextStatus === ArticleStatus.PUBLISHED
          ? ArticleApprovalStatus.APPROVED
          : ArticleApprovalStatus.PENDING,
    };
  }

  const article = await prisma.article.findUniqueOrThrow({
    where: { id: input.id },
    select: {
      id: true,
      authorId: true,
      status: true,
      approvalStatus: true,
      visibility: true,
      publishedAt: true,
    },
  });

  const isPortalAdmin = input.actor.isPortalAdmin || input.actor.role === UserRole.ADMIN;
  if (!isPortalAdmin && article.authorId !== input.actor.id) {
    throw new Error("You do not have permission to manage this article.");
  }

  if (
    input.nextStatus === ArticleStatus.PUBLISHED &&
    article.approvalStatus !== ArticleApprovalStatus.APPROVED
  ) {
    throw new Error("This article is still waiting for admin approval.");
  }

  if (!canTransitionArticle(article.status, input.nextStatus)) {
    throw new Error(`Invalid transition from ${article.status} to ${input.nextStatus}`);
  }

  return prisma.article.update({
    where: { id: input.id },
    data: {
      status: input.nextStatus,
      publishedAt:
        input.nextStatus === ArticleStatus.PUBLISHED ? new Date() : article.publishedAt,
      archivedAt: input.nextStatus === ArticleStatus.ARCHIVED ? new Date() : null,
      deletedAt: input.nextStatus === ArticleStatus.DELETED ? new Date() : null,
    },
    include: articleListInclude,
  });
}
