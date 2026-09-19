"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";

export function ProductsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xs">
      <LuSearch
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Пошук за назвою..."
        className="h-10 w-full rounded-lg border border-line bg-paper pl-9 pr-3 text-sm text-ink focus:border-ink focus:outline-none"
      />
    </form>
  );
}
