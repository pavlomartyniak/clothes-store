import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Обмін і повернення — Martosoli",
  description: "Умови обміну та повернення товарів у Martosoli.",
  alternates: { canonical: `${siteUrl}/returns` },
};

export default function ReturnsPage() {
  return (
    <div className="container-page max-w-2xl py-16 sm:py-20">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Обмін і повернення</h1>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-ink">Умови повернення</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Відповідно до законодавства про захист прав споживачів, товар
          належної якості можна повернути або обміняти протягом 14 днів з
          моменту отримання, якщо він не був у використанні, збережено його
          товарний вигляд, споживчі властивості, ярлики та оригінальну
          упаковку.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Як оформити обмін або повернення</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Напишіть на hello@martosoli.ua або зателефонуйте на +380 (44) 123 45 67,
          вкажіть номер замовлення та причину звернення — ми надішлемо
          інструкції та адресу для відправлення Новою поштою.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Повернення коштів</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Кошти повертаємо тим самим способом, яким було здійснено оплату,
          протягом кількох робочих днів після отримання й перевірки товару.
        </p>
      </section>
    </div>
  );
}
