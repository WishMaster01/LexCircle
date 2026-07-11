import { successResponse } from "@/lib/api-response";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Notification marked as read", { id, isRead: true });
}
