export default function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-base-border bg-base-panel2 px-2.5 py-1 font-mono text-xs text-base-muted transition-colors">
      {label}
    </span>
  );
}
