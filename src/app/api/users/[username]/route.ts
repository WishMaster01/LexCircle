import { errorResponse, successResponse } from "@/lib/api-response";
import { getAuthorProfile } from "@/services/user-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const profile = await getAuthorProfile(username);
  if (!profile) {
    return errorResponse("User not found", 404);
  }
  return successResponse("User profile fetched successfully", profile);
}
