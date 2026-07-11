import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";

export default async function ProfilePage() {
  const session = await requireUserPageSession();

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

        {session.user.isPortalAdmin ? (
          <div className="mt-6 rounded-3xl border border-accent/20 bg-accent/8 p-5">
            <p className="text-sm font-medium text-foreground">
              Admin access enabled
            </p>
            <p className="mt-2 text-sm text-muted">
              This account is signed in with the configured admin credentials.
              You can open the admin workspace directly from here.
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              <ShieldCheck className="size-4" />
              See admin dashboard
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
