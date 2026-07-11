import { ArticleApprovalStatus } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdminRouteSession } from "@/lib/auth-guards";
import { reviewArticleSubmission } from "@/services/article-service";
import { articleReviewSchema } from "@/lib/validations/article-review";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json();
  const parsed = articleReviewSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const { id } = await params;

  try {
    const article = await reviewArticleSubmission({
      articleId: id,
      reviewerId: auth.session.user.id === "env-admin" ? null : auth.session.user.id,
      decision:
        parsed.data.decision === "APPROVED"
          ? ArticleApprovalStatus.APPROVED
          : ArticleApprovalStatus.REJECTED,
      reviewFeedback: parsed.data.reviewFeedback || undefined,
    });

    return successResponse(
      parsed.data.decision === "APPROVED"
        ? "Article approved successfully"
        : "Article sent back for revision",
      article,
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to review article",
      400,
    );
  }
}
