import { SectionHeading } from "@/components/layout/section-heading";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-border/80 bg-card/80 p-8">
        <SectionHeading
          eyebrow="About"
          title="LexCircle is built for law students who write, research, and debate."
          description="It combines legal writing workflows, peer discovery, moderation, and academic visibility in one focused community platform."
        />
        <div className="mt-6 grid gap-4 text-sm text-muted md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">
              Legal writing first
            </p>
            <p className="mt-2">
              Drafts, revisions, approval states, and writing history are built
              around case notes, legal blogs, articles, and research papers.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">
              Community aware
            </p>
            <p className="mt-2">
              Discovery, bookmarks, follows, comments, and moderation work
              together so growth does not degrade content quality.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
            <p className="text-lg font-semibold text-foreground">
              Academic structure
            </p>
            <p className="mt-2">
              Clear categories, tags, review states, and author ownership make
              the platform understandable for students, editors, and admins.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-4xl border border-border/80 bg-card/80 p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            Why LexCircle exists
          </h2>
          <div className="mt-4 space-y-4 text-sm text-muted">
            <p>
              Most writing tools are not built for legal study. They either
              feel too generic for structured legal analysis or too rigid for
              student-led publishing communities. LexCircle is designed to
              close that gap.
            </p>
            <p>
              The platform gives law students, campus journals, moot court
              members, and emerging legal researchers a shared workspace for
              producing writing that can move cleanly from draft to review to
              publication without losing context, ownership, or history.
            </p>
            <p>
              The result is a community where legal writers can focus on strong
              argumentation and accurate analysis while the platform still
              preserves moderation, traceability, and healthy discovery.
            </p>
          </div>
        </section>

        <section className="rounded-4xl border border-border/80 bg-card/80 p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">
            What the platform includes
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            {[
              "Legal writing drafts with autosave, preview, and approval workflow",
              "A public law student community feed with ranking, filters, tags, and search",
              "Author dashboards for history, bookmarks, approved work, and profile management",
              "Role-aware moderation for article approval, abuse handling, and admin review",
              "Structured categories and tags for constitutional, criminal, civil, corporate, and related fields",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border/80 bg-background/70 p-3"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-4xl border border-border/80 bg-card/80 p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.04em]">
          Principles
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Clarity over noise",
              text: "Students should understand why writing is visible, pending review, or gaining attention.",
            },
            {
              title: "Safety by default",
              text: "Drafts remain private, approval decisions are explicit, and moderation actions stay traceable.",
            },
            {
              title: "Serious writing UX",
              text: "Legal writers need a calm interface that supports citation-heavy thinking, iteration, and revision.",
            },
            {
              title: "Community growth",
              text: "The system is structured for law-school societies, journals, and growing student communities without a rewrite.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/80 bg-background/70 p-4"
            >
              <p className="text-base font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
