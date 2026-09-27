"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LuSearch } from "react-icons/lu";

export function NotFoundSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/catalog?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук товарів..."
        className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Шукати"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent"
      >
        <LuSearch size={18} />
      </button>
    </form>
  );
}
