"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LuShoppingBag, LuTrash2, LuX } from "react-icons/lu";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";
import { formatPrice } from "@/lib/utils";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { LinkButton } from "@/components/ui/Button";

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const products = useProducts();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeCart}
        >
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-medium">Кошик ({lines.length})</h2>
          <button aria-label="Закрити кошик" onClick={closeCart}>
            <LuX size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-ink-soft">
            <LuShoppingBag size={32} />
            <p>Ваш кошик поки порожній</p>
            <button onClick={closeCart} className="text-sm font-medium text-accent hover:underline">
              Продовжити покупки
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {lines.map((line) => {
                const product = products.find((p) => p.slug === line.slug);
                if (!product) return null;
                return (
                  <li key={`${line.slug}-${line.size}-${line.color}`} className="flex gap-4">
                    <Link href={`/product/${product._id}`} onClick={closeCart} className="shrink-0">
                      <ProductPhoto product={product} className="h-24 w-20 rounded-xl" />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${product._id}`} onClick={closeCart} className="text-sm font-medium hover:text-accent">
                          {product.name}
                        </Link>
                        <button
                          aria-label="Видалити товар"
                          className="text-ink-soft hover:text-accent"
                          onClick={() => removeItem(line.slug, line.size, line.color)}
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-ink-soft">
                        Розмір {line.size} · {line.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <QuantityStepper
                          value={line.quantity}
                          onChange={(q) => updateQuantity(line.slug, line.size, line.color, q)}
                        />
                        <span className="text-sm font-semibold">
                          {formatPrice(product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-4 border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Разом</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-ink-soft">Доставка розраховується на етапі оформлення</p>
              <LinkButton href="/checkout" size="lg" className="w-full" onClick={closeCart}>
                Оформити замовлення
              </LinkButton>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block text-center text-sm text-ink-soft hover:text-ink"
              >
                Переглянути кошик
              </Link>
            </div>
          </>
        )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
