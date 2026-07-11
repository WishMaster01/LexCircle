import { SectionHeading } from "@/components/layout/section-heading";
import { ArticleEditorForm } from "@/components/editor/article-editor-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="New article"
        title="Write in a draft-safe editor with autosave and preview"
        description="This editor keeps local autosave active immediately and posts draft saves to the article API."
      />
      <ArticleEditorForm />
    </div>
  );
}
