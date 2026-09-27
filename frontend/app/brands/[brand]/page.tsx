import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import { getBrands, getProducts } from "@/lib/products";
import { brandSlug } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brands = await getBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};

  return {
    title: `${brand.name} — Martosoli`,
    description: `Товари бренду ${brand.name} у каталозі Martosoli.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const matches = products.filter((p) => brandSlug(p.brand) === slug);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">Головна</Link>
        <LuChevronRight size={12} />
        <Link href="/brands" className="hover:text-ink">Бренди</Link>
        <LuChevronRight size={12} />
        <span className="text-ink">{brand.name}</span>
      </nav>

      <div className="mb-8 flex items-center gap-5">
        {brand.imageUrl && (
          <div className="relative h-16 w-16 shrink-0">
            <Image
              src={brand.imageUrl}
              alt={brand.name}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}
        <div>
          <span className="text-xs uppercase tracking-widest text-accent">Бренд</span>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{brand.name}</h1>
          <p className="mt-1 text-sm text-ink-soft">{matches.length} товарів</p>
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          У цього бренду поки немає товарів.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {matches.map((product, index) => (
            <Reveal key={product._id} delay={(index % 4) * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
