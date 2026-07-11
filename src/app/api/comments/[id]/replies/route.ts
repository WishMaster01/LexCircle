import { successResponse } from "@/lib/api-response";
import { commentSchema } from "@/lib/validations/comment";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  return successResponse("Reply created successfully", { parentId: id, ...parsed.data }, 201);
}
