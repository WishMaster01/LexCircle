import { successResponse } from "@/lib/api-response";

export async function GET() {
  return successResponse("Notifications fetched successfully", [
    { id: "n1", title: "New bookmark", isRead: false },
  ]);
}
