import Link from "next/link";
import { notFound } from "next/navigation";
import { LuChevronRight } from "react-icons/lu";
import { getProductById, getProducts, getRelatedProducts } from "@/lib/products";
import { categoryName, categorySlug } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductViewer } from "@/components/product/ProductViewer";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} — SILUET`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = getRelatedProducts(product, allProducts);

  return (
    <div className="container-page py-8 sm:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">Головна</Link>
        <LuChevronRight size={12} />
        <Link
          href={`/catalog?category=${encodeURIComponent(categorySlug(product.category))}`}
          className="hover:text-ink"
        >
          {categoryName(product.category)}
        </Link>
        <LuChevronRight size={12} />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductViewer product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="mb-8 font-display text-2xl text-ink">Вам також сподобається</h2>
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
