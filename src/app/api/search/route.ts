import { successResponse } from "@/lib/api-response";
import { getSearchSuggestions } from "@/services/search-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";
  return successResponse("Search suggestions fetched successfully", {
    query,
    suggestions: getSearchSuggestions(query),
  });
}
