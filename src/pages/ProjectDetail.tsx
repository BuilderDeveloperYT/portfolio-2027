import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as db from '../services/indexedDB';
import type { Project } from '../types/project';
import { useImageUrl } from '../hooks/useImageUrl';
import StatusBadge from '../components/StatusBadge';
import TechBadge from '../components/TechBadge';

function GalleryImage({ id, alt, onClick }: { id: string; alt: string; onClick: () => void }) {
  const url = useImageUrl(id);
  if (!url) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring aspect-square overflow-hidden rounded-md border border-base-border bg-base-panel2"
    >
      <img src={url} alt={alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
    </button>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const coverUrl = useImageUrl(project?.coverImageId ?? null);
  const lightboxUrl = useImageUrl(lightbox);

  useEffect(() => {
    if (!slug) return;
    db.getProjectBySlug(slug).then((p) => setProject(p ?? null));
  }, [slug]);

  if (project === undefined) {
    return <div className="mx-auto max-w-4xl px-5 py-24 text-base-muted">Caricamento…</div>;
  }

  if (project === null) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h1 className="text-2xl font-bold text-base-text">Progetto non trovato</h1>
        <button onClick={() => navigate('/progetti')} className="btn-secondary mt-6">
          Torna ai progetti
        </button>
      </div>
    );
  }

  const links = [
    { label: 'GitHub', url: project.githubUrl },
    { label: 'Live Demo', url: project.liveDemoUrl },
    { label: 'Website', url: project.websiteUrl },
    { label: 'Documentazione', url: project.documentationUrl },
  ].filter((l) => l.url);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <Link to="/progetti" className="focus-ring inline-flex items-center gap-1.5 text-sm text-base-muted hover:text-neon">
        ← Tutti i progetti
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-text sm:text-4xl">{project.title}</h1>
          <p className="mt-2 text-base-muted">{project.category}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {coverUrl && (
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg border border-base-border bg-base-panel2">
          <img src={coverUrl} alt={`Copertina di ${project.title}`} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <TechBadge key={tech} label={tech} />
        ))}
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      <div className="mt-10 whitespace-pre-line text-base leading-relaxed text-base-muted">
        {project.description}
      </div>

      {project.galleryImageIds.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-base-text">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {project.galleryImageIds.map((id, i) => (
              <GalleryImage key={id} id={id} alt={`Screenshot ${i + 1} di ${project.title}`} onClick={() => setLightbox(id)} />
            ))}
          </div>
        </div>
      )}

      {lightbox && lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 animate-fadeIn"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <img src={lightboxUrl} alt="Screenshot ingrandito" className="max-h-[85vh] max-w-full rounded-lg object-contain" />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="focus-ring absolute right-6 top-6 rounded-md border border-base-border bg-base-panel px-3 py-1.5 text-sm text-base-text"
          >
            Chiudi ✕
          </button>
        </div>
      )}
    </div>
  );
}
