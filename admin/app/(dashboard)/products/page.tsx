"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuLayoutGrid, LuList, LuPencil, LuPlus } from "react-icons/lu";
import { useProductsQuery } from "@/lib/queries/products";
import { Category } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { getAssetUrl } from "@/lib/assets";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductsSearch } from "@/components/products/ProductsSearch";
import { DeleteProductButton } from "@/components/products/DeleteProductButton";

type ViewMode = "table" | "grid";

const VIEW_STORAGE_KEY = "admin:products-view";

function useViewMode() {
  const [view, setView] = useState<ViewMode>("table");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a persisted preference on mount
      if (stored === "table" || stored === "grid") setView(stored);
    } catch {
      // ignore
    }
  }, []);

  function update(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  return [view, update] as const;
}

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-line p-0.5">
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-label="Рядками"
        aria-pressed={view === "table"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          view === "table" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
        )}
      >
        <LuList size={16} />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Плиткою"
        aria-pressed={view === "grid"}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          view === "grid" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
        )}
      >
        <LuLayoutGrid size={16} />
      </button>
    </div>
  );
}

function categoryNameOf(product: { category: Category | string | null }) {
  const category = product.category as Category | string | null;
  return typeof category === "string" ? category : category?.name;
}

function ProductsTable({ products }: { products: ReturnType<typeof useProductsQuery>["data"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper-soft text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-4 py-3 font-medium">Товар</th>
            <th className="px-4 py-3 font-medium">Категорія</th>
            <th className="px-4 py-3 font-medium">Ціна</th>
            <th className="px-4 py-3 font-medium">Мітки</th>
            <th className="px-4 py-3 font-medium text-right">Дії</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-paper">
          {products?.map((product) => (
            <tr key={product._id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-paper-soft">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getAssetUrl(product.images[0].url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] text-ink-soft">—</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-ink-soft">{product.subcategory}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-soft">{categoryNameOf(product)}</td>
              <td className="px-4 py-3">
                <span className="font-medium text-ink">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="ml-2 text-xs text-ink-soft line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  {product.isNew && <Badge tone="ink">Новинка</Badge>}
                  {product.isBestseller && <Badge tone="accent">Хіт</Badge>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/products/${product._id}`}
                    aria-label="Редагувати товар"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink"
                  >
                    <LuPencil size={16} />
                  </Link>
                  <DeleteProductButton id={product._id} name={product.name} />
                </div>
              </td>
            </tr>
          ))}
          {products?.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                Товарів не знайдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProductsGrid({ products }: { products: ReturnType<typeof useProductsQuery>["data"] }) {
  if (products?.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-paper px-4 py-10 text-center text-sm text-ink-soft">
        Товарів не знайдено
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => (
        <div
          key={product._id}
          className="overflow-hidden rounded-2xl border border-line bg-paper"
        >
          <div className="relative aspect-square bg-paper-soft">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getAssetUrl(product.images[0].url)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft">
                Без фото
              </div>
            )}
            <div className="absolute left-2 top-2 flex gap-1.5">
              {product.isNew && <Badge tone="ink">Новинка</Badge>}
              {product.isBestseller && <Badge tone="accent">Хіт</Badge>}
            </div>
          </div>
          <div className="p-4">
            <p className="font-medium text-ink">{product.name}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{categoryNameOf(product)}</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <span className="font-medium text-ink">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="ml-2 text-xs text-ink-soft line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <Link
                  href={`/products/${product._id}`}
                  aria-label="Редагувати товар"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink"
                >
                  <LuPencil size={16} />
                </Link>
                <DeleteProductButton id={product._id} name={product.name} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;
  const { data: products = [], isLoading } = useProductsQuery(search);
  const [view, setView] = useViewMode();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl text-ink">Товари</h1>
          <p className="mt-1 text-sm text-ink-soft">{products.length} товарів</p>
        </div>
        <LinkButton href="/products/new">
          <LuPlus size={16} />
          Додати товар
        </LinkButton>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <ProductsSearch />
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="h-96 rounded-2xl bg-paper-soft" />
        ) : view === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsTable products={products} />
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-2xl bg-paper-soft" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
