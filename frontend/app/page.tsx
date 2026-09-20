import { Hero } from "@/components/sections/Hero";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { BestSellers } from "@/components/sections/BestSellers";
import { ValueProps } from "@/components/sections/ValueProps";
import { Newsletter } from "@/components/sections/Newsletter";
import { getCategories, getProducts } from "@/lib/products";

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <Hero products={products} />
      <CategoryShowcase categories={categories} products={products} />
      <BestSellers products={products} />
      <ValueProps />
      <Newsletter />
    </>
  );
}
