import Link from "next/link";
import { legalCategories } from "@/constants/legal-writing";
import { SectionHeading } from "@/components/layout/section-heading";

export default function SubjectsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Subjects"
        title="Browse LexCircle by legal subject"
        description="Subjects are the main reading structure for the platform. Each subject page keeps every document type together under one field of law."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {legalCategories.map((category) => (
          <Link
            key={category.value}
            href={`/subjects/${category.value}`}
            className="rounded-[1.75rem] border border-border/80 bg-card/80 p-5 hover:-translate-y-0.5"
          >
            <p className="text-lg font-semibold tracking-[-0.03em]">
              {category.label}
            </p>
            <p className="mt-2 text-sm text-muted">
              Read blogs, articles, case analysis, research papers, notes, and
              legal news in {category.label}.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
