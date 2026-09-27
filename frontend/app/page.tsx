import { Hero } from "@/components/sections/Hero";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { BestSellers } from "@/components/sections/BestSellers";
import { ValueProps } from "@/components/sections/ValueProps";
import { Newsletter } from "@/components/sections/Newsletter";
import { getCategories, getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site";
import { organizationAndWebsiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: siteUrl },
};

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      {organizationAndWebsiteSchema().map((schema) => (
        <JsonLd key={schema["@type"]} data={schema} />
      ))}
      <Hero products={products} />
      <CategoryShowcase categories={categories} products={products} />
      <BestSellers products={products} />
      <ValueProps />
      <Newsletter />
    </>
  );
}
