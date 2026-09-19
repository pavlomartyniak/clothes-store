"use client";

import { FormEvent } from "react";
import { LuPlus } from "react-icons/lu";
import { useCreateCategoryMutation } from "@/lib/queries/categories";
import { extractErrorMessage } from "@/lib/http";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export function CreateCategoryForm() {
  const createCategory = useCreateCategoryMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name) return;

    createCategory.mutate(
      { name, slug: slugify(name), description: description || undefined },
      { onSuccess: () => form.reset() }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          Назва категорії
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Опис (необовʼязково)
        </label>
        <input id="description" name="description" className={inputClass} />
      </div>
      <Button type="submit" disabled={createCategory.isPending}>
        <LuPlus size={16} />
        Додати категорію
      </Button>
      {createCategory.isError && (
        <p className="w-full text-sm text-danger">
          {extractErrorMessage(createCategory.error)}
        </p>
      )}
    </form>
  );
}
