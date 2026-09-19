"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "../api";
import { Product, ProductColor } from "../types";

export type ProductInput = {
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: ProductColor[];
  isNew: boolean;
  isBestseller: boolean;
};

export type ActionResult<T> = { data?: T; error?: string };

export async function createProductAction(
  input: ProductInput
): Promise<ActionResult<Product>> {
  try {
    const product = await api.post<Product>("/products", input);
    revalidatePath("/products");
    return { data: product };
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "Не вдалося створити товар",
    };
  }
}

export async function updateProductAction(
  id: string,
  input: ProductInput
): Promise<ActionResult<Product>> {
  try {
    const product = await api.patch<Product>(`/products/${id}`, input);
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { data: product };
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "Не вдалося оновити товар",
    };
  }
}

export async function deleteProductAction(
  id: string
): Promise<ActionResult<null>> {
  try {
    await api.delete(`/products/${id}`);
    revalidatePath("/products");
    return { data: null };
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "Не вдалося видалити товар",
    };
  }
}
