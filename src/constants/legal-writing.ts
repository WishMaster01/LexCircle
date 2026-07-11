export const legalWritingFormats = [
  {
    value: "blog",
    label: "Blog",
    description: "Short legal commentary for developments, arguments, and explainers.",
  },
  {
    value: "article",
    label: "Article",
    description: "Structured legal analysis for doctrine, policy, and issue-based writing.",
  },
  {
    value: "case-analysis",
    label: "Case Analysis",
    description: "Focused writing on facts, issues, holdings, reasoning, and implications.",
  },
  {
    value: "research-paper",
    label: "Research Paper",
    description: "Long-form academic legal writing with deeper analysis and sources.",
  },
  {
    value: "notes",
    label: "Notes",
    description: "Revision notes, class notes, and concise legal concept summaries.",
  },
  {
    value: "legal-news",
    label: "Legal News",
    description: "Timely legal updates, court developments, and regulatory news roundups.",
  },
] as const;

export const legalCategories = [
  { value: "constitutional-law", label: "Constitutional Law" },
  { value: "criminal-law", label: "Criminal Law" },
  { value: "contract-law", label: "Contract Law" },
  { value: "family-law", label: "Family Law" },
  { value: "property-law", label: "Property Law" },
  { value: "company-commercial-law", label: "Company & Commercial Law" },
  { value: "civil-procedure", label: "Civil Procedure" },
  { value: "administrative-law", label: "Administrative Law" },
  { value: "intellectual-property-law", label: "Intellectual Property Law" },
  { value: "environmental-law", label: "Environmental Law" },
  { value: "international-law", label: "International Law" },
  { value: "miscellaneous", label: "Miscellaneous" },
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
  "Moot Court",
  "Judicial Review",
] as const;

const documentTypeLabelMap = new Map<string, string>(
  legalWritingFormats.map((format) => [format.value, format.label]),
);

const documentTypeSlugSet = new Set<string>(
  legalWritingFormats.map((format) => format.value),
);
const documentTypeNameSet = new Set<string>(
  legalWritingFormats.map((format) => format.label.toLowerCase()),
);

export function getLegalFormatCopy(kind?: string) {
  switch (normalizeDocumentType(kind)) {
    case "blog":
      return {
        title: "Draft a legal blog",
        description: "Write a concise legal perspective piece, commentary, or explainer.",
      };
    case "case-analysis":
      return {
        title: "Draft a case analysis",
        description: "Break down the facts, issues, judgment, reasoning, and practical significance of a case.",
      };
    case "research-paper":
      return {
        title: "Draft a research paper",
        description: "Build a longer-form legal research submission with structured sections and metadata.",
      };
    case "notes":
      return {
        title: "Draft legal notes",
        description: "Create concise legal notes for classes, exams, or quick doctrinal revision.",
      };
    case "legal-news":
      return {
        title: "Draft legal news",
        description: "Publish a timely legal update on courts, statutes, regulation, or current developments.",
      };
    default:
      return {
        title: "Draft a legal article",
        description: "Write a doctrinal, analytical, or issue-based legal article for review and publication.",
      };
  }
}

export function normalizeDocumentType(value?: string | null) {
  if (!value) return "article";
  const normalized = value.trim().toLowerCase();
  if (documentTypeSlugSet.has(normalized)) {
    return normalized;
  }

  for (const format of legalWritingFormats) {
    if (format.label.toLowerCase() === normalized) {
      return format.value;
    }
  }

  return "article";
}

export function getDocumentTypeLabel(value?: string | null) {
  return documentTypeLabelMap.get(normalizeDocumentType(value)) ?? "Article";
}

export function getDocumentTypeTagSlug(value?: string | null) {
  return normalizeDocumentType(value);
}

export function isDocumentTypeTag(tag: { name?: string | null; slug?: string | null }) {
  return Boolean(
    (tag.slug && documentTypeSlugSet.has(tag.slug.toLowerCase())) ||
      (tag.name && documentTypeNameSet.has(tag.name.toLowerCase())),
  );
}

export function inferDocumentType(article: {
  documentType?: string | null;
  title?: string | null;
  subtitle?: string | null;
  tags?: Array<
    { id?: string; name?: string; slug?: string } | { tag: { id?: string; name?: string; slug?: string } }
  >;
}) {
  if (article.documentType) {
    return normalizeDocumentType(article.documentType);
  }

  if (article.tags?.length) {
    for (const entry of article.tags) {
      const tag = "tag" in entry ? entry.tag : entry;
      if (isDocumentTypeTag(tag)) {
        return normalizeDocumentType(tag.slug ?? tag.name ?? undefined);
      }
    }
  }

  const haystack = `${article.title ?? ""} ${article.subtitle ?? ""}`.toLowerCase();
  if (haystack.includes("case analysis") || haystack.includes("case note")) {
    return "case-analysis";
  }
  if (haystack.includes("research paper")) {
    return "research-paper";
  }
  if (haystack.includes("notes")) {
    return "notes";
  }
  if (haystack.includes("legal news") || haystack.includes("news")) {
    return "legal-news";
  }
  if (haystack.includes("blog")) {
    return "blog";
  }

  return "article";
}

export function getCategoryLabel(slug?: string | null) {
  return (
    legalCategories.find((category) => category.value === slug)?.label ??
    "Miscellaneous"
  );
}
