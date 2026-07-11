import { successResponse } from "@/lib/api-response";
import { requireAdminRouteSession } from "@/lib/auth-guards";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json();
  const { id } = await params;
  return successResponse("Report updated successfully", { id, ...body });
}
