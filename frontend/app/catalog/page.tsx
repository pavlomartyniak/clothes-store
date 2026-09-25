import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/products";
import { categorySlug } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogSort } from "@/components/product/CatalogSort";
import { CatalogFilters } from "@/components/product/CatalogFilters";
import { MobileFilters } from "@/components/product/MobileFilters";
import { ActiveFilterChips } from "@/components/product/ActiveFilterChips";
import { Reveal } from "@/components/motion/Reveal";

type SearchParams = Promise<{
  category?: string;
  sub?: string;
  size?: string;
  priceMax?: string;
  sort?: string;
}>;

export const metadata = {
  title: "Каталог — Maison",
};

export const revalidate = 60;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const { category, sub, size, priceMax, sort } = await searchParams;
  const activeCategory = categories.find((c) => c.slug === category)?.slug;
  const activeSubcategories = sub?.split(",").filter(Boolean) ?? [];
  const activeSizes = size?.split(",").filter(Boolean) ?? [];
  const activePriceMax = priceMax ? Number(priceMax) : undefined;

  let list = activeCategory
    ? products.filter((p) => categorySlug(p.category) === activeCategory)
    : products;

  if (activeSubcategories.length > 0) {
    list = list.filter((p) => !!p.subcategory && activeSubcategories.includes(p.subcategory));
  }
  if (activeSizes.length > 0) {
    list = list.filter((p) => p.sizes.some((s) => activeSizes.includes(s)));
  }
  if (activePriceMax) {
    list = list.filter((p) => p.price <= activePriceMax);
  }

  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "new") return Number(b.isNew) - Number(a.isNew);
    return Number(b.isBestseller) - Number(a.isBestseller);
  });

  const title = activeCategory
    ? categories.find((c) => c.slug === activeCategory)?.name
    : "Весь каталог";

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-accent">Каталог</span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{list.length} товарів</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <Suspense fallback={<div className="h-96 rounded-2xl bg-paper-soft" />}>
            <CatalogFilters products={products} categories={categories} />
          </Suspense>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <Suspense fallback={<div className="h-10 w-24 rounded-full bg-paper-soft lg:hidden" />}>
              <MobileFilters products={products} categories={categories} resultCount={list.length} />
            </Suspense>
            <div className="ml-auto">
              <Suspense fallback={<div className="h-11 w-44 rounded-full bg-paper-soft" />}>
                <CatalogSort />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={null}>
            <ActiveFilterChips categories={categories} />
          </Suspense>

          {list.length === 0 ? (
            <p className="py-20 text-center text-ink-soft">
              За обраними фільтрами товарів не знайдено. Спробуйте змінити параметри.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              {list.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 4) * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
