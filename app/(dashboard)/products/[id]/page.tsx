import { api } from "@/lib/api";
import { Category, Product } from "@/lib/types";
import { ProductForm } from "@/components/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    api.get<Product>(`/products/${id}`),
    api.get<Category[]>("/categories"),
  ]);

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Редагування товару</h1>
      <div className="mt-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
