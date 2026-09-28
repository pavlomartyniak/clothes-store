import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import {
  getProductById,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  isMongoId,
} from "@/lib/products";
import { categoryName, categorySlug } from "@/lib/types";
import { siteUrl } from "@/lib/site";
import { truncate } from "@/lib/seo";
import { ogImageUrl } from "@/lib/cloudinary";
import { formatPrice } from "@/lib/utils";
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductViewer } from "@/components/product/ProductViewer";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

/** Old links used the Mongo _id; resolves either an id or the real slug. */
async function resolveProduct(param: string) {
  const bySlug = await getProductBySlug(param);
  if (bySlug) return bySlug;
  if (isMongoId(param)) return getProductById(param);
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const product = await resolveProduct(decodeURIComponent(rawSlug));
  if (!product) return {};

  const title = `${product.name} — Martosoli`;
  const description = truncate(
    `Оригінальний 1:1 ${product.name} — купити в Україні за ${formatPrice(product.price)} в Martosoli. Доставка Новою поштою по всій Україні, огляд і примірка при отриманні.`,
    160,
  );
  const image = product.images[0]?.url;
  const ogImages = image ? [{ url: ogImageUrl(image), width: 1200, height: 630 }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
    },
    openGraph: {
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": "UAH",
      "product:availability": product.soldOut ? "out of stock" : "in stock",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const param = decodeURIComponent(rawSlug);

  const bySlug = await getProductBySlug(param);
  const product =
    bySlug ?? (isMongoId(param) ? await getProductById(param) : undefined);
  if (!product) notFound();
  if (!bySlug)
    permanentRedirect(`/product/${encodeURIComponent(product.slug)}`);

  const allProducts = await getProducts();
  const related = getRelatedProducts(product, allProducts, 8);
  const categorySlugValue = categorySlug(product.category);
  const productUrl = `${siteUrl}/product/${encodeURIComponent(product.slug)}`;

  return (
    <div className="container-page py-8 sm:py-12">
      <JsonLd data={productSchema(product, productUrl)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Головна", url: siteUrl },
          {
            name: categoryName(product.category),
            url: `${siteUrl}/${categorySlugValue}`,
          },
          { name: product.name, url: productUrl },
        ])}
      />
      <nav className="mb-6 flex items-center gap-1.5 overflow-hidden text-xs text-ink-soft">
        <Link href="/" className="shrink-0 hover:text-ink">
          Головна
        </Link>
        <LuChevronRight size={12} className="shrink-0" />
        <Link
          href={`/${encodeURIComponent(categorySlugValue)}`}
          className="shrink-0 hover:text-ink"
        >
          {categoryName(product.category)}
        </Link>
        <LuChevronRight size={12} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductViewer product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8 font-display text-2xl text-ink">
            Вам також сподобається
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, index) => (
              <Reveal key={p._id} delay={index * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
