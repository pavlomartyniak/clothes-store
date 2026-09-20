"use client";

import Link from "next/link";
import { LuShoppingBag, LuTrash2 } from "react-icons/lu";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";
import { formatPrice } from "@/lib/utils";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { LinkButton } from "@/components/ui/Button";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/shipping";

export default function CartPage() {
  const { lines, removeItem, updateQuantity, totalPrice } = useCart();
  const products = useProducts();

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
        <LuShoppingBag size={40} className="text-ink-soft" />
        <h1 className="font-display text-2xl text-ink">Кошик порожній</h1>
        <p className="text-ink-soft">Додайте товари з каталогу, щоб оформити замовлення.</p>
        <LinkButton href="/catalog" size="lg">
          До каталогу
        </LinkButton>
      </div>
    );
  }

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="mb-8 font-display text-3xl text-ink">Кошик</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line">
          {lines.map((line) => {
            const product = products.find((p) => p.slug === line.slug);
            if (!product) return null;
            return (
              <li key={`${line.slug}-${line.size}-${line.color}`} className="flex gap-4 py-6">
                <Link href={`/product/${product._id}`} className="shrink-0">
                  <ProductPhoto product={product} className="h-32 w-24 rounded-xl sm:h-40 sm:w-28" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${product._id}`} className="font-medium text-ink hover:text-accent">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">
                        Розмір {line.size} · {line.color}
                      </p>
                    </div>
                    <span className="font-semibold text-ink">
                      {formatPrice(product.price * line.quantity)}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(q) => updateQuantity(line.slug, line.size, line.color, q)}
                    />
                    <button
                      className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent"
                      onClick={() => removeItem(line.slug, line.size, line.color)}
                    >
                      <LuTrash2 size={15} /> Видалити
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-paper-soft p-6">
          <h2 className="text-lg font-medium text-ink">Разом до сплати</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Товари</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Доставка</span>
              <span>{shipping === 0 ? "Безкоштовно" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-accent">
                Додайте товарів ще на {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)} для безкоштовної доставки
              </p>
            )}
          </div>
          <div className="flex justify-between border-t border-line pt-4 text-base font-semibold text-ink">
            <span>Разом</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
          <LinkButton href="/checkout" size="lg" className="w-full">
            Оформити замовлення
          </LinkButton>
          <Link href="/catalog" className="block text-center text-sm text-ink-soft hover:text-ink">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </div>
  );
}
