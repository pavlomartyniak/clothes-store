"use client";

import { FormEvent, useState } from "react";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { Category } from "@/lib/types";
import {
  useAddSubcategoryMutation,
  useDeleteCategoryMutation,
  useRemoveSubcategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/queries/categories";
import { extractErrorMessage } from "@/lib/http";
import { Badge } from "@/components/ui/Badge";

export function CategoryCard({ category }: { category: Category }) {
  const addSubcategory = useAddSubcategoryMutation();
  const deleteCategory = useDeleteCategoryMutation();
  const removeSubcategory = useRemoveSubcategoryMutation();
  const updateCategory = useUpdateCategoryMutation();
  const [content, setContent] = useState(category.content ?? "");

  function handleDeleteCategory() {
    if (!confirm(`Видалити категорію "${category.name}"?`)) return;
    deleteCategory.mutate(category._id);
  }

  function handleSaveContent() {
    updateCategory.mutate({ id: category._id, content });
  }

  function handleAddSubcategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    if (!name) return;
    addSubcategory.mutate(
      { categoryId: category._id, name },
      { onSuccess: () => form.reset() }
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-ink">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-ink-soft">{category.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleDeleteCategory}
          disabled={deleteCategory.isPending}
          aria-label="Видалити категорію"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-danger"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {category.subcategories.map((sub) => (
          <Badge key={sub._id} tone="muted" className="gap-1.5 pr-1.5">
            {sub.name}
            <button
              type="button"
              aria-label={`Видалити підкатегорію ${sub.name}`}
              onClick={() =>
                removeSubcategory.mutate({ categoryId: category._id, subcategoryId: sub._id })
              }
              className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-ink/10"
            >
              <LuX size={11} />
            </button>
          </Badge>
        ))}
        {category.subcategories.length === 0 && (
          <p className="text-sm text-ink-soft">Немає підкатегорій</p>
        )}
      </div>

      <form onSubmit={handleAddSubcategory} className="mt-4 flex items-center gap-2">
        <input
          name="name"
          placeholder="Нова підкатегорія"
          className="h-9 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={addSubcategory.isPending}
          aria-label="Додати підкатегорію"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft hover:border-ink hover:text-ink"
        >
          <LuPlus size={16} />
        </button>
      </form>
      {addSubcategory.isError && (
        <p className="mt-2 text-sm text-danger">{extractErrorMessage(addSubcategory.error)}</p>
      )}
      {deleteCategory.isError && (
        <p className="mt-2 text-sm text-danger">{extractErrorMessage(deleteCategory.error)}</p>
      )}

      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink-soft hover:text-ink">
          SEO-текст сторінки категорії
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
            disabled={updateCategory.isPending}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:border-ink"
          >
            {updateCategory.isPending ? "Збереження..." : "Зберегти"}
          </button>
          <span className="text-xs text-ink-soft">{content.trim().split(/\s+/).filter(Boolean).length} слів</span>
        </div>
        {updateCategory.isError && (
          <p className="mt-2 text-sm text-danger">{extractErrorMessage(updateCategory.error)}</p>
        )}
      </details>
    </div>
  );
}
