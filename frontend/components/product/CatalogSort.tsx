"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LuChevronDown } from "react-icons/lu";

const options = [
  { value: "popular", label: "За популярністю" },
  { value: "price-asc", label: "Спочатку дешевші" },
  { value: "price-desc", label: "Спочатку дорожчі" },
  { value: "new", label: "Спочатку нові" },
];

export function CatalogSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "popular";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "popular") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative inline-flex">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="h-11 appearance-none rounded-full border border-line bg-paper py-2 pl-4 pr-10 text-sm text-ink focus:border-ink focus:outline-none"
        aria-label="Сортування"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <LuChevronDown
        size={16}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
      />
    </div>
  );
}
