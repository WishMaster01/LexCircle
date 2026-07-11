import { successResponse } from "@/lib/api-response";
import { listCommunityArticles } from "@/services/article-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articles = await listCommunityArticles({
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    type: searchParams.get("type") ?? undefined,
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

  return successResponse("Community articles fetched successfully", articles);
}
