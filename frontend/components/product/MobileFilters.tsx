"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuSlidersHorizontal, LuX } from "react-icons/lu";
import { Category, Product } from "@/lib/types";
import { CatalogFilters } from "./CatalogFilters";

export function MobileFilters({
  products,
  categories,
  resultCount,
}: {
  products: Product[];
  categories: Category[];
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink lg:hidden"
      >
        <LuSlidersHorizontal size={16} />
        Фільтри
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-paper"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <h2 className="text-lg font-medium text-ink">Фільтри</h2>
                <button aria-label="Закрити фільтри" onClick={() => setOpen(false)}>
                  <LuX size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <CatalogFilters
                  products={products}
                  categories={categories}
                  onNavigate={() => setOpen(false)}
                  showHeading={false}
                />
              </div>
              <div className="border-t border-line px-6 py-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper"
                >
                  Показати {resultCount} товарів
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
