import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { SectionHeading } from "@/components/layout/section-heading";
import { getOptionalAuthSession, isPortalAdminSession } from "@/lib/auth-guards";

export default async function AdminLoginPage() {
  const session = await getOptionalAuthSession();

  if (isPortalAdminSession(session)) {
    redirect("/admin");
  }

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-4xl border border-border/80 bg-card/80 p-5 sm:p-8">
          <SectionHeading
            eyebrow="Admin Login"
            title="Sign in to the admin dashboard"
            description="Use the admin email and password configured in `.env` to access article approvals, analytics, and the admin inbox."
          />
          <div className="mt-6 grid gap-3">
            {[
              "Review article approvals and returned submissions.",
              "Access admin analytics, contact inbox, and moderation views.",
              "This page is only for the configured portal admin credentials.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-border/80 bg-background/70 p-4 text-sm text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <AdminLoginForm />
      </div>
    </div>
  );
}
