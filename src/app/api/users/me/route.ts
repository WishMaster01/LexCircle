import { errorResponse, successResponse } from "@/lib/api-response";
import { requireUserRouteSession } from "@/lib/auth-guards";
import { userProfileSchema } from "@/lib/validations/user";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/services/user-service";

export async function GET() {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const profile = await getCurrentUserProfile(auth.session.user);
  return successResponse("Profile fetched successfully", profile);
}

export async function PATCH(request: Request) {
  const auth = await requireUserRouteSession();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = userProfileSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const profile = await updateCurrentUserProfile(auth.session.user, {
    name: parsed.data.name,
    bio: parsed.data.bio || null,
    image: parsed.data.image || null,
  });

  return successResponse("Profile updated successfully", profile);
}
