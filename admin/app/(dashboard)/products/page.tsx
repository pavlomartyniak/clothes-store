"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LuPencil, LuPlus } from "react-icons/lu";
import { useProductsQuery } from "@/lib/queries/products";
import { Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getAssetUrl } from "@/lib/assets";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductsSearch } from "@/components/products/ProductsSearch";
import { DeleteProductButton } from "@/components/products/DeleteProductButton";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;
  const { data: products = [], isLoading } = useProductsQuery(search);

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

      <div className="mt-6">
        <ProductsSearch />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line">
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
            {products.map((product) => {
              const category = product.category as Category | string;
              const categoryName =
                typeof category === "string" ? category : category?.name;
              return (
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
                  <td className="px-4 py-3 text-ink-soft">{categoryName}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">
                      {formatPrice(product.price)}
                    </span>
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
              );
            })}
            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                  Товарів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
