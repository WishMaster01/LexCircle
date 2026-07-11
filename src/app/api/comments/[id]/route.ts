import { successResponse } from "@/lib/api-response";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Comment updated successfully", { id });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Comment deleted successfully", { id });
}
