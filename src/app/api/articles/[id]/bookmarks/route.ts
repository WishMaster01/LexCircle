import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { bookmarkArticle, removeBookmark } from "@/services/article-engagement-service";

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
    const result = await bookmarkArticle(id, auth.session.user.id);
    return successResponse("Article bookmarked successfully", result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to bookmark article", 400);
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
    const result = await removeBookmark(id, auth.session.user.id);
    return successResponse("Bookmark removed successfully", result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to remove bookmark", 400);
  }
}
