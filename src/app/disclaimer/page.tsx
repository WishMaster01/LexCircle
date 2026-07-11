import { SectionHeading } from "@/components/layout/section-heading";

const sections = [
  {
    title: "Educational Purpose",
    body: "LexCircle is a community platform intended for legal writing, student scholarship, academic discussion, case analysis, research publication, and educational engagement.",
  },
  {
    title: "Not Legal Advice",
    body: "Content published on LexCircle does not constitute legal advice, legal representation, professional consultation, or a substitute for advice from a qualified legal professional.",
  },
  {
    title: "User-Generated Content",
    body: "Articles, notes, comments, and other submissions on LexCircle are created by users, contributors, or administrators. LexCircle does not guarantee that all published material is complete, current, jurisdictionally accurate, or free from error.",
  },
  {
    title: "Independent Verification",
    body: "Readers should independently verify statutes, judgments, procedural rules, and legal propositions before relying on any content for academic, professional, institutional, or personal use.",
  },
  {
    title: "No Lawyer-Client Relationship",
    body: "Using LexCircle, submitting content, reading platform material, or contacting the platform does not create any lawyer-client, advisor-client, or fiduciary relationship.",
  },
  {
    title: "External Links and Sources",
    body: "LexCircle content may reference external sources, articles, judgments, or websites. LexCircle is not responsible for the availability, accuracy, or content of third-party resources.",
  },
  {
    title: "Platform Rights",
    body: "LexCircle may edit, remove, reject, moderate, or reorganize content for operational, editorial, moderation, or legal reasons without guaranteeing continued publication.",
  },
] as const;

export default function DisclaimerPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Disclaimer"
        title="Disclaimer for LexCircle"
        description="This disclaimer explains the educational nature of LexCircle and limits on reliance, liability, and professional interpretation."
      />

      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted sm:p-8">
        <p>
          LexCircle is designed as a legal writing and discussion platform. The
          content available through the platform is intended for educational and
          informational use only.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-4xl border border-border/80 bg-card/80 p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
