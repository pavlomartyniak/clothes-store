import Link from "next/link";
import { brandName, brandSlug, categoryName, categorySlug, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductPhoto } from "./ProductPhoto";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const brand = brandName(product.brand);
  const brandSlugValue = brandSlug(product.brand);
  const category = categoryName(product.category);
  const categorySlugValue = categorySlug(product.category);

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
          <ProductPhoto
            product={product}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNew && <Badge tone="ink">Новинка</Badge>}
            {product.oldPrice && <Badge tone="accent">Знижка</Badge>}
            {product.soldOut && <Badge tone="muted">Продано</Badge>}
          </div>
          <WishlistButton />
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        {(category || brand) && (
          <p className="flex flex-wrap items-center gap-x-1.5 text-[11px] uppercase tracking-wider text-ink-soft">
            {category && (
              <Link href={`/${categorySlugValue}`} className="hover:text-ink">
                {category}
              </Link>
            )}
            {category && brand && <span aria-hidden="true">·</span>}
            {brand && (
              <Link href={`/brand/${brandSlugValue}`} className="hover:text-ink">
                {brand}
              </Link>
            )}
          </p>
        )}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-ink">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-ink-soft line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
