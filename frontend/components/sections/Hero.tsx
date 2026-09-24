import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { LinkButton } from "@/components/ui/Button";
import { Product } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";

export function Hero({ products }: { products: Product[] }) {
  const featured =
    products.find((p) => p.slug === "trenchcoat-klasychnyi") ?? products[0];

  if (!featured) return null;

  return (
    <section className="container-page pt-8 sm:pt-12">
      <div className="relative flex flex-col justify-end overflow-hidden rounded-3xl bg-paper-soft p-8 sm:p-12 lg:min-h-[560px]">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Image
            src="/images/hero.jpg"
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
    </section>
  );
}
