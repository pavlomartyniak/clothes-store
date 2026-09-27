export type Subcategory = {
  _id: string;
  name: string;
  slug: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  /** Long-form SEO body copy shown under the product grid. */
  content?: string;
  subcategories: Subcategory[];
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductImage = {
  url: string;
  publicId: string;
};

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  /** Long-form SEO body copy shown under the product grid. */
  content?: string;
};

export type Product = {
  _id: string;
  slug: string;
  name: string;
  category: Category | string | null;
  subcategory?: string;
  brand?: Brand | string | null;
  material?: string;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: ProductColor[];
  images: ProductImage[];
  isNew: boolean;
  isBestseller: boolean;
  soldOut: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartLine = {
  slug: string;
  size: string;
  color: string;
  quantity: number;
};

export function categorySlug(category: Product["category"]): string {
  if (!category) return "";
  return typeof category === "string" ? category : category.slug;
}

export function categoryName(category: Product["category"]): string {
  if (!category) return "";
  return typeof category === "string" ? category : category.name;
}

export function brandSlug(brand: Product["brand"]): string {
  if (!brand) return "";
  return typeof brand === "string" ? brand : brand.slug;
}

export function brandName(brand: Product["brand"]): string {
  if (!brand) return "";
  return typeof brand === "string" ? brand : brand.name;
}
