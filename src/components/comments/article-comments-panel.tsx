"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { CommentThread } from "@/components/comments/comment-thread";

type CommentItem = {
  id: string;
  author: string;
  content: string;
  createdAt?: string;
  replies?: CommentItem[];
};

export function ArticleCommentsPanel({
  articleId,
  comments,
}: {
  articleId: string;
  comments: CommentItem[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() || pending) return;

    setPending(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const result = (await response.json()) as { success: boolean; message: string };
      if (!response.ok || !result.success) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        toast.error(result.message || "Unable to post comment.");
        return;
      }

      setContent("");
      toast.success("Comment posted successfully.");
      router.refresh();
    } catch {
      toast.error("Unable to post comment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-border/80 bg-card/80 p-4 sm:p-5">
        <label htmlFor="article-comment" className="text-sm font-medium text-foreground">
          Add a comment
        </label>
        <textarea
          id="article-comment"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          placeholder="Share your thoughts on this article..."
          className="mt-3 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={pending || !content.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            <Send className="size-4" />
            {pending ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      {comments.length ? (
        <CommentThread comments={comments} />
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 text-sm text-muted">
          No comments yet. Start the discussion.
        </div>
      )}
    </div>
  );
}
