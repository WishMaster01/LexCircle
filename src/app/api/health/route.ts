import { successResponse } from "@/lib/api-response";

export async function GET() {
  return successResponse("Service healthy", { status: "ok" });
}
