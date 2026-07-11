import { successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { listUserHistory } from "@/services/article-service";

export async function GET() {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const history = await listUserHistory(auth.session.user.id);
  return successResponse("History fetched successfully", history);
}
