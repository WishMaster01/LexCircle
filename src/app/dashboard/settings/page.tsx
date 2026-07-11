import { SectionHeading } from "@/components/layout/section-heading";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Settings" title="Session, preferences, and connected services" />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
        <p className="text-sm text-muted">
          Add environment variables for Google OAuth, Neon, and Cloudinary to unlock the connected
          production path.
        </p>
      </div>
    </div>
  );
}
