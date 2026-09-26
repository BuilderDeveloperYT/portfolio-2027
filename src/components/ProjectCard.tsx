import { Link } from 'react-router-dom';
import type { Project } from '../types/project';
import { useImageUrl } from '../hooks/useImageUrl';
import StatusBadge from './StatusBadge';
import TechBadge from './TechBadge';

export default function ProjectCard({ project }: { project: Project }) {
  const coverUrl = useImageUrl(project.coverImageId);

  return (
    <Link
      to={`/progetti/${project.slug}`}
      className="group focus-ring block overflow-hidden rounded-lg border border-base-border bg-base-panel transition-all duration-300 hover:-translate-y-1 hover:border-neon/50 hover:shadow-neon-sm"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-panel2">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Copertina del progetto ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base-muted">
            <span className="font-mono text-xs">no cover</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-base-text transition-colors group-hover:text-neon">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-base-muted">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 font-mono text-xs text-base-muted">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
