"use client";

import { useActionState, useTransition } from "react";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { Category } from "@/lib/types";
import {
  addSubcategoryAction,
  deleteCategoryAction,
  removeSubcategoryAction,
} from "@/lib/actions/categories";
import { Badge } from "@/components/ui/Badge";

export function CategoryCard({ category }: { category: Category }) {
  const addAction = addSubcategoryAction.bind(null, category._id);
  const [state, formAction, pending] = useActionState(addAction, undefined);
  const [isDeleting, startDelete] = useTransition();

  function handleDeleteCategory() {
    if (
      !confirm(
        `Видалити категорію "${category.name}"? Товари з цією категорією залишаться, але без звʼязку.`
      )
    )
      return;
    startDelete(() => deleteCategoryAction(category._id));
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
          disabled={isDeleting}
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
              onClick={() => removeSubcategoryAction(category._id, sub._id)}
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

      <form action={formAction} className="mt-4 flex items-center gap-2">
        <input
          name="name"
          placeholder="Нова підкатегорія"
          className="h-9 flex-1 rounded-lg border border-line bg-paper px-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Додати підкатегорію"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft hover:border-ink hover:text-ink"
        >
          <LuPlus size={16} />
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
    </div>
  );
}
