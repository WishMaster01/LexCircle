import { successResponse } from "@/lib/api-response";

export async function GET() {
  return successResponse("History fetched successfully", [
    { id: "h1", action: "Article created" },
    { id: "h2", action: "Article published" },
  ]);
}
