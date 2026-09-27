import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import { getBrands, getCategories, getProducts } from "@/lib/products";
import { brandSlug, categorySlug } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import { truncate } from "@/lib/seo";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60;

async function getCategoryAndBrand(categorySlugParam: string, brandSlugParam: string) {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  const category = categories.find((c) => c.slug === categorySlugParam);
  const brand = brands.find((b) => b.slug === brandSlugParam);
  return { category, brand };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category: rawCategory, brand: rawBrand } = await params;
  const { category, brand } = await getCategoryAndBrand(
    decodeURIComponent(rawCategory),
    decodeURIComponent(rawBrand)
  );
  if (!category || !brand) return {};

  return {
    title: truncate(`${category.name} ${brand.name} купити в Києві та Україні — Martosoli`, 60),
    description: truncate(
      `${category.name} бренду ${brand.name} в каталозі Martosoli. Доставка Новою поштою по всій Україні, огляд і примірка при отриманні.`,
      160
    ),
    alternates: { canonical: `${siteUrl}/${category.slug}/${brand.slug}` },
  };
}

export default async function CategoryBrandPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category: rawCategory, brand: rawBrand } = await params;
  const categorySlugParam = decodeURIComponent(rawCategory);
  const brandSlugParam = decodeURIComponent(rawBrand);
  const [{ category, brand }, products] = await Promise.all([
    getCategoryAndBrand(categorySlugParam, brandSlugParam),
    getProducts(),
  ]);
  if (!category || !brand) notFound();

  const list = products.filter(
    (p) => categorySlug(p.category) === categorySlugParam && brandSlug(p.brand) === brandSlugParam
  );

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">Головна</Link>
        <LuChevronRight size={12} />
        <Link href={`/${category.slug}`} className="hover:text-ink">{category.name}</Link>
        <LuChevronRight size={12} />
        <span className="text-ink">{brand.name}</span>
      </nav>

      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-accent">Каталог</span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          {category.name} — {brand.name}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{list.length} товарів</p>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          У цій категорії поки немає товарів цього бренду.
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
