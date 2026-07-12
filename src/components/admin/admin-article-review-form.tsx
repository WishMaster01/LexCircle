"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Decision = "APPROVED" | "REJECTED";

export function AdminArticleReviewForm({
  articleId,
  initialFeedback,
}: {
  articleId: string;
  initialFeedback?: string | null;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);

  async function submit(decision: Decision) {
    setActiveDecision(decision);

    try {
      const response = await fetch(`/api/admin/articles/${articleId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision,
          reviewFeedback: feedback,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.message || "Unable to update article approval.");
        return;
      }

      toast.success(result.message);
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Unable to update article approval right now.");
    } finally {
      setActiveDecision(null);
    }
  }

  const isSubmitting = activeDecision !== null;

  return (
    <div className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-6">
      <h2 className="text-xl font-semibold tracking-[-0.04em]">
        Review decision
      </h2>
      <p className="mt-2 text-sm text-muted">
        Add an optional message for the writer. This message appears in their
        history and dashboard status.
      </p>
      <textarea
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="Write feedback for the author before approving or rejecting"
        rows={6}
        className="mt-4 w-full rounded-3xl border border-border/80 bg-background/80 px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-ring"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void submit("APPROVED")}
          disabled={isSubmitting}
          className="rounded-full bg-accent px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {activeDecision === "APPROVED" ? "Approving..." : "Approve and publish"}
        </button>
        <button
          type="button"
          onClick={() => void submit("REJECTED")}
          disabled={isSubmitting}
          className="rounded-full border border-border/80 bg-background/80 px-4 py-3 text-sm font-medium disabled:opacity-60"
        >
          {activeDecision === "REJECTED" ? "Rejecting..." : "Reject and send back"}
        </button>
      </div>
    </div>
  );
}
