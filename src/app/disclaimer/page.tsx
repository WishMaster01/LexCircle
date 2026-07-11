import { SectionHeading } from "@/components/layout/section-heading";

export default function DisclaimerPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Disclaimer"
        title="General legal publishing disclaimer"
        description="This page should clarify that LexCircle content is community-published educational material and not professional legal advice."
      />
      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted">
        Replace this placeholder with your final disclaimer. For a law student
        community platform, that usually includes educational-use wording,
        non-advice language, and user responsibility for independent
        verification.
      </div>
    </div>
  );
}
