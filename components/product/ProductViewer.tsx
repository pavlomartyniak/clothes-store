"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "./ProductGallery";
import { AddToCartPanel } from "./AddToCartPanel";

export function ProductViewer({ product }: { product: Product }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const activeColor = product.colors[activeColorIndex] ?? product.colors[0];

  return (
    <>
      <ProductGallery
        product={product}
        activeIndex={activeColorIndex}
        onSelect={setActiveColorIndex}
      />

      <div className="flex min-w-0 flex-col">
        {product.subcategory && (
          <p className="text-xs uppercase tracking-widest text-ink-soft">
            {product.subcategory}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-base text-ink-soft line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-soft">{product.description}</p>

        <div className="mt-8 border-t border-line pt-8">
          <AddToCartPanel
            product={product}
            color={activeColor.name}
            onColorChange={(name) => {
              const index = product.colors.findIndex((c) => c.name === name);
              if (index !== -1) setActiveColorIndex(index);
            }}
          />
        </div>

        <details className="mt-8 border-t border-line pt-6 text-sm">
          <summary className="cursor-pointer font-medium text-ink">Склад і догляд</summary>
          <ul className="mt-3 list-inside list-disc space-y-1 text-ink-soft">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
        <details className="border-t border-line pt-6 text-sm" open>
          <summary className="cursor-pointer font-medium text-ink">Доставка та повернення</summary>
          <p className="mt-3 text-ink-soft">
            Відправляємо протягом 1 робочого дня. Доставка Новою поштою 1–3 дні.
            Огляд і примірка можливі при отриманні на відділенні.
          </p>
        </details>
      </div>
    </>
  );
}
