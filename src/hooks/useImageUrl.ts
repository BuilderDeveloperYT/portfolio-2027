import { useEffect, useState } from 'react';
import { getImageUrl } from '../services/indexedDB';

export function useImageUrl(id: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    getImageUrl(id).then((resolved) => {
      if (cancelled) return;
      objectUrl = resolved;
      setUrl(resolved);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return url;
}
