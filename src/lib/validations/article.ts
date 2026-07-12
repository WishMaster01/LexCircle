import { z } from "zod";

function countWords(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

const coverImageSchema = z
  .string()
  .refine(
    (value) =>
      value.length === 0 ||
      /^https?:\/\//.test(value) ||
      /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value),
    "Cover image must be an uploaded image or a valid URL.",
  );

export const articleSchema = z.object({
  documentType: z.string().min(1).max(80),
  title: z.string().min(10).max(160),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  excerpt: z
    .string()
    .min(20)
    .refine((value) => countWords(value) <= 100, "Hook should be 100 words or fewer."),
  content: z
    .string()
    .refine(
      (value) =>
        value
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim().length >= 50,
      "Content should be at least 50 characters.",
    ),
  coverImage: coverImageSchema.optional().or(z.literal("")),
  categoryId: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1).max(8),
  seoTitle: z.string().max(160).optional().or(z.literal("")),
  seoDescription: z.string().max(200).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export const scheduleArticleSchema = z.object({
  scheduledAt: z.coerce.date(),
});
