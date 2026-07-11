"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/80 p-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">Something failed</h1>
      <p className="mt-3 text-sm text-muted">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-5 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
