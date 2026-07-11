import { SectionHeading } from "@/components/layout/section-heading";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Profile" title="Public author profile settings" />
      <div className="rounded-[1.75rem] border border-border/80 bg-card/80 p-6">
        <p className="text-sm text-muted">
          Profile editing hooks are wired through the user service and can be connected to a Neon
          database with the provided Prisma schema.
        </p>
      </div>
    </div>
  );
}
