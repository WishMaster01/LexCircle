import { successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await request.json();
  return successResponse("Report submitted successfully", body, 201);
}
