import Link from "next/link";
import { LuInstagram, LuFacebook, LuMail, LuPhone } from "react-icons/lu";
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

          <div className="flex gap-3 pt-1">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <LuInstagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <LuFacebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">Каталог</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog?category=${encodeURIComponent(c.slug)}`}
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
              <span>Доставка та оплата</span>
            </li>
            <li>
              <span>Обмін і повернення</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">Контакти</h4>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <LuPhone size={15} /> +380 (44) 123 45 67
            </li>
            <li className="flex items-center gap-2">
              <LuMail size={15} /> hello@maison.ua
            </li>
            <li>Київ, вул. Хрещатик, 1</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} Maison. Усі права захищені.</span>
          <span>Дизайн і розробка — власна команда Maison</span>
        </div>
      </div>
    </footer>
  );
}
