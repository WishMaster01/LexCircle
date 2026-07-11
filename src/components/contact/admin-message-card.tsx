"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContactMessageStatus, ContactTopic, UserRole } from "@prisma/client";
import { LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/utils";

type Handler = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
};

type Message = {
  id: string;
  name: string;
  email: string;
  topic: ContactTopic;
  company: string | null;
  teamSize: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  handledAt: string | Date | null;
  internalNotes: string | null;
  handledById: string | null;
  handledBy?: Handler | null;
};

export function AdminMessageCard({
  message,
  handlers,
}: {
  message: Message;
  handlers: Handler[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ContactMessageStatus>(message.status);
  const [handledById, setHandledById] = useState(message.handledById ?? "");
  const [internalNotes, setInternalNotes] = useState(message.internalNotes ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function onSave() {
    setIsSaving(true);
    const response = await fetch(`/api/admin/contact-messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        handledById,
        internalNotes,
      }),
    });

    const result = (await response.json()) as { success: boolean; message: string };
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.refresh();
  }

  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-card/80 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-lg font-semibold">{message.name}</p>
          <p className="mt-1 text-sm text-muted">{message.email}</p>
        </div>
        <div className="text-left text-sm text-muted sm:text-right">
          <p>{message.status.replaceAll("_", " ")}</p>
          <p className="mt-1">{formatRelativeDate(message.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
        <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
          {message.topic}
        </span>
        {message.company ? (
          <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
            {message.company}
          </span>
        ) : null}
        {message.teamSize ? (
          <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
            {message.teamSize}
          </span>
        ) : null}
        {message.handledBy ? (
          <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1">
            Assigned to {message.handledBy.name}
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-muted">{message.message}</p>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`status-${message.id}`}>
            Status
          </label>
          <select
            id={`status-${message.id}`}
            value={status}
            onChange={(event) => setStatus(event.target.value as ContactMessageStatus)}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-ring"
          >
            {Object.values(ContactMessageStatus).map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`handler-${message.id}`}>
            Assign to
          </label>
          <select
            id={`handler-${message.id}`}
            value={handledById}
            onChange={(event) => setHandledById(event.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-ring"
          >
            <option value="">Unassigned</option>
            {handlers.map((handler) => (
              <option key={handler.id} value={handler.id}>
                {handler.name} (@{handler.username})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 xl:col-span-2">
          <label className="text-sm font-medium" htmlFor={`notes-${message.id}`}>
            Internal notes
          </label>
          <textarea
            id={`notes-${message.id}`}
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            rows={4}
            className="w-full rounded-[1.5rem] border border-border/80 bg-background/80 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-ring"
            placeholder="Add internal triage notes, next steps, or context for the assigned admin."
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Last updated {formatRelativeDate(message.updatedAt)}
          {message.handledAt ? ` · handled ${formatRelativeDate(message.handledAt)}` : ""}
        </p>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isSaving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save changes
        </button>
      </div>
    </article>
  );
}
