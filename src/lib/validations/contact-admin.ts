import { ContactMessageStatus } from "@prisma/client";
import { z } from "zod";

export const contactAdminUpdateSchema = z.object({
  status: z.nativeEnum(ContactMessageStatus),
  internalNotes: z.string().max(2000).optional().or(z.literal("")),
  handledById: z.string().optional().or(z.literal("")),
});

export type ContactAdminUpdateValues = z.infer<typeof contactAdminUpdateSchema>;
