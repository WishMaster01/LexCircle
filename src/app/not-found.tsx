import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-4xl border border-border/80 bg-card/80 p-8">
      <h1 className="text-4xl font-semibold tracking-[-0.04em]">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted">
        The requested article or dashboard resource could not be found.
      </p>
      <Link
        href="/"
        className="mt-5 inline-block text-sm font-medium text-accent"
      >
        Return home
      </Link>
    </div>
  );
}
