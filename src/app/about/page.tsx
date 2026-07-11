import { SectionHeading } from "@/components/layout/section-heading";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
        <SectionHeading
          eyebrow="About"
          title="InkSphere is built for structured community publishing."
          description="It combines editorial workflows, discovery, analytics, and moderation in one modular Next.js stack."
        />
        <div className="mt-6 grid gap-4 text-sm text-muted md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">Editorial first</p>
            <p className="mt-2">
              Drafts, revisions, publishing states, and writing history are treated as core product
              features rather than afterthoughts.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">Community aware</p>
            <p className="mt-2">
              Discovery, bookmarks, follows, comments, and moderation work together so growth does
              not degrade content quality.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">Operationally clear</p>
            <p className="mt-2">
              Analytics, audit logs, permissions, and explicit state transitions keep the platform
              explainable for writers and administrators.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">Why InkSphere exists</h2>
          <div className="mt-4 space-y-4 text-sm text-muted">
            <p>
              Most publishing products are either lightweight writing tools with weak governance or
              heavy content systems that make authoring feel mechanical. InkSphere is designed to
              close that gap.
            </p>
            <p>
              The platform gives independent writers, editorial teams, and communities a shared
              workspace for producing articles that can move cleanly from draft to publication
              without losing context, ownership, or history.
            </p>
            <p>
              The result is a system where authors can focus on the writing experience while the
              platform still preserves moderation controls, traceability, and healthy discovery.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">What the platform includes</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            {[
              "Rich article editing with draft autosave and preview workflows",
              "Public community feed with ranking, filters, tags, and search",
              "Author dashboards for performance, history, bookmarks, and settings",
              "Role-aware moderation, reporting, and administration structure",
              "Prisma and PostgreSQL data modeling built for long-term scale",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-border/80 bg-background/70 p-3">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">Principles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Clarity over noise",
              text: "Feeds and analytics should explain what is happening instead of hiding behind opaque ranking decisions.",
            },
            {
              title: "Safety by default",
              text: "Drafts remain private, destructive actions are intentional, and moderation workflows are traceable.",
            },
            {
              title: "Strong writing UX",
              text: "Writers should have a calm, responsive interface that supports iteration rather than fighting it.",
            },
            {
              title: "Scalable architecture",
              text: "The system is structured to support Neon, Prisma, queue-backed jobs, and future expansion without a rewrite.",
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
