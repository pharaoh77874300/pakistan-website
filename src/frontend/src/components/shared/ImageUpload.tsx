import { ExternalBlob } from "@/backend";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ImageUploadProps {
  value?: ExternalBlob;
  onChange: (blob: ExternalBlob | undefined) => void;
  label?: string;
  aspect?: "square" | "wide";
  "data-ocid"?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  aspect = "square",
  "data-ocid": ocid,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFile = async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setProgress(pct);
    });
    onChange(blob);
    setProgress(null);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";

  return (
    <div className="space-y-2" data-ocid={ocid}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInput}
        data-ocid={ocid ? `${ocid}_input` : undefined}
      />
      {value ? (
        <div
          className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-muted`}
        >
          <img
            src={value.getDirectURL()}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/20 opacity-0 hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => inputRef.current?.click()}
              data-ocid={ocid ? `${ocid}_change_button` : undefined}
            >
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange(undefined)}
              data-ocid={ocid ? `${ocid}_remove_button` : undefined}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${aspectClass} w-full rounded-xl border-2 border-dashed border-border hover:border-primary transition-smooth flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer bg-muted/30`}
          data-ocid={ocid ? `${ocid}_upload_button` : undefined}
        >
          {progress !== null ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="text-xs">{progress}%</span>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Upload image"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">{label}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
