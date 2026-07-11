import { successResponse } from "@/lib/api-response";
import { requireAdminRouteSession } from "@/lib/auth-guards";
import { listContactMessages } from "@/services/contact-service";

export async function GET() {
  const auth = await requireAdminRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const messages = await listContactMessages();
  return successResponse("Contact messages fetched successfully", messages);
}
