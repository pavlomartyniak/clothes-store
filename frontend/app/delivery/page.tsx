export const metadata = {
  title: "Доставка та оплата — Martosoli",
  description:
    "Умови доставки Новою поштою та способи оплати замовлень у Martosoli.",
};

export default function DeliveryPage() {
  return (
    <div className="container-page max-w-2xl py-16 sm:py-20">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Доставка та оплата</h1>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-ink">Доставка</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Відправляємо замовлення протягом 1 робочого дня після підтвердження.
          Доставка Новою поштою — у відділення або поштомат, а також кур&apos;єром
          за вказаною адресою. Термін доставки — 1–3 дні залежно від міста.
        </p>
        <p className="text-sm leading-relaxed text-ink-soft">
          На відділенні Нової пошти можна оглянути та приміряти товар перед
          оплатою.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Оплата</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Доступні два способи оплати: оплата карткою онлайн під час
          оформлення замовлення або оплата при отриманні (накладений платіж
          Нової пошти).
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Питання щодо замовлення</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Зв&apos;яжіться з нами за телефоном +380 (44) 123 45 67 або на пошту
          hello@martosoli.ua — відповідаємо у робочі дні.
        </p>
      </section>
    </div>
  );
}
