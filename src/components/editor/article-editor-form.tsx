"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Upload } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "@/lib/algorithms/debounce";
import { legalCategories, legalWritingFormats } from "@/constants/legal-writing";

const editorDraftKey = "lexcircle-legal-editor-draft";

const editorSchema = z.object({
  title: z.string().min(10, "Title should be at least 10 characters.").max(160),
  categoryId: z.string().min(1, "Select a subject."),
  contentType: z.string().min(1, "Select a document type."),
  coverImage: z.string().optional().or(z.literal("")),
  content: z.string().min(50, "Content should be at least 50 characters."),
  tags: z.string().min(1, "Add at least one tag."),
});

type EditorValues = z.infer<typeof editorSchema>;

const emptyValues: EditorValues = {
  title: "",
  categoryId: "",
  contentType: "",
  coverImage: "",
  content: "",
  tags: "",
};

function buildExcerpt(content: string) {
  return content.replace(/\s+/g, " ").trim().slice(0, 320);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function ArticleEditorForm({ initialKind }: { initialKind?: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      ...emptyValues,
      contentType: initialKind ?? "",
    },
  });

  const coverImage = form.watch("coverImage");

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

    if (!form.getValues("contentType")) {
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

      form.setValue("coverImage", result.data.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Cover image uploaded.");
    } catch {
      toast.error("Unable to upload image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onSubmit(values: EditorValues) {
    const tags = values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .filter((tag, index, source) => source.indexOf(tag) === index);

    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentType: values.contentType,
        title: values.title,
        subtitle: "",
        excerpt: buildExcerpt(values.content),
        content: values.content,
        coverImage: values.coverImage,
        categoryId: values.categoryId,
        tags,
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

  const {
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5 sm:p-6"
    >
      <div className="grid gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">Title</label>
          <input
            {...form.register("title")}
            placeholder="Enter your legal writing title"
            className="mt-2 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Subject</label>
          <select
            {...form.register("categoryId")}
            className="mt-2 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          >
            <option value="">Select a subject</option>
            {legalCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Document Type
          </label>
          <select
            {...form.register("contentType")}
            className="mt-2 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          >
            <option value="">Select a document type</option>
            {legalWritingFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.contentType?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">
            Cover Image (optional)
          </label>
          <div className="mt-2 rounded-3xl border border-border/80 bg-background/80 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-3 text-sm font-medium"
            >
              <Upload className="size-4" />
              {uploadingImage ? "Uploading..." : "Upload cover image"}
            </button>
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
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 flex h-36 items-center justify-center rounded-2xl border border-dashed border-border/80 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <ImagePlus className="size-4" />
                  No cover image uploaded
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Content</label>
          <textarea
            {...form.register("content")}
            placeholder="Write your legal content here"
            rows={18}
            className="mt-2 w-full rounded-3xl border border-border/80 bg-background/80 px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-ring"
          />
          <FieldError message={errors.content?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Tags</label>
          <input
            {...form.register("tags")}
            placeholder="constitutional law, precedent, bail, legal research"
            className="mt-2 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <FieldError message={errors.tags?.message} />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
          >
            Publish
          </button>
        </div>
      </div>
    </form>
  );
}
