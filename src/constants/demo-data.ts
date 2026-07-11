export type DemoAuthor = {
  id: string;
  name: string;
  username: string;
  bio: string;
  image?: string | null;
  followers: number;
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
  featured?: boolean;
};

export const demoCategories: DemoCategory[] = [
  { id: "c1", name: "Constitutional Law", slug: "constitutional-law" },
  { id: "c2", name: "Criminal Law", slug: "criminal-law" },
  { id: "c3", name: "Civil Law", slug: "civil-law" },
  { id: "c4", name: "Corporate Law", slug: "corporate-law" },
];

export const demoTags: DemoTag[] = [
  { id: "t1", name: "Case Analysis", slug: "case-analysis" },
  { id: "t2", name: "Legal Research", slug: "legal-research" },
  { id: "t3", name: "Statutory Interpretation", slug: "statutory-interpretation" },
  { id: "t4", name: "Constitutional Remedies", slug: "constitutional-remedies" },
  { id: "t5", name: "Moot Court", slug: "moot-court" },
];

export const demoAuthors: DemoAuthor[] = [
  {
    id: "u1",
    name: "Maya Raman",
    username: "mayaraman",
    bio: "Writes on constitutional adjudication, public law theory, and legal method.",
    followers: 1840,
  },
  {
    id: "u2",
    name: "Jordan Lee",
    username: "jordanship",
    bio: "Focuses on criminal procedure, evidence, and student-facing case commentary.",
    followers: 1260,
  },
  {
    id: "u3",
    name: "Sana Patel",
    username: "sanapatel",
    bio: "Researches comparative constitutional law and rights-based judicial review.",
    followers: 980,
  },
  {
    id: "u4",
    name: "Noah Carter",
    username: "noahwrites",
    bio: "Explains corporate governance, securities regulation, and commercial disputes.",
    followers: 760,
  },
];

export const demoArticles: DemoArticle[] = [
  {
    id: "a1",
    slug: "basic-structure-of-a-constitutional-case-note",
    title: "How to structure a constitutional case note for clarity and authority",
    subtitle: "A practical approach to facts, issues, holdings, and constitutional impact.",
    excerpt:
      "Strong constitutional case notes do more than summarize judgments. They isolate questions, reasoning, and institutional consequences with precision.",
    content: `
      <h1>Building a constitutional case note</h1>
      <p>A good case note must identify the material facts, the procedural posture, the constitutional issues, and the final holding without losing analytical discipline.</p>
      <h2>Start with the legal question</h2>
      <p>Readers should understand the precise constitutional conflict before you move into reasoning, precedent, and implications.</p>
      <blockquote>The value of a case note lies in disciplined explanation, not exhaustive repetition of the judgment.</blockquote>
      <p>That means separating ratio from observation and linking the court's logic to doctrine, rights, and institutional practice.</p>
    `,
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-07-08T10:30:00.000Z",
    updatedAt: "2026-07-10T09:15:00.000Z",
    readingTime: 9,
    wordCount: 1850,
    viewCount: 18420,
    likeCount: 932,
    commentCount: 41,
    bookmarkCount: 634,
    category: demoCategories[0],
    tags: [demoTags[0], demoTags[1], demoTags[2]],
    author: demoAuthors[0],
    featured: true,
  },
  {
    id: "a2",
    slug: "writing-better-criminal-law-issue-based-blogs",
    title: "Writing sharper criminal law blogs for issue-based legal commentary",
    subtitle: "How to frame recent judgments, statutes, and bail jurisprudence clearly.",
    excerpt:
      "The strongest criminal law blogs narrow the issue quickly, explain the legal rule accurately, and show why the development matters beyond the immediate facts.",
    content: `
      <h1>Issue-based criminal law blogging</h1>
      <p>Criminal law commentary works best when it identifies the disputed rule, the factual trigger, and the doctrinal stakes in the first few paragraphs.</p>
      <h2>Anchor the piece in the legal controversy</h2>
      <p>Frame the issue around bail, evidence, sentencing, or procedure so the reader can evaluate the legal significance immediately.</p>
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
    category: demoCategories[2],
    tags: [demoTags[0], demoTags[4]],
    author: demoAuthors[1],
  },
  {
    id: "a3",
    slug: "turning-a-legal-research-problem-into-a-research-paper-outline",
    title: "Turning a legal research problem into a strong research paper outline",
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
    publishedAt: "2026-07-05T16:00:00.000Z",
    updatedAt: "2026-07-09T10:00:00.000Z",
    readingTime: 6,
    wordCount: 1220,
    viewCount: 16480,
    likeCount: 711,
    commentCount: 37,
    bookmarkCount: 488,
    category: demoCategories[1],
    tags: [demoTags[3], demoTags[2]],
    author: demoAuthors[2],
    featured: true,
  },
  {
    id: "a4",
    slug: "civil-law-writing-for-contract-and-tort-disputes",
    title: "Civil law writing for contract and tort disputes",
    subtitle: "Organizing facts, duties, breaches, causation, and remedies for student readers.",
    excerpt:
      "Civil law writing becomes more persuasive when the structure mirrors how courts separate facts, duties, liability, and relief.",
    content: `
      <h1>Writing on civil disputes</h1>
      <p>Contract and tort analysis should move in sequence from facts to legal elements to remedies so that readers can test each conclusion cleanly.</p>
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
    category: demoCategories[3],
    tags: [demoTags[4], demoTags[1]],
    author: demoAuthors[3],
  },
];
