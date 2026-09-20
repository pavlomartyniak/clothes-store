"use client";

import { useCategoriesQuery } from "@/lib/queries/categories";
import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Новий товар</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
