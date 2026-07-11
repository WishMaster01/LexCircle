import { successResponse } from "@/lib/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  return successResponse("Author followed successfully", { username, following: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  return successResponse("Author unfollowed successfully", { username, following: false });
}
