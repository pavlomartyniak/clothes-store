"use client";

import { useState, useTransition } from "react";
import { LuTrash2 } from "react-icons/lu";
import { deleteProductAction } from "@/lib/actions/products";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(`Видалити товар "${name}"?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Видалити товар"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-red-50 hover:text-danger"
      >
        <LuTrash2 size={16} />
      </button>
      {error && (
        <p className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg bg-danger px-2 py-1 text-xs text-paper">
          {error}
        </p>
      )}
    </div>
  );
}
