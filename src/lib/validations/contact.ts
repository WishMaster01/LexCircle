import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Enter a valid email address"),
  topic: z.enum(["support", "partnership", "security", "demo", "other"]),
  company: z.string().max(120).optional().or(z.literal("")),
  teamSize: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
