"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuMenu, LuSearch, LuShoppingBag, LuUser, LuX } from "react-icons/lu";
import { useCart } from "@/lib/cart-context";
import { Category } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";
import { Logo } from "./Logo";

export function Header({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useMounted();
  const { totalCount, openCart } = useCart();

  const navLinks = [
    { href: "/catalog", label: "Весь каталог" },
    ...categories.map((c) => ({
      href: `/catalog?category=${encodeURIComponent(c.slug)}`,
      label: c.name,
    })),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="overflow-hidden border-b border-line bg-ink text-paper">
          <div className="animate-marquee flex w-max gap-16 py-2 text-[11px] uppercase tracking-widest">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-16">
                <span>Доставка по всій Україні Новою Поштою</span>
                <span>Огляд і примірка при отриманні на пошті</span>
                <span>Нова колекція вже в каталозі</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container-page flex items-center justify-between gap-4 py-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label="Відкрити меню"
            onClick={() => setMenuOpen(true)}
          >
            <LuMenu size={22} />
          </button>

          <Link href="/" className="font-display text-2xl tracking-wide text-ink">
            <Logo />
          </Link>

          <nav className="hidden gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Пошук"
              className="hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
            >
              <LuSearch size={19} />
            </button>
            <button
              type="button"
              aria-label="Кабінет"
              className="hidden h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink sm:flex"
            >
              <LuUser size={19} />
            </button>
            <button
              type="button"
              aria-label="Кошик"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink"
            >
              <LuShoppingBag size={19} />
              {totalCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-paper">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMenuOpen(false)}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-[80%] max-w-xs bg-paper p-6"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 320 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl">
                      <Logo />
                    </span>
                    <button aria-label="Закрити меню" onClick={() => setMenuOpen(false)}>
                      <LuX size={22} />
                    </button>
                  </div>
                  <nav className="mt-10 flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium text-ink"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
