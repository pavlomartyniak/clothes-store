import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import { getBrands, getProducts } from "@/lib/products";
import { brandSlug } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import { truncate } from "@/lib/seo";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { collectionPageSchema } from "@/lib/schema";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

async function getBrandProducts(slug: string) {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const brand = brands.find((b) => b.slug === slug);
  const matches = products.filter((p) => brandSlug(p.brand) === slug);
  return { brand, matches };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const { brand } = await getBrandProducts(slug);
  if (!brand) return {};

  return {
    title: truncate(`${brand.name} оригінал купити в Україні — Martosoli`, 60),
    description: truncate(
      `Оригінальні речі ${brand.name} в каталозі Martosoli. Доставка Новою поштою по всій Україні, огляд і примірка при отриманні.`,
      160
    ),
    alternates: { canonical: `${siteUrl}/brand/${slug}` },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const { brand, matches } = await getBrandProducts(slug);
  if (!brand) notFound();
  const brandUrl = `${siteUrl}/brand/${slug}`;

  return (
    <div className="container-page py-10 sm:py-14">
      <JsonLd
        data={collectionPageSchema(
          brand.name,
          brandUrl,
          matches.map((p) => `${siteUrl}/product/${encodeURIComponent(p.slug)}`)
        )}
      />
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
              src={optimizedImageUrl(brand.imageUrl)}
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

      {brand.content && (
        <section className="mx-auto mt-16 max-w-3xl space-y-4 border-t border-line pt-10 text-sm leading-relaxed text-ink-soft">
          {brand.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      )}
    </div>
  );
}
