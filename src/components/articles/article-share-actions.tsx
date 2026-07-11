"use client";

import { Download, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  title: string;
  slug: string;
  content: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ArticleShareActions({ title, slug, content }: Props) {
  async function handleShare() {
    const url = `${window.location.origin}/article/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Article link copied.");
    } catch {
      toast.error("Unable to copy article link.");
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/article/${slug}`);
      toast.success("Shareable link copied.");
    } catch {
      toast.error("Unable to copy shareable link.");
    }
  }

  function handleDownload() {
    const text = `${title}\n\n${window.location.origin}/article/${slug}\n\n${stripHtml(content)}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-3 text-sm">
      <button
        type="button"
        onClick={() => void handleShare()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2"
      >
        <Share2 className="size-4" />
        Share
      </button>
      <button
        type="button"
        onClick={() => void handleCopyLink()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2"
      >
        <Link2 className="size-4" />
        Copy link
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-background/80 px-3 py-2"
      >
        <Download className="size-4" />
        Download
      </button>
    </div>
  );
}
