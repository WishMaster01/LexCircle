export default function Loading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-[1.75rem] border border-border/80 bg-card/60"
        />
      ))}
    </div>
  );
}
