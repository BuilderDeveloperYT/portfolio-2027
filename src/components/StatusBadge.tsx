import { PROJECT_STATUS_LABELS, type ProjectStatus } from '../types/project';

const dotColor: Record<ProjectStatus, string> = {
  'in-sviluppo': 'bg-neon',
  completato: 'bg-sky-400',
  'in-manutenzione': 'bg-amber-400',
  archiviato: 'bg-base-muted',
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-base-border bg-base-panel2 px-2.5 py-1 text-xs font-medium text-base-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[status]}`} />
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
