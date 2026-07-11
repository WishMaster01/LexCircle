import { successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { listUserArticles } from "@/services/article-service";

export async function GET() {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const articles = await listUserArticles(auth.session.user.id);
  return successResponse("User articles fetched successfully", articles);
}
