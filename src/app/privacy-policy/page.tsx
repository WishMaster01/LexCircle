import { SectionHeading } from "@/components/layout/section-heading";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Privacy Policy"
        title="Privacy for the LexCircle community"
        description="This page outlines how account, article, and interaction data are handled within the platform."
      />
      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted">
        LexCircle stores account details, drafts, approvals, and interaction
        data only for platform functionality, moderation, and community
        operations. Replace this placeholder with your final legal privacy
        policy before public launch.
      </div>
    </div>
  );
}
