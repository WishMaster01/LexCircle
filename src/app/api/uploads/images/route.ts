import { successResponse } from "@/lib/api-response";

export async function POST() {
  return successResponse("Image uploaded successfully", {
    url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    publicId: "demo/sample",
  });
}

export async function DELETE() {
  return successResponse("Image deleted successfully", { deleted: true });
}
