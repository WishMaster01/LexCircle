import { SectionHeading } from "@/components/layout/section-heading";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using LexCircle, you agree to these Terms of Use. If you do not agree, you should not use the platform.",
  },
  {
    title: "2. Platform Purpose",
    body: "LexCircle is intended as a community platform for legal writing, student scholarship, commentary, case analysis, research publication, and related discussion. It is not a law firm service, legal practice platform, or guarantee of academic or professional review.",
  },
  {
    title: "3. Account Responsibility",
    body: "Users are responsible for maintaining the confidentiality of their login credentials and for activities that occur through their account. You must provide accurate account information and must not impersonate another person or institution.",
  },
  {
    title: "4. Content Ownership and License",
    body: "You retain responsibility for content you submit to LexCircle. By publishing or submitting content through the platform, you grant LexCircle the right to host, display, process, format, and distribute that content for platform operation, moderation, and public access where applicable.",
  },
  {
    title: "5. Content Standards",
    body: "You must not submit unlawful, defamatory, plagiarized, abusive, misleading, infringing, or harmful content. You are responsible for ensuring that your legal writing, commentary, and uploaded material comply with applicable law and respect intellectual property rights.",
  },
  {
    title: "6. Moderation and Approval",
    body: "LexCircle may review, reject, remove, restrict, or moderate content in accordance with platform rules, admin workflows, abuse handling, or operational requirements. Submission to the platform does not guarantee publication.",
  },
  {
    title: "7. Community Conduct",
    body: "Users must interact respectfully through comments, engagement features, and contact channels. Harassment, spam, abuse, fraudulent activity, or attempts to disrupt the platform may result in suspension, removal, or permanent restriction.",
  },
  {
    title: "8. Availability and Changes",
    body: "LexCircle may modify features, workflows, categories, document types, access rules, or service availability at any time. We do not guarantee uninterrupted access or permanent availability of any feature.",
  },
  {
    title: "9. Limitation of Liability",
    body: "LexCircle is provided on an as-available basis. To the maximum extent permitted by law, LexCircle and its operators are not liable for losses arising from platform downtime, content inaccuracies, user conduct, or reliance on published material.",
  },
  {
    title: "10. Termination",
    body: "LexCircle may suspend or terminate access to the platform where necessary for moderation, security, legal compliance, or breach of these Terms.",
  },
  {
    title: "11. Changes to Terms",
    body: "We may update these Terms from time to time. Continued use of LexCircle after updated Terms take effect constitutes acceptance of the revised version.",
  },
] as const;

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Terms"
        title="Terms of Use for LexCircle"
        description="These Terms govern access to LexCircle, user accounts, publishing activity, moderation, and community conduct."
      />

      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted sm:p-8">
        <p>
          LexCircle is operated as a legal writing and publishing community.
          These Terms apply to all users, contributors, and visitors who access
          the platform.
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
