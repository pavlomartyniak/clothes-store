import Link from "next/link";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Доставка та оплата — Martosoli",
  description: "Доставка Новою поштою по всій Україні.",
  alternates: { canonical: `${siteUrl}/delivery` },
};

export default function DeliveryPage() {
  return (
    <div className="container-page max-w-2xl py-16 sm:py-20">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Доставка та оплата
      </h1>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-ink">Доставка</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Доставка Новою поштою по всій Україні.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Оплата</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Доступні два способи оплати: оплата карткою онлайн під час оформлення
          замовлення або оплата при отриманні (накладений платіж Нової пошти).
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Огляд і повернення</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Повернення можливе лише під час огляду товару на відділенні Нової
          пошти, до отримання посилки. Якщо ви вже забрали посилку з відділення
          — повернути товар не можна. Детальніше на сторінці{" "}
          <Link href="/returns" className="text-accent hover:underline">
            «Обмін і повернення»
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">
          Питання щодо замовлення
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Напишіть нам у{" "}
          <a
            href="https://t.me/fuji_ft"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline"
          >
            Telegram
          </a>{" "}
          — відповідаємо у робочі дні.
        </p>
      </section>
    </div>
  );
}
