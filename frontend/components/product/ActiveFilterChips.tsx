"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LuX } from "react-icons/lu";
import { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCatalogParams } from "./CatalogFilters";

export function ActiveFilterChips({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { category, subcategories, sizes, priceMax } = useCatalogParams(categories);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  function subcategoryName(slug: string) {
    for (const c of categories) {
      const match = c.subcategories.find((s) => s.slug === slug);
      if (match) return match.name;
    }
    return slug;
  }

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (category) {
    const label = categories.find((c) => c.slug === category)?.name ?? category;
    chips.push({
      key: "category",
      label,
      onRemove: () =>
        updateParams((params) => {
          params.delete("category");
          params.delete("sub");
          params.delete("size");
        }),
    });
  }

  subcategories.forEach((sub) => {
    chips.push({
      key: `sub-${sub}`,
      label: subcategoryName(sub),
      onRemove: () =>
        updateParams((params) => {
          const next = subcategories.filter((s) => s !== sub);
          if (next.length) params.set("sub", next.join(","));
          else params.delete("sub");
        }),
    });
  });

  sizes.forEach((size) => {
    chips.push({
      key: `size-${size}`,
      label: `Розмір ${size}`,
      onRemove: () =>
        updateParams((params) => {
          const next = sizes.filter((s) => s !== size);
          if (next.length) params.set("size", next.join(","));
          else params.delete("size");
        }),
    });
  });

  if (priceMax) {
    chips.push({
      key: "priceMax",
      label: `До ${formatPrice(priceMax)}`,
      onRemove: () => updateParams((params) => params.delete("priceMax")),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full border border-line bg-paper-soft px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink"
        >
          {chip.label}
          <LuX size={12} />
        </button>
      ))}
    </div>
  );
}
