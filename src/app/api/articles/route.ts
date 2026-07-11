import { successResponse, errorResponse } from "@/lib/api-response";
import { createArticle, listCommunityArticles } from "@/services/article-service";
import { articleSchema } from "@/lib/validations/article";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articles = await listCommunityArticles({
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    tag: searchParams.get("tag") ?? undefined,
    sort:
      (searchParams.get("sort") as
        | "latest"
        | "oldest"
        | "most-viewed"
        | "most-liked"
        | "most-commented"
        | "trending"
        | null) ?? "trending",
  });

  return successResponse("Articles fetched successfully", articles);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const article = await createArticle({
    authorId: "demo-author",
    title: parsed.data.title,
    subtitle: parsed.data.subtitle || undefined,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage || undefined,
    categoryId: parsed.data.categoryId,
    tags: parsed.data.tags,
  });

  return successResponse("Article created successfully", article, 201);
}
