import { successResponse } from "@/lib/api-response";
import { requireAdminRouteSession } from "@/lib/auth-guards";

export async function GET() {
  const auth = await requireAdminRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  return successResponse("Reports fetched successfully", [
    { id: "r1", status: "PENDING", reason: "OTHER" },
  ]);
}
