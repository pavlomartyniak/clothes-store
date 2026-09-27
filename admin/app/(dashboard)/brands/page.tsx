"use client";

import { useBrandsQuery } from "@/lib/queries/brands";
import { CreateBrandForm } from "@/components/brands/CreateBrandForm";
import { BrandCard } from "@/components/brands/BrandCard";

export default function BrandsPage() {
  const { data: brands = [] } = useBrandsQuery();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-ink">Бренди</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Керуйте брендами та їхніми зображеннями для товарів
      </p>

      <div className="mt-6 rounded-2xl border border-line bg-paper-soft p-5">
        <CreateBrandForm />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {brands.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
