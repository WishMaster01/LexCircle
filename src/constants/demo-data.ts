import { legalCategories } from "@/constants/legal-writing";

export type DemoAuthor = {
  id: string;
  name: string;
  username: string;
  bio: string;
  image?: string | null;
  followers: number;
  joinedAt: string;
};

export type DemoCategory = {
  id: string;
  name: string;
  slug: string;
};

export type DemoTag = {
  id: string;
  name: string;
  slug: string;
};

export type DemoArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  wordCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  category: DemoCategory;
  tags: DemoTag[];
  author: DemoAuthor;
  documentType: string;
  featured?: boolean;
};

export const demoCategories: DemoCategory[] = legalCategories.map(
  (category, index) => ({
    id: `c${index + 1}`,
    name: category.label,
    slug: category.value,
  }),
);

export const demoTags: DemoTag[] = [
  { id: "t1", name: "Case Analysis", slug: "case-analysis" },
  { id: "t2", name: "Legal Research", slug: "legal-research" },
  { id: "t3", name: "Statutory Interpretation", slug: "statutory-interpretation" },
  { id: "t4", name: "Judicial Review", slug: "judicial-review" },
  { id: "t5", name: "Moot Court", slug: "moot-court" },
  { id: "t6", name: "Constitutional Litigation", slug: "constitutional-litigation" },
  { id: "t7", name: "Bail Jurisprudence", slug: "bail-jurisprudence" },
  { id: "t8", name: "Company Law", slug: "company-law" },
  { id: "t9", name: "Environmental Governance", slug: "environmental-governance" },
  { id: "t10", name: "International Arbitration", slug: "international-arbitration" },
];

export const demoAuthors: DemoAuthor[] = [
  {
    id: "u1",
    name: "Maya Raman",
    username: "mayaraman",
    bio: "Writes on constitutional adjudication, public law theory, and structured case analysis.",
    followers: 1840,
    joinedAt: "2025-08-14T00:00:00.000Z",
  },
  {
    id: "u2",
    name: "Rahul Kumar",
    username: "rahulkumar",
    bio: "Focuses on criminal procedure, evidence, and issue-based legal writing for students.",
    followers: 1260,
    joinedAt: "2025-10-02T00:00:00.000Z",
  },
  {
    id: "u3",
    name: "Sana Patel",
    username: "sanapatel",
    bio: "Researches comparative constitutional law, judicial review, and rights-based scholarship.",
    followers: 980,
    joinedAt: "2026-01-19T00:00:00.000Z",
  },
  {
    id: "u4",
    name: "Noah Carter",
    username: "noahwrites",
    bio: "Explains company law, commercial disputes, and corporate governance in clear student language.",
    followers: 760,
    joinedAt: "2026-02-11T00:00:00.000Z",
  },
];

