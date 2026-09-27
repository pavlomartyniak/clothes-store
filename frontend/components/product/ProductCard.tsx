import Link from "next/link";
import { brandName, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductPhoto } from "./ProductPhoto";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const brand = brandName(product.brand);

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
        <ProductPhoto
          product={product}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && <Badge tone="ink">Новинка</Badge>}
          {product.oldPrice && <Badge tone="accent">Знижка</Badge>}
        </div>
        <WishlistButton />
      </div>
      <div className="mt-3 space-y-1">
        {(brand || product.subcategory) && (
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">
            {[brand, product.subcategory].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-ink-soft line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
