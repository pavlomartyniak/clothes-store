import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { LinkButton } from "@/components/ui/Button";
import { Product } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";

export function Hero({ products }: { products: Product[] }) {
  const featured =
    products.find((p) => p.slug === "trenchcoat-klasychnyi") ?? products[0];
  const secondary =
    products.find((p) => p.slug === "sukhnya-vechirnya-atlas") ??
    products[1] ??
    products[0];

  if (!featured || !secondary) return null;

  return (
    <section className="container-page grid gap-4 pt-8 sm:pt-12 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
      <div className="relative flex flex-col justify-end overflow-hidden rounded-3xl bg-paper-soft p-8 sm:p-12 lg:min-h-[560px]">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Image
            src="/images/sweater.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" />
        <Reveal className="relative max-w-md space-y-5 text-paper">
          <span className="text-xs uppercase tracking-[0.3em] text-paper/80">
            Осіння колекція 2026
          </span>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Стиль, що відчувається як другий одяг
          </h1>
          <p className="text-sm text-paper/85 sm:text-base">
            Продумані силуети та якісні тканини для щоденного гардеробу — від
            базових речей до вечірніх образів.
          </p>
          <LinkButton
            href="/catalog"
            size="lg"
            variant="primary"
            className="bg-paper text-ink hover:bg-accent hover:text-paper"
          >
            Перейти до каталогу
            <LuArrowRight size={18} />
          </LinkButton>
        </Reveal>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="relative flex flex-col justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[268px]">
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <Image
              src="/images/jacket.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
          <div className="relative space-y-2 text-paper">
            <span className="text-xs uppercase tracking-widest text-paper/80">
              Вечірній вихід
            </span>
            <h2 className="font-display text-2xl">Одяг для особливих подій</h2>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-line bg-paper p-6 sm:min-h-[268px]">
          <div>
            <span className="text-xs uppercase tracking-widest text-ink-soft">
              Знижки до 25%
            </span>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Розпродаж минулого сезону
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Обмежена кількість розмірів — встигніть обрати свій.
            </p>
          </div>
          <LinkButton
            href="/catalog?sort=discount"
            variant="secondary"
            className="self-start"
          >
            Дивитись знижки
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
