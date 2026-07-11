CREATE TYPE "public"."ArticleApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "public"."Article"
ADD COLUMN "approvalStatus" "public"."ArticleApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "submittedAt" TIMESTAMP(3),
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "reviewedById" TEXT,
ADD COLUMN "reviewFeedback" TEXT;

UPDATE "public"."Article"
SET
  "approvalStatus" = CASE
    WHEN "status" = 'PUBLISHED' THEN 'APPROVED'::"public"."ArticleApprovalStatus"
    ELSE 'PENDING'::"public"."ArticleApprovalStatus"
  END,
  "submittedAt" = COALESCE("createdAt", CURRENT_TIMESTAMP),
  "reviewedAt" = CASE
    WHEN "status" = 'PUBLISHED' THEN COALESCE("publishedAt", "updatedAt", CURRENT_TIMESTAMP)
    ELSE NULL
  END;

CREATE INDEX "Article_approvalStatus_createdAt_idx" ON "public"."Article"("approvalStatus", "createdAt");

ALTER TABLE "public"."Article"
ADD CONSTRAINT "Article_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
