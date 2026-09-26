import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as db from '../../services/indexedDB';
import { slugify } from '../../services/indexedDB';
import type { Project, ProjectInput, ProjectStatus } from '../../types/project';
import { PROJECT_STATUS_LABELS } from '../../types/project';
import CoverUploader from '../../components/CoverUploader';
import GalleryUploader from '../../components/GalleryUploader';
import { useImageUrl } from '../../hooks/useImageUrl';
import StatusBadge from '../../components/StatusBadge';
import TechBadge from '../../components/TechBadge';

const emptyForm: ProjectInput = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: '',
  status: 'in-sviluppo',
  technologies: [],
  coverImageId: null,
  galleryImageIds: [],
  githubUrl: '',
  liveDemoUrl: '',
  websiteUrl: '',
  documentationUrl: '',
  published: false,
};

function PreviewCard({ form }: { form: ProjectInput }) {
  const coverUrl = useImageUrl(form.coverImageId);
  return (
    <div className="overflow-hidden rounded-lg border border-base-border bg-base-panel">
      <div className="aspect-[16/10] w-full overflow-hidden bg-base-panel2">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-base-muted">nessuna cover</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-base-text">{form.title || 'Titolo progetto'}</h3>
          <StatusBadge status={form.status} />
        </div>
        <p className="mb-4 text-sm text-base-muted">{form.shortDescription || 'Breve descrizione del progetto…'}</p>
        <div className="flex flex-wrap gap-1.5">
          {form.technologies.map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    db.getProjectById(id).then((project) => {
      if (project) {
        const { id: _pid, createdAt: _c, updatedAt: _u, order: _o, ...rest } = project;
        setForm(rest);
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id]);

  const update = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    update('title', value);
    if (!slugTouched) {
      update('slug', slugify(value));
    }
  };

  const addTech = () => {
    const value = techInput.trim();
    if (!value || form.technologies.includes(value)) return;
    update('technologies', [...form.technologies, value]);
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    update(
      'technologies',
      form.technologies.filter((t) => t !== tech)
    );
  };

  const handleCoverSelect = async (file: File) => {
    const oldId = form.coverImageId;
    const newId = await db.addImage(file);
    update('coverImageId', newId);
    if (oldId) await db.deleteImage(oldId);
  };

  const handleCoverRemove = async () => {
    if (form.coverImageId) await db.deleteImage(form.coverImageId);
    update('coverImageId', null);
  };

  const handleGalleryAdd = async (files: FileList) => {
    const ids = await Promise.all(Array.from(files).map((f) => db.addImage(f)));
    update('galleryImageIds', [...form.galleryImageIds, ...ids]);
  };

  const handleGalleryRemove = async (imgId: string) => {
    await db.deleteImage(imgId);
    update(
      'galleryImageIds',
      form.galleryImageIds.filter((gid) => gid !== imgId)
    );
  };

  const handleGalleryMove = (imgId: string, direction: 'up' | 'down') => {
    const ids = [...form.galleryImageIds];
    const idx = ids.indexOf(imgId);
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= ids.length) return;
    [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
    update('galleryImageIds', ids);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.coverImageId) {
      setError('La cover principale è obbligatoria.');
      return;
    }
    if (!form.slug.trim()) {
      setError('Lo slug è obbligatorio.');
      return;
    }

    setSaving(true);
    try {
      const existingBySlug = await db.getProjectBySlug(form.slug);
      if (existingBySlug && existingBySlug.id !== id) {
        setError('Esiste già un progetto con questo slug. Scegline uno diverso.');
        setSaving(false);
        return;
      }

      const cleanedLinks = {
        githubUrl: form.githubUrl?.trim() || undefined,
        liveDemoUrl: form.liveDemoUrl?.trim() || undefined,
        websiteUrl: form.websiteUrl?.trim() || undefined,
        documentationUrl: form.documentationUrl?.trim() || undefined,
      };

      if (isEdit && id) {
        await db.updateProject(id, { ...form, ...cleanedLinks });
      } else {
        await db.addProject({ ...form, ...cleanedLinks });
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-16 text-center text-sm text-base-muted">Caricamento…</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-base-text">{isEdit ? 'Modifica progetto' : 'Nuovo progetto'}</h1>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informazioni principali */}
          <section className="card-panel space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-muted">Informazioni principali</h2>
            <div>
              <label className="label-field">Nome progetto *</label>
              <input
                required
                className="input-field"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Slug *</label>
              <input
                required
                className="input-field font-mono"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update('slug', slugify(e.target.value));
                }}
              />
            </div>
            <div>
              <label className="label-field">Breve descrizione *</label>
              <input
                required
                className="input-field"
                maxLength={140}
                value={form.shortDescription}
                onChange={(e) => update('shortDescription', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Descrizione completa *</label>
              <textarea
                required
                rows={6}
                className="input-field resize-y"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Categoria</label>
                <input
                  className="input-field"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Stato</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => update('status', e.target.value as ProjectStatus)}
                >
                  {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Tecnologie */}
          <section className="card-panel space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-muted">Tecnologie</h2>
            <div className="flex gap-2">
              <input
                className="input-field"
                placeholder="es. React"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTech();
                  }
                }}
              />
              <button type="button" onClick={addTech} className="btn-secondary shrink-0">
                Aggiungi
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-md border border-base-border bg-base-panel2 px-2.5 py-1 font-mono text-xs text-base-muted"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    aria-label={`Rimuovi ${tech}`}
                    className="text-base-muted hover:text-red-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Link */}
          <section className="card-panel space-y-4 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-muted">Link (opzionali)</h2>
            <div>
              <label className="label-field">GitHub</label>
              <input
                className="input-field"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={(e) => update('githubUrl', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Live Demo</label>
              <input
                className="input-field"
                placeholder="https://..."
                value={form.liveDemoUrl}
                onChange={(e) => update('liveDemoUrl', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Website</label>
              <input
                className="input-field"
                placeholder="https://..."
                value={form.websiteUrl}
                onChange={(e) => update('websiteUrl', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Documentazione</label>
              <input
                className="input-field"
                placeholder="https://..."
                value={form.documentationUrl}
                onChange={(e) => update('documentationUrl', e.target.value)}
              />
            </div>
          </section>

          {/* Immagini */}
          <section className="card-panel space-y-6 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-base-muted">Immagini</h2>
            <CoverUploader imageId={form.coverImageId} onSelect={handleCoverSelect} onRemove={handleCoverRemove} />
            <GalleryUploader
              imageIds={form.galleryImageIds}
              onAdd={handleGalleryAdd}
              onRemove={handleGalleryRemove}
              onMove={handleGalleryMove}
            />
          </section>

          {/* Visibilità */}
          <section className="card-panel p-6">
            <label className="flex items-center justify-between">
              <span>
                <span className="block text-sm font-medium text-base-text">Pubblica progetto</span>
                <span className="block text-xs text-base-muted">
                  Se disattivo, il progetto resta visibile solo qui in dashboard.
                </span>
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#39FF88]"
                checked={form.published}
                onChange={(e) => update('published', e.target.checked)}
              />
            </label>
          </section>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvataggio…' : 'Salva progetto'}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
              Annulla
            </button>
          </div>
        </form>

        {/* Preview live */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="section-eyebrow">
            <span>Anteprima progetto</span>
          </p>
          <PreviewCard form={form} />
        </div>
      </div>
    </div>
  );
}
