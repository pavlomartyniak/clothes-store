"use client";

import { useCategoriesQuery } from "@/lib/queries/categories";
import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";
import { CategoryCard } from "@/components/categories/CategoryCard";

export default function CategoriesPage() {
  const { data: categories = [] } = useCategoriesQuery();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Категорії</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Керуйте категоріями та підкатегоріями товарів
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-paper-soft p-5">
        <CreateCategoryForm />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
}
