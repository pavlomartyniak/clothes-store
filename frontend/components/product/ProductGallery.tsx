"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuExpand, LuX } from "react-icons/lu";
import { Product } from "@/lib/types";
import { ProductPhoto } from "./ProductPhoto";
import { Badge } from "@/components/ui/Badge";
import { gradientFromHex } from "@/lib/color";
import { cn } from "@/lib/utils";

export function ProductGallery({
  product,
  activeIndex,
  onSelect,
}: {
  product: Product;
  /** Selected color index, used only as the gallery index when the product
   * has no uploaded photos (falls back to a gradient per color). */
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const mainTouchStartX = useRef<number | null>(null);
  const didSwipeMain = useRef(false);
  const hasPhotos = product.images.length > 0;

  // Real photos aren't tied to a color, so the gallery keeps its own index
  // for them instead of sharing the buy-box color selection.
  const [photoIndex, setPhotoIndex] = useState(0);
  const index = hasPhotos ? photoIndex : activeIndex;
  const setIndex = hasPhotos ? setPhotoIndex : onSelect;
  const count = hasPhotos ? product.images.length : product.colors.length;
  const activeColor = product.colors[activeIndex] ?? product.colors[0];

  function renderPhoto(i: number, className: string, priority?: boolean) {
    if (hasPhotos) {
      return (
        <ProductPhoto
          product={product}
          image={product.images[i].url}
          priority={priority}
          className={className}
        />
      );
    }
    const color = product.colors[i];
    return (
      <ProductPhoto
        product={product}
        palette={gradientFromHex(color.hex)}
        priority={priority}
        className={className}
      />
    );
  }

  function next() {
    setIndex((index + 1) % count);
  }
  function prev() {
    setIndex((index - 1 + count) % count);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, index]);

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => {
          if (didSwipeMain.current) {
            didSwipeMain.current = false;
            return;
          }
          setLightboxOpen(true);
        }}
        onTouchStart={(e) => {
          mainTouchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (mainTouchStartX.current === null || count <= 1) return;
          const delta = e.changedTouches[0].clientX - mainTouchStartX.current;
          if (Math.abs(delta) > 40) {
            didSwipeMain.current = true;
            if (delta < 0) next();
            else prev();
          }
          mainTouchStartX.current = null;
        }}
        className="group relative block aspect-4/5 w-full overflow-hidden rounded-3xl sm:aspect-3/4"
        aria-label="Переглянути фото на весь екран"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full w-full"
          >
            {renderPhoto(index, "h-full w-full", true)}
          </motion.div>
        </AnimatePresence>
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isNew && <Badge tone="ink">Новинка</Badge>}
          {product.oldPrice && <Badge tone="accent">Знижка</Badge>}
        </div>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
          <LuExpand size={16} />
        </span>
      </button>

      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={hasPhotos ? product.images[i].publicId : product.colors[i].name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={hasPhotos ? `Фото ${i + 1}` : product.colors[i].name}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-24 sm:w-20",
                i === index ? "border-ink" : "border-transparent"
              )}
            >
              {renderPhoto(i, "h-full w-full")}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-ink/90 p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              aria-label="Закрити перегляд"
              className="absolute right-5 top-5 z-10 text-paper transition-opacity hover:opacity-70"
              onClick={() => setLightboxOpen(false)}
            >
              <LuX size={28} />
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Попереднє фото"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-2 text-paper transition-opacity hover:opacity-70 sm:left-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                >
                  <LuChevronLeft size={32} />
                </button>
                <button
                  type="button"
                  aria-label="Наступне фото"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-2 text-paper transition-opacity hover:opacity-70 sm:right-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                >
                  <LuChevronRight size={32} />
                </button>
              </>
            )}

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-3/4 h-full max-h-[80vh] w-auto max-w-full overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (touchStartX.current === null || count <= 1) return;
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(delta) > 40) {
                  if (delta < 0) next();
                  else prev();
                }
                touchStartX.current = null;
              }}
            >
              {renderPhoto(index, "h-full w-full")}
            </motion.div>

            {count > 1 && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-paper/80">
                {hasPhotos ? `${index + 1}/${count}` : `${activeColor.name} — ${index + 1}/${count}`}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
