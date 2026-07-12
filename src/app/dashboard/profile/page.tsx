import Link from "next/link";
import { ArrowRight, FileText, PencilLine, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";
import { formatDisplayDate, formatRelativeDate } from "@/lib/utils";
import { getCurrentUserProfile } from "@/services/user-service";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireUserPageSession();
  const profile = await getCurrentUserProfile(session.user);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="User Profile"
        title="Your LexCircle writing identity"
        description="A simple profile for your public author presence, recent posts, and writing focus."
      />

      <section className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Avatar
              name={profile.name}
              image={profile.image}
              className="size-24 text-xl"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <Badge>@{profile.username}</Badge>
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                  {profile.name}
                </h2>
                <p className="max-w-2xl text-sm text-muted">
                  {profile.bio?.trim() ||
                    "Add a short bio to describe your legal interests, writing focus, and research areas."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    Total Posts
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {profile.stats.totalPosts}
                  </p>
                </div>
                <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    Joined Date
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {formatDisplayDate(profile.joinedAt)}
                  </p>
                </div>
                <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    Username
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    @{profile.username}
                  </p>
                </div>
                <div className="rounded-3xl border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    Email
                  </p>
                  <p className="mt-2 truncate text-sm font-medium text-foreground">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/profile/edit"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
            >
              <PencilLine className="size-4" />
              Edit profile
            </Link>
            <Link
              href={`/author/${profile.username}`}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-3 text-sm font-medium text-foreground"
            >
              View public page
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

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
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <h3 className="text-2xl font-semibold tracking-[-0.04em]">
            Subjects most written about
          </h3>
          {profile.stats.subjectsMostWrittenAbout.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {profile.stats.subjectsMostWrittenAbout.map((subject) => (
                <div
                  key={subject.slug}
                  className="rounded-full border border-border/80 bg-background/70 px-4 py-2 text-sm"
                >
                  {subject.name} ({subject.count})
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              No subject history yet. Your subject breakdown will appear after
              you publish or submit posts.
            </p>
          )}
        </div>

        <div className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">
              Recent posts
            </h3>
            <Link
              href="/dashboard/history"
              className="text-sm font-medium text-accent"
            >
              Open history
            </Link>
          </div>

          {profile.stats.recentPosts.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {profile.stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl border border-border/80 bg-background/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {post.category?.name ?? "Miscellaneous"}
                        </Badge>
                        <Badge
                          className={
                            post.approvalStatus === "PENDING"
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
                              : post.approvalStatus === "REJECTED"
                                ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                          }
                        >
                          {post.approvalStatus === "PENDING"
                            ? "Waiting for approval"
                            : post.approvalStatus === "REJECTED"
                              ? "Needs changes"
                              : "Approved"}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-semibold tracking-[-0.03em]">
                        {post.title}
                      </h4>
                    </div>
                    <FileText className="size-5 text-accent" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                    <span>Updated {formatRelativeDate(post.updatedAt)}</span>
                    <Link
                      href={
                        post.approvalStatus === "APPROVED"
                          ? `/article/${post.slug}`
                          : "/dashboard/history"
                      }
                      className="inline-flex items-center gap-2 font-medium text-accent"
                    >
                      Open
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              No recent posts yet. Start writing to build your LexCircle author
              profile.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
