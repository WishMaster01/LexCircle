import { successResponse } from "@/lib/api-response";
import { listCommunityArticles } from "@/services/article-service";

export async function GET() {
  const articles = await listCommunityArticles({ sort: "latest" });
  return successResponse("User articles fetched successfully", articles);
}
