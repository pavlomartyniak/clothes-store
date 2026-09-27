"use client";

import { FormEvent } from "react";
import { LuPlus } from "react-icons/lu";
import { useCreateBrandMutation } from "@/lib/queries/brands";
import { extractErrorMessage } from "@/lib/http";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Field";

export function CreateBrandForm() {
  const createBrand = useCreateBrandMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    if (!name) return;

    createBrand.mutate({ name }, { onSuccess: () => form.reset() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-50 flex-1">
        <label htmlFor="brand-name" className="mb-1.5 block text-sm font-medium text-ink">
          Назва бренду
        </label>
        <input id="brand-name" name="name" required className={inputClass} />
      </div>
      <Button type="submit" disabled={createBrand.isPending}>
        <LuPlus size={16} />
        Додати бренд
      </Button>
      {createBrand.isError && (
        <p className="w-full text-sm text-danger">
          {extractErrorMessage(createBrand.error)}
        </p>
      )}
    </form>
  );
}
