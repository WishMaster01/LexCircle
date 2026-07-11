import { z } from "zod";

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const searchSchema = paginationSchema.extend({
  query: z.string().trim().default(""),
  category: z.string().optional(),
  tag: z.string().optional(),
  sort: z
    .enum(["latest", "oldest", "most-viewed", "most-liked", "most-commented", "trending"])
    .default("trending"),
});
