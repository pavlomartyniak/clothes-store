"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "../api";
import { slugify } from "../utils";

export type FormState = { error?: string } | undefined;

export async function createCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) return { error: "Вкажіть назву категорії" };

  try {
    await api.post("/categories", {
      name,
      slug: slugify(name),
      description: description || undefined,
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Не вдалося створити категорію" };
  }

  revalidatePath("/categories");
}

export async function deleteCategoryAction(id: string) {
  await api.delete(`/categories/${id}`);
  revalidatePath("/categories");
}

export async function addSubcategoryAction(
  categoryId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Вкажіть назву підкатегорії" };

  try {
    await api.post(`/categories/${categoryId}/subcategories`, {
      name,
      slug: slugify(name),
    });
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Не вдалося додати підкатегорію" };
  }

  revalidatePath("/categories");
}

export async function removeSubcategoryAction(
  categoryId: string,
  subcategoryId: string
) {
  await api.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);
  revalidatePath("/categories");
}
