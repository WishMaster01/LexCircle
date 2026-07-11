import { z } from "zod";

export const articleReviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  reviewFeedback: z.string().max(500).optional().or(z.literal("")),
});
