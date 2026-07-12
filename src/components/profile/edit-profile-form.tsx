"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Upload } from "lucide-react";
import { toast } from "sonner";
import { userProfileSchema, type UserProfileValues } from "@/lib/validations/user";

type EditProfileFormProps = {
  initialValues: {
    name: string;
    bio?: string | null;
    image?: string | null;
  };
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function EditProfileForm({ initialValues }: EditProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { update } = useSession();
  const [uploadingImage, setUploadingImage] = useState(false);
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: initialValues.name,
      bio: initialValues.bio ?? "",
      image: initialValues.image ?? "",
    },
  });

  const image = form.watch("image");

  async function handleImageUpload(file: File) {
    setUploadingImage(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("purpose", "PROFILE_IMAGE");

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
        toast.error(result.message || "Unable to upload profile image.");
        return;
      }

      form.setValue("image", result.data.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Profile image uploaded.");
    } catch {
      toast.error("Unable to upload profile image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function onSubmit(values: UserProfileValues) {
    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };

    if (!response.ok || !result.success) {
      toast.error(result.message || "Unable to update profile.");
      return;
    }

    await update({
      name: values.name,
      image: values.image || null,
    });
    toast.success("Profile updated successfully.");
    router.push("/dashboard/profile");
    router.refresh();
  }

  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8"
    >
      <div className="grid gap-6">
        <div>
          <label className="text-sm font-medium text-foreground">
            Profile Photo
          </label>
          <div className="mt-2 rounded-3xl border border-border/80 bg-background/80 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-3 text-sm font-medium"
              >
                <Upload className="size-4" />
                {uploadingImage ? "Uploading..." : "Upload photo"}
              </button>
              {image ? (
                <button
                  type="button"
                  onClick={() =>
                    form.setValue("image", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className="rounded-full border border-border/80 bg-card px-4 py-3 text-sm font-medium"
                >
                  Remove photo
                </button>
              ) : null}
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
            {image ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-border/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Profile preview"
                  className="h-40 w-40 rounded-2xl object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/80 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <ImagePlus className="size-4" />
                  No profile photo uploaded
                </span>
              </div>
            )}
          </div>
          <FieldError message={errors.image?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Name</label>
          <input
            {...form.register("name")}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            {...form.register("bio")}
            rows={5}
            placeholder="Write a short bio about your legal interests, writing focus, or research areas"
            className="mt-2 w-full rounded-3xl border border-border/80 bg-background/80 px-4 py-4 text-sm outline-none focus:ring-4 focus:ring-ring"
          />
          <FieldError message={errors.bio?.message} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
          <Link
            href="/dashboard/profile"
            className="inline-flex rounded-full border border-border/80 bg-background/80 px-5 py-3 text-sm font-medium text-foreground"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
