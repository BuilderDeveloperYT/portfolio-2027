import { useRef } from 'react';
import { useImageUrl } from '../hooks/useImageUrl';

interface Props {
  imageId: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function CoverUploader({ imageId, onSelect, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useImageUrl(imageId);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return;
    onSelect(file);
  };

  return (
    <div>
      <label className="label-field">Cover principale *</label>
      <div
        className="group relative flex aspect-[16/9] w-full max-w-md cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-base-border bg-base-panel2 transition-colors hover:border-neon/50"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Anteprima cover" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-md bg-base-bg/90 px-3 py-1.5 text-xs font-medium text-base-text">
                Sostituisci
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="rounded-md bg-red-500/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
              >
                Rimuovi
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-base-muted">
            <p className="font-medium text-base-text">Carica immagine cover</p>
            <p className="mt-1 text-xs">JPG, PNG o WEBP</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
