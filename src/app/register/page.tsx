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

    const result = (await response.json()) as { success: boolean; message: string };
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <SectionHeading eyebrow="Register" title="Create your author account" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
        <input {...form.register("name")} placeholder="Name" className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring" />
        <input {...form.register("username")} placeholder="Username" className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring" />
        <input {...form.register("email")} placeholder="Email" className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring" />
        <input {...form.register("password")} type="password" placeholder="Password" className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring" />
        <input {...form.register("confirmPassword")} type="password" placeholder="Confirm password" className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring" />
        <button type="submit" className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-white">
          Create account
        </button>
      </form>
    </div>
  );
}
