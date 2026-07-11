import { successResponse } from "@/lib/api-response";

export async function GET() {
  return successResponse("Reports fetched successfully", [
    { id: "r1", status: "PENDING", reason: "OTHER" },
  ]);
}
