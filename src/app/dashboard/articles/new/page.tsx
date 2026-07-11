import { SectionHeading } from "@/components/layout/section-heading";
import { getLegalFormatCopy } from "@/constants/legal-writing";
import { ArticleEditorForm } from "@/components/editor/article-editor-form";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const kind = typeof params.kind === "string" ? params.kind : undefined;
  const copy = getLegalFormatCopy(kind);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="New draft"
        title={copy.title}
        description={`${copy.description} Every submission enters admin review before it appears in your approved writing workspace.`}
      />
      <ArticleEditorForm initialKind={kind} />
    </div>
  );
}
