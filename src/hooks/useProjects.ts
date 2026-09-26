import { useCallback, useEffect, useState } from 'react';
import * as db from '../services/indexedDB';
import type { Project } from '../types/project';

export function useProjects(onlyPublished = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = onlyPublished ? await db.getPublishedProjects() : await db.getAllProjects();
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore nel caricamento dei progetti');
    } finally {
      setLoading(false);
    }
  }, [onlyPublished]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { projects, loading, error, refresh };
}
