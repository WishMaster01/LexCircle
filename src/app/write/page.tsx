import { ArticleEditorForm } from "@/components/editor/article-editor-form";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireUserPageSession } from "@/lib/auth-guards";
import { getLegalFormatCopy } from "@/constants/legal-writing";

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUserPageSession();
  const params = await searchParams;
  const kind = typeof params.kind === "string" ? params.kind : undefined;
  const copy = getLegalFormatCopy(kind);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Write"
        title={copy.title}
        description={`${copy.description} Published posts still follow the existing admin approval workflow before they go live.`}
      />
      <ArticleEditorForm initialKind={kind} />
    </div>
  );
}
