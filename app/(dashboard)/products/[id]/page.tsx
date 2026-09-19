"use client";

import { use } from "react";
import { useCategoriesQuery } from "@/lib/queries/categories";
import { useProductQuery } from "@/lib/queries/products";
import { ProductForm } from "@/components/products/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useProductQuery(id);
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Редагування товару</h1>
      <div className="mt-6">
        {isLoading || !product ? (
          <p className="text-sm text-ink-soft">Завантаження...</p>
        ) : (
          <ProductForm categories={categories} product={product} />
        )}
      </div>
    </div>
  );
}
