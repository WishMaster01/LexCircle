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
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent sm:text-xs sm:tracking-[0.3em]">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
