import { successResponse } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return successResponse("Article duplicated successfully", { id, duplicateId: `${id}-copy` });
}
