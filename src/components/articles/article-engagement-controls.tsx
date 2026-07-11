"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatCompactNumber } from "@/lib/utils";

type Props = {
  articleId: string;
  commentCount: number;
  initialLikeCount: number;
  initialBookmarkCount: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  commentHref: string;
  compact?: boolean;
};

export function ArticleEngagementControls({
  articleId,
  commentCount,
  initialLikeCount,
  initialBookmarkCount,
  initialLiked = false,
  initialBookmarked = false,
  commentHref,
  compact = false,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [likePending, setLikePending] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  async function handleLike() {
    if (likePending) return;

    setLikePending(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/likes`, {
        method: liked ? "DELETE" : "POST",
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data?: { liked: boolean; likeCount: number };
      };

      if (!response.ok || !result.success || !result.data) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        toast.error(result.message || "Unable to update like.");
        return;
      }

      setLiked(result.data.liked);
      setLikeCount(result.data.likeCount);
    } catch {
      toast.error("Unable to update like.");
    } finally {
      setLikePending(false);
    }
  }

  async function handleBookmark() {
    if (bookmarkPending) return;

    setBookmarkPending(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/bookmarks`, {
        method: bookmarked ? "DELETE" : "POST",
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data?: { bookmarked: boolean; bookmarkCount: number };
      };

      if (!response.ok || !result.success || !result.data) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        toast.error(result.message || "Unable to update bookmark.");
        return;
      }

      setBookmarked(result.data.bookmarked);
      setBookmarkCount(result.data.bookmarkCount);
    } catch {
      toast.error("Unable to update bookmark.");
    } finally {
      setBookmarkPending(false);
    }
  }

  const buttonClass = compact
    ? "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm"
    : "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => void handleLike()}
        disabled={likePending}
        className={`${buttonClass} ${liked ? "bg-accent/10 text-accent-strong" : "bg-background/80 text-muted"} disabled:opacity-60`}
      >
        <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
        {formatCompactNumber(likeCount)}
      </button>
      <Link
        href={commentHref}
        className={`${buttonClass} bg-background/80 text-muted`}
      >
        <MessageSquare className="size-4" />
        {formatCompactNumber(commentCount)}
      </Link>
      <button
        type="button"
        onClick={() => void handleBookmark()}
        disabled={bookmarkPending}
        className={`${buttonClass} ${bookmarked ? "bg-accent/10 text-accent-strong" : "bg-background/80 text-muted"} disabled:opacity-60`}
      >
        <Bookmark className={`size-4 ${bookmarked ? "fill-current" : ""}`} />
        {formatCompactNumber(bookmarkCount)}
      </button>
    </div>
  );
}
