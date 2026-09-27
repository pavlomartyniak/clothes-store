import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight, LuSlidersHorizontal } from "react-icons/lu";
import { getCategories, getProducts } from "@/lib/products";
import { categorySlug } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} — Martosoli`,
    description:
      category.description ?? `${category.name} — каталог Martosoli. Якісні тканини, швидка доставка по Україні.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const list = products.filter((p) => categorySlug(p.category) === slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">Головна</Link>
        <LuChevronRight size={12} />
        <span className="text-ink">{category.name}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent">Каталог</span>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-1 text-sm text-ink-soft">{category.description}</p>
          )}
        </div>
        <Link
          href={`/catalog?category=${encodeURIComponent(slug)}`}
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <LuSlidersHorizontal size={15} />
          Фільтри й сортування
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          У цій категорії поки немає товарів.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {list.map((product, index) => (
            <Reveal key={product._id} delay={(index % 4) * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
