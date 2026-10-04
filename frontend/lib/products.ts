import { apiGet } from "./api";
import {
  Brand,
  brandName as getBrandName,
  brandSlug as getBrandSlug,
  Category,
  categorySlug as getCategorySlug,
  Product,
  Subcategory,
} from "./types";

export async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products");
}

export async function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>("/categories");
}

export async function getBrands(): Promise<Brand[]> {
  return apiGet<Brand[]>("/brands");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    return await apiGet<Product>(`/products/${encodeURIComponent(id)}`);
  } catch {
    return undefined;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    return await apiGet<Product>(`/products/slug/${encodeURIComponent(slug)}`);
  } catch {
    return undefined;
  }
}

const MONGO_ID_PATTERN = /^[0-9a-f]{24}$/i;

export function isMongoId(value: string): boolean {
  return MONGO_ID_PATTERN.test(value);
}

/** Shoppers search by brand as much as by garment type, so a same-brand
 * match is shown first; the rest of the shelf fills in with same-category
 * items, without repeating a product in both groups. */
export function getRelatedProducts(product: Product, allProducts: Product[], limit = 4) {
  const categorySlug = getCategorySlug(product.category);
  const brandSlugValue = getBrandSlug(product.brand);

  const sameBrand = brandSlugValue
    ? allProducts.filter((p) => p._id !== product._id && getBrandSlug(p.brand) === brandSlugValue)
    : [];

  const sameCategory = allProducts.filter(
    (p) =>
      p._id !== product._id &&
      getCategorySlug(p.category) === categorySlug &&
      !sameBrand.some((b) => b._id === p._id)
  );

  return [...sameBrand, ...sameCategory].slice(0, limit);
}

const LETTER_SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export function sortSizes(sizes: string[]) {
  return [...sizes].sort((a, b) => {
    const aLetter = LETTER_SIZE_ORDER.indexOf(a.toUpperCase());
    const bLetter = LETTER_SIZE_ORDER.indexOf(b.toUpperCase());
    if (aLetter !== -1 && bLetter !== -1) return aLetter - bLetter;
    if (aLetter !== -1) return -1;
    if (bLetter !== -1) return 1;
    if (a === "one size") return 1;
    if (b === "one size") return -1;
    const aNum = Number(a);
    const bNum = Number(b);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });
}

/** Subcategories (name + slug) available for a category, or across all
 * categories (deduplicated by slug) when no category is selected. */
export function getSubcategories(categories: Category[], activeCategorySlug?: string): Subcategory[] {
  const scoped = activeCategorySlug
    ? categories.filter((c) => c.slug === activeCategorySlug)
    : categories;
  const bySlug = new Map<string, Subcategory>();
  scoped.forEach((c) => c.subcategories.forEach((s) => bySlug.set(s.slug, s)));
  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

export function getAvailableSizes(
  products: Product[],
  activeCategorySlug?: string,
  activeSubcategorySlugs?: string[]
) {
  let scoped = activeCategorySlug
    ? products.filter((p) => getCategorySlug(p.category) === activeCategorySlug)
    : products;
  if (activeSubcategorySlugs && activeSubcategorySlugs.length > 0) {
    scoped = scoped.filter(
      (p) => !!p.subcategory && activeSubcategorySlugs.includes(p.subcategory)
    );
  }
  const sizes = new Set<string>();
  scoped.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return sortSizes(Array.from(sizes));
}

export function getAvailableBrands(products: Product[], activeCategorySlug?: string) {
  const scoped = activeCategorySlug
    ? products.filter((p) => getCategorySlug(p.category) === activeCategorySlug)
    : products;
  const bySlug = new Map<string, string>();
  scoped.forEach((p) => {
    const slug = getBrandSlug(p.brand);
    const name = getBrandName(p.brand);
    if (slug && name) bySlug.set(slug, name);
  });
  return Array.from(bySlug, ([slug, name]) => ({ slug, name })).sort((a, b) =>
    a.name.localeCompare(b.name, "uk")
  );
}

export function getPriceBounds(products: Product[]) {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
