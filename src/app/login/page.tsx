"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionHeading } from "@/components/layout/section-heading";
import { loginSchema } from "@/lib/validations/auth";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@inksphere.dev",
      password: "Password123!",
    },
  });

  async function onSubmit(values: LoginValues) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast.error("Invalid credentials");
      return;
    }

    router.push(result?.url ?? "/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Login"
            title="Sign in to your writing workspace"
            description="Access your drafts, revision history, bookmarks, and editorial tools from one place."
          />
          <div className="mt-6 grid gap-3">
            {[
              "Continue editing drafts across devices.",
              "Review history and publishing checkpoints quickly.",
              "Use the same account for author and dashboard workflows.",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>
        </section>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8"
        >
          <div className="rounded-[1.5rem] border border-border/80 bg-background/70 p-4 text-sm text-muted">
            Demo credentials are prefilled so you can test the signed-in flow immediately.
          </div>
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
          <button type="submit" className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-white">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
