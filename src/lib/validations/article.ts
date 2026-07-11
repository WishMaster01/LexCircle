import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(10).max(160),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  excerpt: z.string().min(30).max(320),
  content: z.string().min(50),
  coverImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1).max(8),
  seoTitle: z.string().max(160).optional().or(z.literal("")),
  seoDescription: z.string().max(200).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export const scheduleArticleSchema = z.object({
  scheduledAt: z.coerce.date(),
});
