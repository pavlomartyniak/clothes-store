"use client";

import { createContext, useContext, useMemo } from "react";
import { Product } from "./types";

const ProductsContext = createContext<Product[] | null>(null);

export function ProductsProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const products = useContext(ProductsContext);
  if (!products) throw new Error("useProducts must be used within ProductsProvider");
  return products;
}

export function useProductBySlug(slug: string) {
  const products = useProducts();
  return useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
}
