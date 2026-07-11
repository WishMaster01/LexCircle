"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Decision = "APPROVED" | "REJECTED";

export function ArticleApprovalActions({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);

  async function submit(decision: Decision) {
    setActiveDecision(decision);

    try {
      const response = await fetch(`/api/admin/articles/${articleId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision }),
      });

      const result = (await response.json()) as { success: boolean; message: string };
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch {
      toast.error("Unable to update article approval right now.");
    } finally {
      setActiveDecision(null);
    }
  }

  const isSubmitting = activeDecision !== null;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => void submit("APPROVED")}
        disabled={isSubmitting}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {activeDecision === "APPROVED" ? "Approving..." : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => void submit("REJECTED")}
        disabled={isSubmitting}
        className="rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {activeDecision === "REJECTED" ? "Rejecting..." : "Reject"}
      </button>
    </div>
  );
}
