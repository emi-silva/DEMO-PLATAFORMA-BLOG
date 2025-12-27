export function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
      {label}
    </span>
  );
}
