import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const { projects, loading, error } = useProjects(true);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <p className="section-eyebrow">
        <span>Portfolio</span>
      </p>
      <h1 className="text-3xl font-bold text-base-text sm:text-4xl">Progetti</h1>
      <p className="mt-3 max-w-2xl text-base-muted">
        Una selezione dei progetti a cui ho lavorato: applicazioni, esperimenti e strumenti sviluppati per
        esplorare nuove tecnologie.
      </p>

      <div className="mt-12">
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[16/10] animate-pulse rounded-lg border border-base-border bg-base-panel" />
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <div className="card-panel flex flex-col items-center justify-center py-20 text-center">
            <p className="text-base-text">Nessun progetto pubblicato ancora.</p>
            <p className="mt-1 text-sm text-base-muted">
              Aggiungi il tuo primo progetto dall'area amministrativa.
            </p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
