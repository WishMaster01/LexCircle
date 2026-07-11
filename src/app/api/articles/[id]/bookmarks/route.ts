import { successResponse } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Article bookmarked successfully", { id, bookmarked: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Bookmark removed successfully", { id, bookmarked: false });
}
