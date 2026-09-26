import type { Project, ProjectInput, StoredImage } from '../types/project';

const DB_NAME = 'portfolio-db';
const DB_VERSION = 1;
const PROJECTS_STORE = 'projects';
const IMAGES_STORE = 'images';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PROJECTS_STORE)) {
        const store = db.createObjectStore(PROJECTS_STORE, { keyPath: 'id' });
        store.createIndex('slug', 'slug', { unique: true });
        store.createIndex('order', 'order', { unique: false });
      }
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function tx(db: IDBDatabase, store: string, mode: IDBTransactionMode) {
  return db.transaction(store, mode).objectStore(store);
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------- PROJECTS ----------

export async function getAllProjects(): Promise<Project[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, PROJECTS_STORE, 'readonly').getAll();
    req.onsuccess = () => {
      const results = (req.result as Project[]).sort((a, b) => a.order - b.order);
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getPublishedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.published);
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, PROJECTS_STORE, 'readonly').get(id);
    req.onsuccess = () => resolve(req.result as Project | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug);
}

export async function addProject(input: ProjectInput): Promise<Project> {
  const db = await openDB();
  const all = await getAllProjects();
  const maxOrder = all.reduce((m, p) => Math.max(m, p.order), -1);
  const now = Date.now();
  const project: Project = {
    ...input,
    id: genId('proj'),
    order: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  return new Promise((resolve, reject) => {
    const req = tx(db, PROJECTS_STORE, 'readwrite').add(project);
    req.onsuccess = () => resolve(project);
    req.onerror = () => reject(req.error);
  });
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  const db = await openDB();
  const existing = await getProjectById(id);
  if (!existing) throw new Error('Progetto non trovato');
  const updated: Project = { ...existing, ...patch, id, updatedAt: Date.now() };
  return new Promise((resolve, reject) => {
    const req = tx(db, PROJECTS_STORE, 'readwrite').put(updated);
    req.onsuccess = () => resolve(updated);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteProject(id: string): Promise<void> {
  const db = await openDB();
  const project = await getProjectById(id);
  if (project) {
    const imageIds = [
      ...(project.coverImageId ? [project.coverImageId] : []),
      ...project.galleryImageIds,
    ];
    await Promise.all(imageIds.map((imgId) => deleteImage(imgId)));
  }
  return new Promise((resolve, reject) => {
    const req = tx(db, PROJECTS_STORE, 'readwrite').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const db = await openDB();
  const storeTx = db.transaction(PROJECTS_STORE, 'readwrite');
  const store = storeTx.objectStore(PROJECTS_STORE);
  await Promise.all(
    orderedIds.map(
      (id, index) =>
        new Promise<void>((resolve, reject) => {
          const getReq = store.get(id);
          getReq.onsuccess = () => {
            const proj = getReq.result as Project | undefined;
            if (!proj) return resolve();
            proj.order = index;
            const putReq = store.put(proj);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          };
          getReq.onerror = () => reject(getReq.error);
        })
    )
  );
}

// ---------- IMAGES ----------

export async function addImage(file: File): Promise<string> {
  const db = await openDB();
  const id = genId('img');
  const record: StoredImage = {
    id,
    blob: file,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    const req = tx(db, IMAGES_STORE, 'readwrite').add(record);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

export async function getImage(id: string): Promise<StoredImage | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, IMAGES_STORE, 'readonly').get(id);
    req.onsuccess = () => resolve(req.result as StoredImage | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteImage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, IMAGES_STORE, 'readwrite').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** Restituisce un object URL per un'immagine salvata (da revocare quando non serve più). */
export async function getImageUrl(id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const img = await getImage(id);
  if (!img) return null;
  return URL.createObjectURL(img.blob);
}
