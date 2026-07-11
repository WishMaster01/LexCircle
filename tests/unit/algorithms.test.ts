import { describe, expect, it } from "vitest";
import { buildCommentTree } from "@/lib/algorithms/comment-tree";
import { debounce } from "@/lib/algorithms/debounce";
import { jaccardSimilarity } from "@/lib/algorithms/graph";
import { estimateReadingTime } from "@/lib/algorithms/reading-time";
import { relatedArticleScore, trendingScore } from "@/lib/algorithms/ranking";
import { canTransitionArticle } from "@/lib/algorithms/state-transitions";
import { resolveSlugCollision, slugify } from "@/lib/algorithms/slug";
import { demoArticles } from "@/constants/demo-data";
import { canEditArticle, canManageUsers } from "@/lib/permissions";
import { ArticleStatus, ArticleVisibility, UserRole } from "@prisma/client";

describe("reading time", () => {
  it("counts words and estimates reading time", () => {
    const result = estimateReadingTime("one two three four five");
    expect(result.wordCount).toBe(5);
    expect(result.readingTime).toBe(1);
  });
});

describe("slug utilities", () => {
  it("creates a clean slug", () => {
    expect(slugify("Hello, Next.js World!")).toBe("hello-nextjs-world");
  });

  it("resolves collisions", () => {
    expect(resolveSlugCollision("post", new Set(["post", "post-2"]))).toBe("post-3");
  });
});

describe("ranking", () => {
  it("calculates deterministic trending scores", () => {
    expect(trendingScore(demoArticles[0])).toBeGreaterThan(trendingScore(demoArticles[3]));
  });

  it("scores related articles based on overlap", () => {
    expect(relatedArticleScore(demoArticles[0], demoArticles[1])).toBeGreaterThan(0);
  });
});

describe("comment tree", () => {
  it("builds a nested tree", () => {
    const tree = buildCommentTree([
      { id: "1", content: "root" },
      { id: "2", content: "reply", parentId: "1" },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies).toHaveLength(1);
  });
});

describe("permissions", () => {
  it("allows owners to edit their own article", () => {
    expect(
      canEditArticle(
        { id: "u1", role: UserRole.USER },
        { authorId: "u1", status: ArticleStatus.DRAFT, visibility: ArticleVisibility.PUBLIC },
      ),
    ).toBe(true);
  });

  it("restricts user management to admins", () => {
    expect(canManageUsers({ id: "u1", role: UserRole.ADMIN })).toBe(true);
    expect(canManageUsers({ id: "u1", role: UserRole.USER })).toBe(false);
  });
});

describe("state transitions", () => {
  it("permits valid transitions", () => {
    expect(canTransitionArticle(ArticleStatus.DRAFT, ArticleStatus.PUBLISHED)).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(canTransitionArticle(ArticleStatus.PUBLISHED, ArticleStatus.SCHEDULED)).toBe(false);
  });
});

describe("graph helpers", () => {
  it("calculates jaccard similarity", () => {
    expect(jaccardSimilarity(new Set(["a", "b"]), new Set(["b", "c"]))).toBeCloseTo(1 / 3);
  });
});

describe("debounce", () => {
  it("returns a function", () => {
    const fn = debounce(() => undefined, 50);
    expect(typeof fn).toBe("function");
  });
});
