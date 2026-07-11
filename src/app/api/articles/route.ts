import { successResponse, errorResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
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
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  try {
    const article = await createArticle({
      authorId: auth.session.user.id,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || undefined,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || undefined,
      categoryId: parsed.data.categoryId,
      tags: parsed.data.tags,
    });

    return successResponse(
      "Draft submitted successfully. It is now waiting for admin approval.",
      article,
      201,
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to create article",
      400,
    );
  }
}
