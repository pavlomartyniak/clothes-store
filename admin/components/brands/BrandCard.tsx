"use client";

import { useRef, useState } from "react";
import { LuImage, LuTrash2, LuUpload } from "react-icons/lu";
import { Brand } from "@/lib/types";
import {
  useDeleteBrandMutation,
  useRemoveBrandImageMutation,
  useUpdateBrandMutation,
  useUploadBrandImageMutation,
} from "@/lib/queries/brands";
import { extractErrorMessage } from "@/lib/http";
import { getAssetUrl } from "@/lib/assets";

export function BrandCard({ brand }: { brand: Brand }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteBrand = useDeleteBrandMutation();
  const uploadImage = useUploadBrandImageMutation(brand._id);
  const removeImage = useRemoveBrandImageMutation(brand._id);
  const updateBrand = useUpdateBrandMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState(brand.content ?? "");

  function handleDelete() {
    if (!confirm(`Видалити бренд "${brand.name}"?`)) return;
    deleteBrand.mutate(brand._id);
  }

  function handleSaveContent() {
    updateBrand.mutate({ id: brand._id, content });
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadImage.mutateAsync(file);
    } finally {
      setIsUploading(false);
    }
  }

  const error = deleteBrand.isError
    ? deleteBrand.error
    : uploadImage.isError
      ? uploadImage.error
      : removeImage.isError
        ? removeImage.error
        : null;

  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center gap-4">
        <div className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-paper-soft">
          {brand.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAssetUrl(brand.imageUrl)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage.mutate()}
                disabled={removeImage.isPending}
                aria-label="Видалити зображення"
                className="absolute inset-0 flex items-center justify-center bg-ink/60 text-paper opacity-0 transition-opacity group-hover:opacity-100"
              >
                <LuTrash2 size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              aria-label="Завантажити зображення"
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-soft transition-colors hover:text-ink"
            >
              {isUploading ? <LuUpload size={18} className="animate-pulse" /> : <LuImage size={18} />}
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelected}
            className="hidden"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-ink">{brand.name}</h3>
          {brand.imageUrl ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Змінити зображення
            </button>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Додати зображення
            </button>
          )}
          {error && <p className="mt-1 text-xs text-danger">{extractErrorMessage(error)}</p>}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteBrand.isPending}
          aria-label="Видалити бренд"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-danger"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink-soft hover:text-ink">
          SEO-текст сторінки бренду
        </summary>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="150–300 слів під сіткою товарів: моделі, матеріали, як обрати розмір, доставка"
          className="mt-3 w-full rounded-lg border border-line bg-paper p-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveContent}
            disabled={updateBrand.isPending}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:border-ink"
          >
            {updateBrand.isPending ? "Збереження..." : "Зберегти"}
          </button>
          <span className="text-xs text-ink-soft">
            {content.trim().split(/\s+/).filter(Boolean).length} слів
          </span>
        </div>
        {updateBrand.isError && (
          <p className="mt-2 text-sm text-danger">{extractErrorMessage(updateBrand.error)}</p>
        )}
      </details>
    </div>
  );
}
