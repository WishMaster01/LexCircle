import { ArticleStatus } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { transitionArticleStateForUser } from "@/services/article-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const { id } = await params;
  try {
    const article = await transitionArticleStateForUser({
      id,
      nextStatus: ArticleStatus.PUBLISHED,
      actor: auth.session.user,
    });
    return successResponse("Article published successfully", article);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to publish article", 400);
  }
}
