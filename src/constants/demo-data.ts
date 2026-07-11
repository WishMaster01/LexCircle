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
  { id: "c1", name: "Engineering", slug: "engineering" },
  { id: "c2", name: "Product", slug: "product" },
  { id: "c3", name: "Design Systems", slug: "design-systems" },
  { id: "c4", name: "Startups", slug: "startups" },
];

export const demoTags: DemoTag[] = [
  { id: "t1", name: "Next.js", slug: "nextjs" },
  { id: "t2", name: "Prisma", slug: "prisma" },
  { id: "t3", name: "PostgreSQL", slug: "postgresql" },
  { id: "t4", name: "Analytics", slug: "analytics" },
  { id: "t5", name: "DX", slug: "dx" },
];

export const demoAuthors: DemoAuthor[] = [
  {
    id: "u1",
    name: "Maya Raman",
    username: "mayaraman",
    bio: "Writes about resilient product engineering and clean editorial systems.",
    followers: 1840,
  },
  {
    id: "u2",
    name: "Jordan Lee",
    username: "jordanship",
    bio: "Designing creator workflows that keep complexity off the page.",
    followers: 1260,
  },
  {
    id: "u3",
    name: "Sana Patel",
    username: "sanapatel",
    bio: "Platform analytics, search relevance, and moderation tooling.",
    followers: 980,
  },
  {
    id: "u4",
    name: "Noah Carter",
    username: "noahwrites",
    bio: "Community operations and editorial growth loops.",
    followers: 760,
  },
];

export const demoArticles: DemoArticle[] = [
  {
    id: "a1",
    slug: "designing-an-article-platform-that-scales",
    title: "Designing an article platform that scales without collapsing into clutter",
    subtitle: "A practical system for discovery, moderation, and revision history.",
    excerpt:
      "The highest-cost mistake in community publishing is treating articles like flat records instead of evolving editorial assets.",
    content: `
      <h1>Designing an article platform that scales</h1>
      <p>Community publishing becomes fragile when core state transitions are informal. Drafts leak, rankings become opaque, and moderation tooling is bolted on too late.</p>
      <h2>What the system needs early</h2>
      <p>Model lifecycle states explicitly, preserve revision history, and keep search relevance explainable. Those constraints drive the entire shape of the product.</p>
      <blockquote>Good editorial infrastructure reduces coordination cost for every writer and moderator on the platform.</blockquote>
      <p>That means stable permissions, deterministic ranking, and workflows that assume articles will be revised many times.</p>
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
    slug: "editor-workflows-that-protect-drafts",
    title: "Editor workflows that protect drafts without slowing authors down",
    subtitle: "Autosave, revisions, checkpoints, and publish confirmations.",
    excerpt:
      "Autosave should prevent loss, not produce noisy history. The trick is separating transient edits from meaningful revision checkpoints.",
    content: `
      <h1>Draft safety without revision spam</h1>
      <p>An editor is only trustworthy when writers understand what is durable, what is pending, and what can be restored.</p>
      <h2>Autosave rules</h2>
      <p>Debounce requests, create revisions only at checkpoints, and show explicit save state in the interface.</p>
      <p>That preserves fidelity without turning the history timeline into noise.</p>
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
    slug: "explainable-trending-ranking-for-community-feeds",
    title: "Explainable trending ranking for community feeds",
    subtitle: "Weighted engagement, recency decay, and bounded top-K selection.",
    excerpt:
      "Trending should surface momentum, not fossilized popularity. Time decay and explainable weights make the feed auditable.",
    content: `
      <h1>Explainable trending ranking</h1>
      <p>Ranking systems fail when their incentives are invisible. A simple weighted model with recency decay is often enough for a strong first version.</p>
      <h2>Why bounded heaps help</h2>
      <p>When ranking candidate sets in application code, a bounded priority queue keeps selection efficient and predictable.</p>
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
    slug: "moderation-workflows-for-growing-writing-communities",
    title: "Moderation workflows for growing writing communities",
    subtitle: "Reports, triage queues, restoration, and auditability.",
    excerpt:
      "Moderation tools need state, history, and clear authorization rules long before the volume feels painful.",
    content: `
      <h1>Moderation as product infrastructure</h1>
      <p>Report workflows should be reviewable, reversible, and explicit about who acted and why.</p>
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
