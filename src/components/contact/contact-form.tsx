"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, MailCheck, Send, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  topic: "support",
  company: "",
  teamSize: "",
  message: "",
};

type ContactSubmitResult = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    submittedAt: string;
    topic: ContactFormValues["topic"];
    email: string;
    status: string;
    emailProvider: "none" | "resend" | "smtp";
    adminDelivered: boolean;
    userDelivered: boolean;
  };
};

export function ContactForm() {
  const [submission, setSubmission] = useState<ContactSubmitResult["data"] | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  async function onSubmit(values: ContactFormValues) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json()) as ContactSubmitResult;

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setSubmission(result.data ?? null);
    form.reset(defaultValues);
  }

  return (
    <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">Send a message</h2>
        <p className="mt-2 text-sm text-muted">
          Use the form for support, demos, partnership discussions, or platform questions. Messages
          are validated client-side and server-side before submission.
        </p>
      </div>

      {submission ? (
        <div className="mt-6 rounded-[1.5rem] border border-accent/20 bg-accent/8 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {submission.userDelivered ? (
              <MailCheck className="mt-0.5 size-5 text-accent-strong" />
            ) : submission.adminDelivered ? (
              <CheckCircle2 className="mt-0.5 size-5 text-accent-strong" />
            ) : (
              <TriangleAlert className="mt-0.5 size-5 text-accent-strong" />
            )}
            <div className="space-y-2 text-sm text-muted">
              <p className="font-medium text-foreground">
                {submission.userDelivered
                  ? "Your message was sent and a confirmation email has been sent to you."
                  : submission.adminDelivered
                    ? "Your message was sent to the InkSphere inbox."
                    : "Your message was saved, but email delivery is not configured yet."}
              </p>
              <p>
                {submission.userDelivered
                  ? `Check ${submission.email} for a confirmation email.`
                  : "If this is urgent, email the appropriate address above while delivery configuration is being finalized."}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.16em]">
                <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
                  Provider: {submission.emailProvider}
                </span>
                <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
                  Admin delivery: {submission.adminDelivered ? "sent" : "not sent"}
                </span>
                <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
                  User delivery: {submission.userDelivered ? "sent" : "not sent"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            {...form.register("name")}
            placeholder="Your full name"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Topic
          </label>
          <select
            id="topic"
            {...form.register("topic")}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          >
            <option value="support">Support</option>
            <option value="partnership">Partnership</option>
            <option value="security">Security</option>
            <option value="demo">Product demo</option>
            <option value="other">Other</option>
          </select>
          {form.formState.errors.topic ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.topic.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <input
            id="company"
            {...form.register("company")}
            placeholder="Organization or publication"
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          {form.formState.errors.company ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.company.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label htmlFor="teamSize" className="text-sm font-medium">
            Team size
          </label>
          <input
            id="teamSize"
            {...form.register("teamSize")}
            placeholder="Solo writer, 5 editors, 30-person team..."
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          {form.formState.errors.teamSize ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.teamSize.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            {...form.register("message")}
            rows={7}
            placeholder="Describe the issue, request, or use case with enough context to be actionable."
            className="w-full rounded-[1.5rem] border border-border/80 bg-background/80 px-4 py-3 outline-none focus:ring-4 focus:ring-ring"
          />
          {form.formState.errors.message ? (
            <p className="text-xs text-accent-strong">{form.formState.errors.message.message}</p>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Send message
          </button>
        </div>
      </form>
    </section>
  );
}
