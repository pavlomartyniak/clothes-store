import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { Category, categorySlug, Product } from "@/lib/types";
import { ProductPhoto } from "@/components/product/ProductPhoto";
import { Reveal } from "@/components/motion/Reveal";

export function CategoryShowcase({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent">Категорії</span>
          <h2 className="mt-2 font-display text-3xl text-ink">Обирайте за напрямом</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => {
          const sample = products.find((p) => categorySlug(p.category) === category.slug);
          if (!sample) return null;
          return (
            <Reveal key={category.slug} delay={index * 0.08}>
              <Link
                href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                className="group relative flex aspect-3/4 flex-col justify-end overflow-hidden rounded-2xl"
              >
                <ProductPhoto
                  product={sample}
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="relative flex items-center justify-between p-5 text-paper">
                  <div>
                    <h3 className="font-display text-xl">{category.name}</h3>
                    <p className="text-xs text-paper/80">{category.description}</p>
                  </div>
                  <LuArrowUpRight
                    size={20}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
