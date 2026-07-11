export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
      <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : null}
    </div>
  );
}
