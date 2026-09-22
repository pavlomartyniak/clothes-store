import { LuTruck, LuRotateCcw, LuShieldCheck, LuHeadphones } from "react-icons/lu";
import { Reveal } from "@/components/motion/Reveal";

const items = [
  {
    icon: LuTruck,
    title: "Швидка доставка",
    description: "1–3 дні по всій Україні Новою Поштою",
  },
  {
    icon: LuRotateCcw,
    title: "Огляд при отриманні",
    description: "Примірка і огляд товару прямо на відділенні пошти",
  },
  {
    icon: LuShieldCheck,
    title: "Гарантія якості",
    description: "Перевіряємо кожну партію тканин перед пошиттям",
  },
  {
    icon: LuHeadphones,
    title: "Підтримка щодня",
    description: "Відповідаємо в чаті та телефоном з 9:00 до 21:00",
  },
];

export function ValueProps() {
  return (
    <section className="container-page py-14">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08} className="flex flex-col items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-soft text-accent">
              <item.icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
            <p className="text-sm text-ink-soft">{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
