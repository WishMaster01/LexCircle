import { successResponse } from "@/lib/api-response";

export async function PATCH() {
  return successResponse("Profile updated successfully", { updated: true });
}
