"use client";

import { useRef } from "react";
import { LuPlus, LuTrash2, LuUpload } from "react-icons/lu";
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

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => upload.mutate(file));
    e.target.value = "";
  }

  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-ink">Фото товару</p>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div
            key={image.publicId}
            className="group relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-line"
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
          disabled={upload.isPending}
          className="flex h-24 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-ink-soft hover:border-ink hover:text-ink"
        >
          {upload.isPending ? <LuUpload size={18} /> : <LuPlus size={18} />}
          <span className="text-[10px]">
            {upload.isPending ? "Завантаження..." : "Додати"}
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
      {(upload.isError || remove.isError) && (
        <p className="mt-2 text-sm text-danger">
          {extractErrorMessage(upload.error ?? remove.error)}
        </p>
      )}
      <p className="mt-2 text-xs text-ink-soft">JPEG, PNG, WEBP або GIF, до 5 МБ</p>
    </div>
  );
}
