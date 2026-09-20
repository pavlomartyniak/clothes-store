"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { CartLine } from "./types";
import { useProducts } from "./products-context";

const STORAGE_KEY = "siluet:cart";
const EMPTY_LINES: CartLine[] = [];

let lines: CartLine[] = EMPTY_LINES;
let hydratedFromStorage = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore storage quota / privacy mode errors
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hydratedFromStorage) {
    hydratedFromStorage = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) lines = JSON.parse(raw);
    } catch {
      // ignore corrupted storage
    }
  }
  return lines;
}

function getServerSnapshot() {
  return EMPTY_LINES;
}

function setLines(next: CartLine[]) {
  lines = next;
  persist();
  notify();
}

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: CartLine) => void;
  removeItem: (slug: string, size: string, color: string) => void;
  updateQuantity: (slug: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const currentLines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const products = useProducts();

  const addItem = useCallback((line: CartLine) => {
    const existing = lines.find(
      (l) => l.slug === line.slug && l.size === line.size && l.color === line.color
    );
    if (existing) {
      setLines(
        lines.map((l) => (l === existing ? { ...l, quantity: l.quantity + line.quantity } : l))
      );
    } else {
      setLines([...lines, line]);
    }
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, size: string, color: string) => {
    setLines(lines.filter((l) => !(l.slug === slug && l.size === size && l.color === color)));
  }, []);

  const updateQuantity = useCallback(
    (slug: string, size: string, color: string, quantity: number) => {
      setLines(
        lines
          .map((l) =>
            l.slug === slug && l.size === size && l.color === color ? { ...l, quantity } : l
          )
          .filter((l) => l.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { totalCount, totalPrice } = useMemo(() => {
    return currentLines.reduce(
      (acc, line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return acc;
        acc.totalCount += line.quantity;
        acc.totalPrice += product.price * line.quantity;
        return acc;
      },
      { totalCount: 0, totalPrice: 0 }
    );
  }, [currentLines, products]);

  const value = useMemo(
    () => ({
      lines: currentLines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalCount,
      totalPrice,
    }),
    [currentLines, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart, totalCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
