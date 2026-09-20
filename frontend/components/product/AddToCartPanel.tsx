"use client";

import { useState } from "react";
import { LuCheck, LuShoppingBag } from "react-icons/lu";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils";

export function AddToCartPanel({
  product,
  color,
  onColorChange,
}: {
  product: Product;
  color: string;
  onColorChange: (name: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="space-y-6">
      {product.colors.length > 1 && (
        <div>
          <p className="mb-3 text-sm font-medium text-ink">
            Колір: <span className="font-normal text-ink-soft">{color}</span>
          </p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                onClick={() => onColorChange(c.name)}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform",
                  color === c.name ? "border-ink scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-medium text-ink">Розмір</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "min-w-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                size === s
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-ink">Кількість</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => addItem({ slug: product.slug, size, color, quantity })}
      >
        <LuShoppingBag size={18} />
        Додати в кошик
      </Button>

      <p className="flex items-center gap-2 text-xs text-ink-soft">
        <LuCheck size={14} className="text-accent" /> В наявності, відправимо протягом 1 дня
      </p>
    </div>
  );
}
