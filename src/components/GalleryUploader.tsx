import { useRef } from 'react';
import { useImageUrl } from '../hooks/useImageUrl';

interface Props {
  imageIds: string[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function GalleryThumb({
  id,
  index,
  total,
  onRemove,
  onMove,
}: {
  id: string;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}) {
  const url = useImageUrl(id);
  return (
    <div className="group relative overflow-hidden rounded-md border border-base-border bg-base-panel2">
      <div className="aspect-square w-full">
        {url && <img src={url} alt={`Screenshot ${index + 1}`} className="h-full w-full object-cover" />}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(id, 'up')}
            className="rounded bg-base-bg/90 px-2 py-1 text-xs text-base-text disabled:opacity-30"
            aria-label="Sposta a sinistra"
          >
            ←
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(id, 'down')}
            className="rounded bg-base-bg/90 px-2 py-1 text-xs text-base-text disabled:opacity-30"
            aria-label="Sposta a destra"
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="rounded bg-red-500/80 px-2 py-1 text-xs text-white hover:bg-red-500"
        >
          Elimina
        </button>
      </div>
    </div>
  );
}

export default function GalleryUploader({ imageIds, onAdd, onRemove, onMove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).every((f) => ACCEPTED.includes(f.type));
    if (!valid) return;
    onAdd(files);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="label-field !mb-0">Gallery screenshot</label>
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary !px-3 !py-1.5 text-xs">
          + Aggiungi immagini
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {imageIds.length === 0 ? (
        <div
          className="flex aspect-[3/1] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-base-border bg-base-panel2 text-xs text-base-muted"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          Nessuna immagine — clicca o trascina per aggiungere
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imageIds.map((id, index) => (
            <GalleryThumb
              key={id}
              id={id}
              index={index}
              total={imageIds.length}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-base-muted">
        Formati supportati: JPG, PNG, WEBP. Usa le frecce per riordinare.
      </p>
    </div>
  );
}
