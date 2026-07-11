import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { likeArticle, unlikeArticle } from "@/services/article-engagement-service";

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
    const result = await likeArticle(id, auth.session.user.id);
    return successResponse("Article liked successfully", result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to like article", 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const { id } = await params;
  try {
    const result = await unlikeArticle(id, auth.session.user.id);
    return successResponse("Article unliked successfully", result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to unlike article", 400);
  }
}
