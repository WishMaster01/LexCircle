import { successResponse } from "@/lib/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Article analytics fetched successfully", {
    id,
    views: 1240,
    likes: 83,
    comments: 11,
    bookmarks: 29,
    readingCompletionRate: 0.62,
  });
}
