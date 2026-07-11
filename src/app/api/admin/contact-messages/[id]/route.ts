import { errorResponse, successResponse } from "@/lib/api-response";
import { updateContactMessage } from "@/services/contact-service";
import { contactAdminUpdateSchema } from "@/lib/validations/contact-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json();
  const { id } = await params;
  const parsed = contactAdminUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const message = await updateContactMessage(id, {
    status: parsed.data.status,
    internalNotes: parsed.data.internalNotes || null,
    handledById: parsed.data.handledById || null,
  });
  return successResponse("Contact message updated successfully", message);
}
