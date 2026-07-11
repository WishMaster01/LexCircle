import { errorResponse, successResponse } from "@/lib/api-response";
import { getArticleBySlug } from "@/services/article-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return errorResponse("Article not found", 404);
  }

  return successResponse("Article fetched successfully", article);
}
