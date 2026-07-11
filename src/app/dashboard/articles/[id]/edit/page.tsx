import { SectionHeading } from "@/components/layout/section-heading";
import { ArticleEditorForm } from "@/components/editor/article-editor-form";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Edit article" title={`Editing draft ${id}`} />
      <ArticleEditorForm />
    </div>
  );
}
