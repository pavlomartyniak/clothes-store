import { MetadataRoute } from "next";
import { getBrands, getCategories, getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  // No real "last modified" date for these — omitted rather than stamped
  // with the build time, which Google stops trusting as a lastmod signal.
  const staticRoutes: MetadataRoute.Sitemap = ["", "/catalog", "/brands", "/delivery", "/returns"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
    })
  );

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/${category.slug}`,
    lastModified: new Date(category.updatedAt),
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${siteUrl}/brand/${brand.slug}`,
    lastModified: new Date(brand.updatedAt),
  }));

  // Sold-out products keep serving their page (never delisted/removed), but
  // aren't submitted for indexing — no point sending crawl budget at a page
  // that can't be bought from right now.
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => !product.soldOut)
    .map((product) => ({
      url: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastModified: new Date(product.updatedAt),
    }));

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
