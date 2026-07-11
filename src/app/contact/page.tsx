import { SectionHeading } from "@/components/layout/section-heading";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
        <SectionHeading
          eyebrow="Contact"
          title="Platform support, editorial partnerships, and product conversations"
          description="Reach the InkSphere team for implementation help, account issues, demos, and collaboration requests."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">Direct channels</h2>
          <div className="mt-5 space-y-4 text-sm text-muted">
            <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
              <p className="font-semibold text-foreground">General support</p>
              <p className="mt-1">support@inksphere.dev</p>
              <p className="mt-2">Questions about accounts, access, content issues, or platform behavior.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
              <p className="font-semibold text-foreground">Partnerships</p>
              <p className="mt-1">partnerships@inksphere.dev</p>
              <p className="mt-2">Editorial collaborations, community programs, and product integration discussions.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
              <p className="font-semibold text-foreground">Security and abuse</p>
              <p className="mt-1">security@inksphere.dev</p>
              <p className="mt-2">Responsible disclosure, suspicious activity reports, and moderation escalation.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
          <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">Response expectations</h2>
          <div className="mt-5 space-y-4 text-sm text-muted">
            <p>
              We aim to respond to general support requests within one business day. Security and
              abuse reports are prioritized and reviewed faster when enough context is included.
            </p>
            <p>
              If you are writing about a publishing bug, include the affected page, your account
              role, and the steps required to reproduce the issue. That shortens triage time
              substantially.
            </p>
            <p>
              For partnership or demo requests, include your team size, intended use case, and any
              requirements around moderation, analytics, or publishing workflows.
            </p>
          </div>
        </section>
      </div>

      <ContactForm />

      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-5 sm:p-8">
        <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">Before you contact us</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Technical setup",
              text: "Check the README and environment setup if the issue is related to local development, Prisma, or authentication.",
            },
            {
              title: "Content moderation",
              text: "Use in-product reporting for article or comment abuse first so the moderation trail remains attached to the content.",
            },
            {
              title: "Account access",
              text: "Include the email or username tied to the account and a concise description of the failed action.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/80 bg-background/70 p-4">
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
