"use client";

import { useActionState } from "react";
import { LuPlus } from "react-icons/lu";
import { createCategoryAction } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
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
      <Button type="submit" disabled={pending}>
        <LuPlus size={16} />
        Додати категорію
      </Button>
      {state?.error && <p className="w-full text-sm text-danger">{state.error}</p>}
    </form>
  );
}
