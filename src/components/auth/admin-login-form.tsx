"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validations/auth";

type LoginValues = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/admin",
    });

    if (result?.error) {
      toast.error("Invalid admin credentials");
      return;
    }

    router.push(result?.url ?? "/admin");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8"
    >
      <div className="rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted">
        Sign in with the admin email and password configured for the portal.
      </div>
      <input
        {...form.register("email")}
        placeholder="Admin email"
        className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
      />
      <div className="relative">
        <input
          {...form.register("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Admin password"
          className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 pr-12 outline-none focus:ring-4 focus:ring-ring"
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
      >
        Sign in to admin dashboard
      </button>
      <p className="text-sm text-muted">
        Need the regular user login instead?{" "}
        <Link href="/login" className="font-medium text-accent">
          Go to user login
        </Link>
      </p>
    </form>
  );
}
