export const legalWritingFormats = [
  {
    value: "article",
    label: "Article",
    description: "Structured legal analysis for doctrine, policy, or current developments.",
  },
  {
    value: "blog",
    label: "Blog",
    description: "Shorter commentary for recent judgments, arguments, or legal updates.",
  },
  {
    value: "case-note",
    label: "Case Note",
    description: "Focused commentary on a judgment, ratio, dissent, and implications.",
  },
  {
    value: "research-paper",
    label: "Research Paper",
    description: "Long-form academic writing with deeper statutory and doctrinal analysis.",
  },
] as const;

export const legalCategories = [
  { value: "civil-law", label: "Civil Law" },
  { value: "criminal-law", label: "Criminal Law" },
  { value: "constitutional-law", label: "Constitutional Law" },
  { value: "corporate-law", label: "Corporate Law" },
  { value: "family-law", label: "Family Law" },
  { value: "human-rights-law", label: "Human Rights Law" },
  { value: "administrative-law", label: "Administrative Law" },
  { value: "intellectual-property-law", label: "Intellectual Property Law" },
  { value: "international-law", label: "International Law" },
  { value: "environmental-law", label: "Environmental Law" },
] as const;

export const suggestedLegalTags = [
  "Case Analysis",
  "Precedent",
  "Legal Research",
  "Writ Petition",
  "Due Process",
  "Bail Jurisprudence",
  "Statutory Interpretation",
  "Contract Law",
  "Tort Law",
  "Moot Court",
] as const;

export function getLegalFormatCopy(kind?: string) {
  switch (kind) {
    case "blog":
      return {
        title: "Draft a legal blog",
        description: "Write a concise legal perspective piece, update, or commentary for your audience.",
      };
    case "case-note":
      return {
        title: "Draft a case note",
        description: "Break down the facts, issues, holding, reasoning, and practical significance of a judgment.",
      };
    case "research-paper":
      return {
        title: "Draft a research paper",
        description: "Build a longer-form legal research submission with structured sections and SEO-ready metadata.",
      };
    default:
      return {
        title: "Draft a legal article",
        description: "Write a doctrinal, analytical, or issue-based legal article for review and publication.",
      };
  }
}
