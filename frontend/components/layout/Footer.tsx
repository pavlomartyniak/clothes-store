import Link from "next/link";
import { LuMail } from "react-icons/lu";
import { Category } from "@/lib/types";
import { Logo } from "./Logo";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t border-line bg-paper-soft">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <span className="font-display text-2xl text-ink">
            <Logo />
          </span>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">Каталог</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/${encodeURIComponent(c.slug)}`}
                  className="hover:text-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">Покупцям</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li>
              <Link href="/cart" className="hover:text-ink">
                Кошик
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-ink">
                Оформлення замовлення
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:text-ink">
                Доставка та оплата
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-ink">
                Обмін і повернення
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">Контакти</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <LuMail size={15} /> hello@martosoli.ua
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} Martosoli. Усі права захищені.</span>
          <span>Дизайн і розробка — власна команда Martosoli</span>
        </div>
      </div>
    </footer>
  );
}
