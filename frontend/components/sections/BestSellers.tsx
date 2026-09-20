import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export function BestSellers({ products }: { products: Product[] }) {
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="border-t border-line bg-paper-soft py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent">Бестселери</span>
            <h2 className="mt-2 font-display text-3xl text-ink">Обирають найчастіше</h2>
          </div>
          <Link
            href="/catalog"
            className="hidden items-center gap-1 text-sm font-medium text-ink hover:text-accent sm:flex"
          >
            Весь каталог <LuArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {bestsellers.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.08}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
