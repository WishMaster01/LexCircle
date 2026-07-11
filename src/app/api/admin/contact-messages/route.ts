import { successResponse } from "@/lib/api-response";
import { listContactMessages } from "@/services/contact-service";

export async function GET() {
  const messages = await listContactMessages();
  return successResponse("Contact messages fetched successfully", messages);
}
