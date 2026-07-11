import { ArticleStatus } from "@prisma/client";
import { successResponse } from "@/lib/api-response";
import { changeArticleState } from "@/services/article-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const article = await changeArticleState(id, ArticleStatus.DRAFT);
  return successResponse("Article restored successfully", article);
}
