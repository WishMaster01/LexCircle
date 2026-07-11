import { successResponse } from "@/lib/api-response";
import { commentSchema } from "@/lib/validations/comment";

const comments = [
  { id: "c1", content: "Strong model design.", author: "Jordan Lee" },
  { id: "c2", content: "The history checkpoints are useful.", author: "Sana Patel" },
];

export async function GET() {
  return successResponse("Comments fetched successfully", comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  return successResponse("Comment created successfully", { id: `comment-${Date.now()}`, ...parsed.data }, 201);
}
