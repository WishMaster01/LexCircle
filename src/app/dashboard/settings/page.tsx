import { SectionHeading } from "@/components/layout/section-heading";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Settings"
        title="Session, preferences, and community integrations"
      />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
        <p className="text-sm text-muted">
          Configure authentication, database, and email delivery so student
          submissions, approvals, bookmarks, and support workflows persist
          correctly.
        </p>
      </div>
    </div>
  );
}
