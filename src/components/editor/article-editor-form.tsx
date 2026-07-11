"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, ImagePlus, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "@/lib/algorithms/debounce";
import { estimateReadingTime } from "@/lib/algorithms/reading-time";
import {
  getLegalFormatCopy,
  legalCategories,
  legalWritingFormats,
  suggestedLegalTags,
} from "@/constants/legal-writing";

const editorDraftKey = "lexcircle-legal-editor-draft";

const editorSchema = z.object({
  contentType: z.string().min(1, "Select a writing format."),
  title: z.string().min(10, "Title should be at least 10 characters.").max(160),
  subtitle: z.string().max(200).optional().or(z.literal("")),
  excerpt: z.string().min(30, "Write at least 30 characters for the abstract.").max(320),
  content: z.string().min(50, "Writing content should be at least 50 characters."),
  coverImage: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Select a legal category."),
  primaryTag: z.string().min(1, "Add a primary tag."),
  additionalTags: z.string().optional().or(z.literal("")),
  seoTitle: z.string().max(160).optional().or(z.literal("")),
  seoDescription: z.string().max(200).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

type EditorValues = z.infer<typeof editorSchema>;

const emptyValues: EditorValues = {
  contentType: "",
  title: "",
  subtitle: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  primaryTag: "",
  additionalTags: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
};

export function ArticleEditorForm({ initialKind }: { initialKind?: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      ...emptyValues,
      contentType: initialKind ?? "",
    },
  });

  const selectedKind = form.watch("contentType");
  const content = form.watch("content");
  const title = form.watch("title");
  const coverImage = form.watch("coverImage");
  const formatCopy = getLegalFormatCopy(selectedKind);
  const metrics = useMemo(() => estimateReadingTime(content), [content]);

  const autosave = useMemo(
    () =>
      debounce((values: EditorValues) => {
        localStorage.setItem(editorDraftKey, JSON.stringify(values));
      }, 800),
    [],
  );

  useEffect(() => {
    const stored = localStorage.getItem(editorDraftKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as EditorValues;
      form.reset({
        ...emptyValues,
        ...parsed,
        contentType: parsed.contentType || initialKind || "",
      });
    } catch {
      localStorage.removeItem(editorDraftKey);
    }
  }, [form, initialKind]);

  useEffect(() => {
    if (!initialKind) return;

    const current = form.getValues("contentType");
    if (!current) {
      form.setValue("contentType", initialKind, { shouldDirty: false });
    }
  }, [form, initialKind]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      autosave(values as EditorValues);
    });

    return () => subscription.unsubscribe();
  }, [autosave, form]);

  async function handleImageUpload(file: File) {
    setUploadingImage(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: data,
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
        data?: { url: string };
      };

      if (!response.ok || !result.success || !result.data?.url) {
        toast.error(result.message || "Unable to upload image.");
        return;
      }

      form.setValue("coverImage", result.data.url, { shouldDirty: true, shouldValidate: true });
      toast.success("Cover image uploaded.");
    } catch {
      toast.error("Unable to upload image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onSubmit(values: EditorValues) {
    const tags = [
      values.primaryTag.trim(),
      ...(values.additionalTags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ].filter((tag, index, source) => source.indexOf(tag) === index);

    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        subtitle: values.subtitle,
        excerpt: values.excerpt,
        content: values.content,
        coverImage: values.coverImage,
        categoryId: values.categoryId,
        tags,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        canonicalUrl: values.canonicalUrl,
      }),
    });

    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    localStorage.removeItem(editorDraftKey);
    toast.success(result.message);
    router.push("/dashboard/history");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 rounded-[1.75rem] border border-border/80 bg-card/80 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-border/80 bg-background/75 p-4">
            <p className="text-sm font-medium text-muted">Writing format</p>
            <select
              {...form.register("contentType")}
              className="mt-3 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
            >
              <option value="">Select writing format</option>
              {legalWritingFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm text-muted">{formatCopy.description}</p>
          </div>

          <input
            {...form.register("title")}
            placeholder="Title of your legal article, blog, case note, or research paper"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-3xl font-semibold outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("subtitle")}
            placeholder="Subtitle or explanatory line"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("excerpt")}
            placeholder="Abstract or short summary of the legal issue, argument, or judgment"
            rows={4}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("content")}
            placeholder="Write the full content here. You can draft legal arguments, case facts, issues, holdings, statutory interpretation, research sections, or conclusions."
            rows={18}
            className="w-full rounded-3xl border border-border/80 bg-background/80 px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-ring"
          />
          {preview ? (
            <div className="prose-article rounded-3xl border border-border/80 bg-background/80 p-6">
              <h1>{title || formatCopy.title}</h1>
              <p>{content || "Start writing to preview your legal draft."}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border/80 bg-background/80 p-4">
            <p className="text-sm font-medium text-muted">Draft metrics</p>
            <p className="mt-2 text-2xl font-semibold">{metrics.wordCount} words</p>
            <p className="text-sm text-muted">{metrics.readingTime} min read</p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-background/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted">Cover image</p>
                <p className="mt-1 text-sm text-muted">
                  Upload from your device or gallery instead of pasting a URL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-3 text-sm font-medium"
              >
                <Upload className="size-4" />
                {uploadingImage ? "Uploading..." : "Upload image"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleImageUpload(file);
                }
              }}
            />
            {coverImage ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover preview" className="h-40 w-full object-cover" />
              </div>
            ) : (
              <div className="mt-4 flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/80 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <ImagePlus className="size-4" />
                  No cover image uploaded yet
                </span>
              </div>
            )}
          </div>

          <select
            {...form.register("categoryId")}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none"
          >
            <option value="">Select legal category</option>
            {legalCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <input
            {...form.register("primaryTag")}
            placeholder="Primary tag"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <textarea
            {...form.register("additionalTags")}
            placeholder="Additional tags separated by commas"
            rows={3}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <div className="rounded-3xl border border-border/80 bg-background/80 p-4">
            <p className="text-sm font-medium text-muted">Suggested law tags</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedLegalTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => form.setValue("primaryTag", tag, { shouldDirty: true })}
                  className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

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
          <input
            {...form.register("canonicalUrl")}
            placeholder="Canonical URL (optional)"
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
              Submit for approval
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
