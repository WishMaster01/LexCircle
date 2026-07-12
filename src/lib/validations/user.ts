import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().trim().min(2, "Name should be at least 2 characters.").max(80),
  bio: z.string().trim().max(320, "Bio should be 320 characters or fewer.").optional().or(z.literal("")),
  image: z
    .string()
    .refine(
      (value) =>
        value.length === 0 ||
        /^https?:\/\//.test(value) ||
        /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value),
      "Profile image must be an uploaded image or a valid URL.",
    )
    .optional()
    .or(z.literal("")),
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;
