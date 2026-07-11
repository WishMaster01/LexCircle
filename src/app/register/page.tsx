"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionHeading } from "@/components/layout/section-heading";
import { registerSchema } from "@/lib/validations/auth";

type RegisterValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterValues) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Register"
            title="Create your law student author account"
            description="Set up a profile for legal writing, article submissions, bookmarking, and community participation."
          />
          <div className="mt-6 grid gap-3">
            {[
              "Claim a public legal author profile and username.",
              "Start case notes, blogs, and research drafts immediately after registration.",
              "Keep submission history and approval state tied to your account.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8"
        >
          <input
            {...form.register("name")}
            placeholder="Name"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("username")}
            placeholder="Username"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("email")}
            placeholder="Email"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <input
            {...form.register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