export const demoArticles: DemoArticle[] = [
  {
    id: "a1",
    slug: "kesavananda-bharati-and-the-basic-structure-doctrine",
    title: "Kesavananda Bharati and the Basic Structure Doctrine",
    subtitle: "A student-friendly breakdown of the judgment, the doctrine, and its constitutional legacy.",
    excerpt:
      "This case analysis explains the constitutional stakes of Kesavananda Bharati and why the Basic Structure Doctrine remains central to Indian public law.",
    content: `
      <h1>Understanding the Basic Structure Doctrine</h1>
      <p>The value of <em>Kesavananda Bharati</em> lies not only in the outcome but in the constitutional method the Court adopted while addressing the amending power.</p>
      <h2>Why the case still matters</h2>
      <p>Law students return to this judgment because it shapes debates on separation of powers, constitutional identity, and limits on parliamentary supremacy.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-05T10:30:00.000Z",
    updatedAt: "2026-07-10T09:15:00.000Z",
    readingTime: 8,
    wordCount: 1850,
    viewCount: 18420,
    likeCount: 932,
    commentCount: 41,
    bookmarkCount: 634,
    category: demoCategories[0],
    tags: [demoTags[0], demoTags[5], demoTags[3]],
    author: demoAuthors[0],
    documentType: "case-analysis",
    featured: true,
  },
  {
    id: "a2",
    slug: "writing-sharper-criminal-law-blogs-for-current-issues",
    title: "Writing sharper criminal law blogs for current issues",
    subtitle: "How to narrow the issue, state the rule, and explain why the development matters.",
    excerpt:
      "Strong criminal law blogs identify the precise legal dispute quickly and then connect doctrine to public significance without losing accuracy.",
    content: `
      <h1>Issue-based criminal law blogging</h1>
      <p>Criminal law commentary works best when it identifies the disputed rule, the factual trigger, and the doctrinal stakes in the first few paragraphs.</p>
      <p>Then move from facts to principle to criticism in a tight and readable sequence.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-06T08:10:00.000Z",
    updatedAt: "2026-07-09T14:15:00.000Z",
    readingTime: 7,
    wordCount: 1430,
    viewCount: 13200,
    likeCount: 654,
    commentCount: 24,
    bookmarkCount: 511,
    category: demoCategories[1],
    tags: [demoTags[6], demoTags[0], demoTags[4]],
    author: demoAuthors[1],
    documentType: "blog",
  },
  {
    id: "a3",
    slug: "turning-a-legal-research-question-into-a-research-paper",
    title: "Turning a legal research question into a research paper",
    subtitle: "Research questions, authorities, competing views, and a defensible thesis.",
    excerpt:
      "Legal research papers become stronger when the question, methodology, and scope are fixed before the first long draft is written.",
    content: `
      <h1>Planning a legal research paper</h1>
      <p>A persuasive paper starts with a precise research question, a defined jurisdictional scope, and a clear account of the authorities under review.</p>
      <h2>Outline before drafting</h2>
      <p>Use headings for the question, literature, doctrinal background, analysis, counterarguments, and conclusion before writing full prose.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-04T16:00:00.000Z",
    updatedAt: "2026-07-09T10:00:00.000Z",
    readingTime: 10,
    wordCount: 2220,
    viewCount: 16480,
    likeCount: 711,
    commentCount: 37,
    bookmarkCount: 488,
    category: demoCategories[8],
    tags: [demoTags[1], demoTags[2], demoTags[3]],
    author: demoAuthors[2],
    documentType: "research-paper",
    featured: true,
  },
  {
    id: "a4",
    slug: "contract-law-notes-on-offer-acceptance-and-consideration",
    title: "Contract law notes on offer, acceptance, and consideration",
    subtitle: "A concise revision set for first-pass understanding and exam prep.",
    excerpt:
      "These notes organize the core formation principles of contract law into a quick structure for class use, revision, and problem-solving.",
    content: `
      <h1>Contract formation notes</h1>
      <p>Break the doctrine into offer, acceptance, intention, consideration, and capacity so each element can be tested separately.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-03T12:00:00.000Z",
    updatedAt: "2026-07-04T12:00:00.000Z",
    readingTime: 5,
    wordCount: 980,
    viewCount: 8200,
    likeCount: 401,
    commentCount: 18,
    bookmarkCount: 240,
    category: demoCategories[2],
    tags: [demoTags[2], demoTags[4]],
    author: demoAuthors[3],
    documentType: "notes",
  },
  {
    id: "a5",
    slug: "company-commercial-law-article-on-shareholder-remedies",
    title: "Shareholder remedies and minority protection in company disputes",
    subtitle: "A practical article on oppression, mismanagement, and strategic pleading.",
    excerpt:
      "This article outlines how minority protection arguments are structured in company disputes and why procedural framing affects commercial outcomes.",
    content: `
      <h1>Minority protection in company law</h1>
      <p>Company and commercial law writing becomes clearer when the article moves from statutory framework to factual pattern to available remedies.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-07T11:20:00.000Z",
    updatedAt: "2026-07-10T08:00:00.000Z",
    readingTime: 9,
    wordCount: 1760,
    viewCount: 10340,
    likeCount: 522,
    commentCount: 16,
    bookmarkCount: 298,
    category: demoCategories[5],
    tags: [demoTags[7], demoTags[1]],
    author: demoAuthors[3],
    documentType: "article",
    featured: true,
  },
  {
    id: "a6",
    slug: "legal-news-supreme-court-environmental-compliance-update",
    title: "Supreme Court issues fresh environmental compliance directions",
    subtitle: "A short legal news brief on regulatory accountability and enforcement.",
    excerpt:
      "This legal news update tracks the latest compliance directions, the enforcement reasoning, and why the order matters for public regulation.",
    content: `
      <h1>Environmental compliance update</h1>
      <p>Short legal news pieces should identify the issuing court or authority, the order made, and the immediate regulatory consequence.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-08T07:45:00.000Z",
    updatedAt: "2026-07-08T07:45:00.000Z",
    readingTime: 4,
    wordCount: 760,
    viewCount: 9430,
    likeCount: 288,
    commentCount: 11,
    bookmarkCount: 190,
    category: demoCategories[9],
    tags: [demoTags[8], demoTags[3]],
    author: demoAuthors[0],
    documentType: "legal-news",
  },
];
