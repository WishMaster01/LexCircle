import { SectionHeading } from "@/components/layout/section-heading";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Profile"
        title="Public legal author profile settings"
      />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
        <p className="text-sm text-muted">
          This profile is intended to represent a student writer, researcher,
          or editor across public articles, comments, and approval history.
        </p>
      </div>
    </div>
  );
}
