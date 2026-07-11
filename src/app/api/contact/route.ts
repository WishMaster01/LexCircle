import { errorResponse, successResponse } from "@/lib/api-response";
import { sendContactEmail } from "@/services/mail-service";
import { submitContactMessage } from "@/services/contact-service";
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const topicLabels: Record<typeof parsed.data.topic, string> = {
    support: "support",
    partnership: "partnership",
    security: "security",
    demo: "campus demo",
    other: "general",
  };

  const saved = await submitContactMessage(parsed.data);
  let emailProvider = "none";
  let adminDelivered = false;
  let userDelivered = false;

  try {
    const delivery = await sendContactEmail(parsed.data);
    emailProvider = delivery.provider;
    adminDelivered = delivery.adminDelivered;
    userDelivered = delivery.userDelivered;
  } catch (error) {
    console.error("Contact email delivery failed", error);
  }

  return successResponse(
    `Your ${topicLabels[parsed.data.topic]} message has been received`,
    {
      id: saved.id,
      submittedAt: saved.createdAt,
      topic: parsed.data.topic,
      email: saved.email,
      status: saved.status,
      emailProvider,
      adminDelivered,
      userDelivered,
    },
    201,
  );
}
