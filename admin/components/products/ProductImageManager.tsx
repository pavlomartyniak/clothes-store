"use client";

import { useRef, useState } from "react";
import { LuImagePlus, LuPlus, LuTrash2, LuUpload } from "react-icons/lu";
import {
  useRemoveProductImageMutation,
  useUploadProductImageMutation,
} from "@/lib/queries/products";
import { extractErrorMessage } from "@/lib/http";
import { getAssetUrl } from "@/lib/assets";
import { ProductImage } from "@/lib/types";

export function ProductImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadProductImageMutation(productId);
  const remove = useRemoveProductImageMutation(productId);

  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setUploadingCount(files.length);
    try {
      // Upload one at a time, in selection order — the backend appends each
      // image to the array as it arrives, so parallel uploads could finish
      // (and get appended) out of order.
      for (const file of files) {
        await upload.mutateAsync(file);
      }
    } finally {
      setUploadingCount(0);
    }
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    void uploadFiles(files);
  }

  function isFileDrag(e: React.DragEvent) {
    return Array.from(e.dataTransfer.types).includes("Files");
  }

  function handleDropzoneDragOver(e: React.DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    setIsDraggingFile(true);
  }

  function handleDropzoneDragLeave(e: React.DragEvent) {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFile(false);
  }

  function handleDropzoneDrop(e: React.DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    setIsDraggingFile(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    void uploadFiles(files);
  }

  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-ink">Фото товару</p>

      <div
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        className={`relative rounded-xl border-2 border-dashed p-3 transition-colors ${
          isDraggingFile ? "border-accent bg-accent/5" : "border-line bg-paper-soft/40"
        }`}
      >
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div
              key={image.publicId}
              className="group relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-paper shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAssetUrl(image.url)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove.mutate(image.publicId)}
                disabled={remove.isPending}
                aria-label="Видалити фото"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 transition-opacity group-hover:opacity-100"
              >
                <LuTrash2 size={12} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadingCount > 0}
            className="flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {uploadingCount > 0 ? (
              <LuUpload size={18} className="animate-pulse" />
            ) : (
              <LuPlus size={18} />
            )}
            <span className="text-[10px]">
              {uploadingCount > 0 ? "Завантаження..." : "Додати"}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </div>

        {isDraggingFile && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-[10px] bg-paper/90 text-accent">
            <LuImagePlus size={28} />
            <span className="text-sm font-medium">Відпустіть, щоб завантажити</span>
          </div>
        )}
      </div>

      {(upload.isError || remove.isError) && (
        <p className="mt-2 text-sm text-danger">
          {extractErrorMessage(upload.error ?? remove.error)}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-soft">
        JPEG, PNG, WEBP або GIF, до 5 МБ. Перетягніть файли сюди, щоб завантажити.
      </p>
    </div>
  );
}
