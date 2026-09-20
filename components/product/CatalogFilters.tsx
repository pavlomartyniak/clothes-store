"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getAvailableSizes, getPriceBounds, getSubcategories } from "@/lib/products";
import { Category, Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export function useCatalogParams(categories: Category[]) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const category = categories.find((c) => c.slug === categorySlug)?.slug;
  const subcategories = searchParams.get("sub")?.split(",").filter(Boolean) ?? [];
  const sizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const priceMaxParam = searchParams.get("priceMax");
  const priceMax = priceMaxParam ? Number(priceMaxParam) : undefined;
  return { category, subcategories, sizes, priceMax };
}

export function CatalogFilters({
  products,
  categories,
  onNavigate,
  showHeading = true,
}: {
  products: Product[];
  categories: Category[];
  onNavigate?: () => void;
  showHeading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { category, subcategories, sizes, priceMax } = useCatalogParams(categories);
  const bounds = getPriceBounds(products);
  const [draftPrice, setDraftPrice] = useState(priceMax ?? bounds.max);

  const availableSubcategories = getSubcategories(categories, category);
  const availableSizes = getAvailableSizes(products, category, subcategories);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function setCategory(next?: string) {
    updateParams((params) => {
      if (next) params.set("category", next);
      else params.delete("category");
      params.delete("sub");
      params.delete("size");
    });
  }

  function toggleSubcategory(value: string) {
    updateParams((params) => {
      const current = new Set(subcategories);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      if (current.size) params.set("sub", Array.from(current).join(","));
      else params.delete("sub");
      params.delete("size");
    });
  }

  function toggleSize(value: string) {
    updateParams((params) => {
      const current = new Set(sizes);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      if (current.size) params.set("size", Array.from(current).join(","));
      else params.delete("size");
    });
  }

  function commitPrice(value: number) {
    updateParams((params) => {
      if (value >= bounds.max) params.delete("priceMax");
      else params.set("priceMax", String(value));
    });
  }

  function resetAll() {
    router.push(pathname, { scroll: false });
    setDraftPrice(bounds.max);
  }

  const hasActiveFilters = Boolean(category || subcategories.length || sizes.length || priceMax);

  return (
    <div className="space-y-8">
      {(showHeading || hasActiveFilters) && (
        <div className="flex items-center justify-between">
          {showHeading && (
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">Фільтри</h2>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                resetAll();
                onNavigate?.();
              }}
              className="text-xs font-medium text-accent hover:underline"
            >
              Скинути все
            </button>
          )}
        </div>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">Категорія</legend>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setCategory(undefined)}
            className={cn(
              "rounded-full px-3 py-1.5 text-left text-sm transition-colors",
              !category ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            )}
          >
            Усі категорії
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={cn(
                "rounded-full px-3 py-1.5 text-left text-sm transition-colors",
                category === c.slug ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </fieldset>

      {availableSubcategories.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Тип виробу</legend>
          <div className="flex flex-col gap-2.5">
            {availableSubcategories.map((sub) => (
              <label key={sub.slug} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={subcategories.includes(sub.slug)}
                  onChange={() => toggleSubcategory(sub.slug)}
                  className="h-4 w-4 rounded border-line accent-ink"
                />
                {sub.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {availableSizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-ink">Розмір</legend>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  "min-w-10 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  sizes.includes(size)
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink hover:border-ink"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">
          Ціна до {formatPrice(draftPrice)}
        </legend>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={10}
          value={draftPrice}
          onChange={(e) => setDraftPrice(Number(e.target.value))}
          onMouseUp={(e) => commitPrice(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitPrice(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => commitPrice(Number((e.target as HTMLInputElement).value))}
          className="w-full accent-ink"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>{formatPrice(bounds.min)}</span>
          <span>{formatPrice(bounds.max)}</span>
        </div>
      </fieldset>
    </div>
  );
}
