"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "@/lib/algorithms/debounce";
import { estimateReadingTime } from "@/lib/algorithms/reading-time";
import { articleSchema } from "@/lib/validations/article";

type FormValues = {
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
};

const defaultValues: FormValues = {
  title: "",
  subtitle: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "c1",
  tags: ["nextjs"],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
};

export function ArticleEditorForm() {
  const [preview, setPreview] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  const content = form.watch("content");
  const title = form.watch("title");
  const metrics = useMemo(() => estimateReadingTime(content), [content]);

  const autosave = useMemo(
    () =>
      debounce((values: FormValues) => {
        localStorage.setItem("inksphere-editor-draft", JSON.stringify(values));
        toast.success("Draft autosaved locally");
      }, 800),
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem("inksphere-editor-draft");
    if (!stored) return;
    try {
      form.reset(JSON.parse(stored) as FormValues);
    } catch {
      localStorage.removeItem("inksphere-editor-draft");
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      autosave(values as FormValues);
    });

    return () => subscription.unsubscribe();
  }, [autosave, form]);

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json()) as { success: boolean; message: string };
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 rounded-[1.75rem] border border-border/80 bg-card/80 p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <input
            {...form.register("title")}
            placeholder="Article title"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-3xl font-semibold outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("subtitle")}
            placeholder="Subtitle"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("excerpt")}
            placeholder="Article excerpt"
            rows={4}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("content")}
            placeholder="Write your article content here..."
            rows={18}
            className="w-full rounded-[1.5rem] border border-border/80 bg-background/80 px-4 py-4 font-mono text-sm outline-none focus:ring-4 focus:ring-ring"
          />
          {preview ? (
            <div className="prose-article rounded-[1.5rem] border border-border/80 bg-background/80 p-6">
              <h1>{title || "Preview title"}</h1>
              <p>{content || "Start writing to see the preview."}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-border/80 bg-background/80 p-4">
            <p className="text-sm font-medium text-muted">Draft metrics</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.wordCount} words</p>
            <p className="text-sm text-muted">{metrics.readingTime} min read</p>
          </div>
          <input
            {...form.register("coverImage")}
            placeholder="Cover image URL"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("categoryId")}
            placeholder="Category ID"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("tags.0")}
            placeholder="Primary tag"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("seoTitle")}
            placeholder="SEO title"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("seoDescription")}
            placeholder="SEO description"
            rows={4}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPreview((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-3 text-sm font-medium"
            >
              <Eye className="size-4" />
              {preview ? "Hide preview" : "Show preview"}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              <Save className="size-4" />
              Save draft
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
