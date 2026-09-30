import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Обмін і повернення — Martosoli",
  description:
    "Огляд товару на відділенні Нової пошти перед отриманням. Після отримання товар поверненню не підлягає.",
  alternates: { canonical: `${siteUrl}/returns` },
};

export default function ReturnsPage() {
  return (
    <div className="container-page max-w-2xl py-16 sm:py-20">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Обмін і повернення
      </h1>

      <section className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-ink">
          Огляд перед отриманням
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Усі замовлення відправляються Новою поштою. На відділенні ви можете
          оглянути товар до того, як прийняти й оплатити посилку — перевірте
          розмір, колір і стан речі. Якщо щось не влаштовує, просто відмовтесь
          від отримання: посилку буде повернено нам, і жодних додаткових умов
          для цього не потрібно.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-ink">Після отримання</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Якщо ви прийняли й оплатили товар на відділенні, обмін чи повернення
          після цього неможливі. Тому радимо уважно оглянути річ саме в момент
          отримання, до оплати.
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
          </a>
          , вказавши номер замовлення — відповідаємо у робочі дні.
        </p>
      </section>
    </div>
  );
}
