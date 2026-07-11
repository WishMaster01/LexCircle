import { SectionHeading } from "@/components/layout/section-heading";

const sections = [
  {
    title: "1. Information We Collect",
    body: "LexCircle may collect account details such as your name, username, email address, profile image, bio, and login-related session data. We also collect content you create on the platform, including drafts, submitted articles, comments, bookmarks, likes, and contact form messages.",
  },
  {
    title: "2. How We Use Information",
    body: "We use your information to operate LexCircle, provide account access, display your public author profile, support publishing workflows, process article approvals, respond to support requests, and improve the platform experience for the community.",
  },
  {
    title: "3. Public and Private Content",
    body: "Drafts, unpublished work, and approval-stage submissions are treated as non-public content inside the platform workflow. Published articles, public author profile details, comments, and other community-facing actions may be visible to other users and visitors.",
  },
  {
    title: "4. Email and Contact Data",
    body: "If you use the contact form, LexCircle may store your name, email address, topic, organization details, and message content so that support and administrative teams can review and respond to your request.",
  },
  {
    title: "5. Analytics and Activity Data",
    body: "LexCircle may store operational and engagement data such as article views, likes, bookmarks, comments, and moderation actions. This information is used for platform analytics, admin review, and improving discovery and content workflows.",
  },
  {
    title: "6. Sharing of Information",
    body: "LexCircle does not sell personal data. Information may be shared with service providers strictly to operate the platform, such as hosting, authentication, email delivery, or database infrastructure, subject to their own processing roles.",
  },
  {
    title: "7. Data Retention",
    body: "We retain account, article, and operational data for as long as needed to provide the service, maintain platform integrity, support moderation, comply with legal obligations, or resolve disputes. Drafts and unpublished submissions may remain stored unless deleted through platform or administrative action.",
  },
  {
    title: "8. Security",
    body: "LexCircle uses reasonable technical and organizational safeguards to protect account and platform data. However, no online system can guarantee absolute security, and users should avoid submitting highly sensitive personal or confidential legal information unless necessary.",
  },
  {
    title: "9. User Rights and Requests",
    body: "If you need assistance regarding your account data, contact details, or a privacy-related concern, you can reach LexCircle through the contact page. Administrative handling of requests may depend on platform obligations, security review, and applicable law.",
  },
  {
    title: "10. Changes to This Policy",
    body: "LexCircle may update this Privacy Policy from time to time. Continued use of the platform after changes take effect means you accept the revised policy.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Privacy Policy"
        title="Privacy Policy for LexCircle"
        description="This Privacy Policy explains how LexCircle collects, uses, stores, and protects information across the platform."
      />

      <div className="rounded-4xl border border-border/80 bg-card/80 p-6 text-sm leading-7 text-muted sm:p-8">
        <p>
          LexCircle is a law student community platform for legal writing,
          research publishing, discussion, and related platform services. By
          using LexCircle, you acknowledge the data practices described below.
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
