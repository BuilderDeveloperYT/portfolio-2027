import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useImageUrl } from '../../hooks/useImageUrl';
import * as db from '../../services/indexedDB';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/format';
import type { Project } from '../../types/project';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-panel p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-base-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-base-text">{value}</p>
    </div>
  );
}

function AdminRow({
  project,
  onChanged,
  onDelete,
}: {
  project: Project;
  onChanged: () => void;
  onDelete: (id: string) => void;
}) {
  const coverUrl = useImageUrl(project.coverImageId);

  const togglePublish = async () => {
    await db.updateProject(project.id, { published: !project.published });
    onChanged();
  };

  return (
    <tr className="border-b border-base-border last:border-0">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-base-border bg-base-panel2">
            {coverUrl && <img src={coverUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <div>
            <p className="text-sm font-medium text-base-text">{project.title}</p>
            <p className="text-xs text-base-muted">/{project.slug}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4">
        <StatusBadge status={project.status} />
      </td>
      <td className="py-3 pr-4">
        <button
          type="button"
          onClick={togglePublish}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            project.published ? 'bg-neon/15 text-neon' : 'bg-base-panel2 text-base-muted'
          }`}
        >
          {project.published ? 'Pubblicato' : 'Nascosto'}
        </button>
      </td>
      <td className="py-3 pr-4 text-xs text-base-muted">{formatDate(project.updatedAt)}</td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <Link to={`/progetti/${project.slug}`} target="_blank" className="btn-secondary !px-3 !py-1.5 text-xs">
            Anteprima
          </Link>
          <Link to={`/admin/projects/${project.id}/edit`} className="btn-secondary !px-3 !py-1.5 text-xs">
            Modifica
          </Link>
          <button type="button" onClick={() => onDelete(project.id)} className="btn-danger !px-3 !py-1.5 text-xs">
            Elimina
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { projects, loading, refresh } = useProjects(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const total = projects.length;
  const published = projects.filter((p) => p.published).length;
  const hidden = total - published;
  const last = [...projects].sort((a, b) => b.createdAt - a.createdAt)[0];

  const handleDelete = async () => {
    if (!confirmId) return;
    await db.deleteProject(confirmId);
    setConfirmId(null);
    refresh();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-base-text">Dashboard</h1>
        <Link to="/admin/projects/new" className="btn-primary">
          + Nuovo progetto
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Progetti totali" value={total} />
        <StatCard label="Pubblicati" value={published} />
        <StatCard label="Nascosti" value={hidden} />
        <StatCard label="Ultimo aggiunto" value={last ? last.title : '—'} />
      </div>

      <div className="card-panel overflow-x-auto p-5">
        {loading ? (
          <p className="py-10 text-center text-sm text-base-muted">Caricamento…</p>
        ) : projects.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-base-text">Nessun progetto ancora.</p>
            <Link to="/admin/projects/new" className="btn-primary mt-5 inline-flex">
              Crea il primo progetto
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-base-border text-xs uppercase tracking-wide text-base-muted">
                <th className="pb-3 pr-4 font-medium">Progetto</th>
                <th className="pb-3 pr-4 font-medium">Stato</th>
                <th className="pb-3 pr-4 font-medium">Visibilità</th>
                <th className="pb-3 pr-4 font-medium">Aggiornato</th>
                <th className="pb-3 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <AdminRow key={project.id} project={project} onChanged={refresh} onDelete={setConfirmId} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5" role="dialog" aria-modal="true">
          <div className="card-panel w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-base-text">Elimina progetto</h2>
            <p className="mt-2 text-sm text-base-muted">
              Sei sicuro di voler eliminare questo progetto? Questa operazione non può essere annullata.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmId(null)} className="btn-secondary text-sm">
                Annulla
              </button>
              <button type="button" onClick={handleDelete} className="btn-danger text-sm">
                Elimina definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
