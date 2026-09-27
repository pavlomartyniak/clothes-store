import type { Metadata } from "next";
import { Inter, Pinyon_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { getBrands, getCategories, getProducts } from "@/lib/products";
import { brandSlug } from "@/lib/types";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { siteUrl } from "@/lib/site";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

// Used only for the "A" in the Martosoli wordmark (components/layout/Logo.tsx) —
// Latin-only glyph, so no cyrillic subset needed.
const scriptFont = Pinyon_Script({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

export const revalidate = 60;

const defaultTitle = "Martosoli — оригінальний одяг люксових брендів";
const defaultDescription =
  "Martosoli — оригінальний одяг преміальних брендів: Chanel, Gucci, Prada, Dior та інші. Доставка Новою поштою по всій Україні, огляд при отриманні.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultTitle,
  description: defaultDescription,
  openGraph: {
    siteName: "Martosoli",
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    locale: "uk_UA",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  const productCountBySlug = new Map<string, number>();
  for (const product of products) {
    const slug = brandSlug(product.brand);
    if (!slug) continue;
    productCountBySlug.set(slug, (productCountBySlug.get(slug) ?? 0) + 1);
  }
  const topBrands = [...brands]
    .sort((a, b) => (productCountBySlug.get(b.slug) ?? 0) - (productCountBySlug.get(a.slug) ?? 0))
    .slice(0, 6);

  return (
    <html
      lang="uk"
      className={`${bodyFont.variable} ${displayFont.variable} ${scriptFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <Providers>
          <ProductsProvider products={products}>
            <CartProvider>
              <Header categories={categories} />
              <main className="flex-1">{children}</main>
              <Footer categories={categories} brands={topBrands} />
              <CartDrawer />
            </CartProvider>
          </ProductsProvider>
        </Providers>
      </body>
    </html>
  );
}
