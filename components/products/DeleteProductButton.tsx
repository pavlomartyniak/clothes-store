"use client";

import { LuTrash2 } from "react-icons/lu";
import { useDeleteProductMutation } from "@/lib/queries/products";
import { extractErrorMessage } from "@/lib/http";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const deleteProduct = useDeleteProductMutation();

  function handleDelete() {
    if (!confirm(`Видалити товар "${name}"?`)) return;
    deleteProduct.mutate(id);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteProduct.isPending}
        aria-label="Видалити товар"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-red-50 hover:text-danger"
      >
        <LuTrash2 size={16} />
      </button>
      {deleteProduct.isError && (
        <p className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg bg-danger px-2 py-1 text-xs text-paper">
          {extractErrorMessage(deleteProduct.error)}
        </p>
      )}
    </div>
  );
}
