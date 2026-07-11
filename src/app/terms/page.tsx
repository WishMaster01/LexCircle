import { SectionHeading } from "@/components/layout/section-heading";

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Terms"
        title="Terms of use for LexCircle"
        description="This page should define platform rules for publishing, user conduct, moderation, and acceptable use."
      />
      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted">
        Replace this placeholder with the final terms covering registration,
        content ownership, moderation powers, and limits on liability.
      </div>
    </div>
  );
}
