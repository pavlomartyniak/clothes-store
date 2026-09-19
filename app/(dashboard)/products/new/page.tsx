import { api } from "@/lib/api";
import { Category } from "@/lib/types";
import { ProductForm } from "@/components/products/ProductForm";

export default async function NewProductPage() {
  const categories = await api.get<Category[]>("/categories");

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Новий товар</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
