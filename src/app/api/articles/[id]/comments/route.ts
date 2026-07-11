import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { createArticleComment, listArticleComments } from "@/services/article-engagement-service";
import { commentSchema } from "@/lib/validations/comment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const comments = await listArticleComments(id);
  return successResponse("Comments fetched successfully", comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  try {
    const comment = await createArticleComment({
      articleId: id,
      userId: auth.session.user.id,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });
    return successResponse("Comment created successfully", comment, 201);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create comment", 400);
  }
}
