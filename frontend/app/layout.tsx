import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ProductsProvider } from "@/lib/products-context";
import { getCategories, getProducts } from "@/lib/products";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "SILUET — сучасний одяг для щоденного стилю",
  description:
    "SILUET — інтернет-магазин одягу для жінок, чоловіків та дітей. Якісні тканини, продумана посадка, швидка доставка по Україні.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <html
      lang="uk"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <Providers>
          <ProductsProvider products={products}>
            <CartProvider>
              <Header categories={categories} />
              <main className="flex-1">{children}</main>
              <Footer categories={categories} />
              <CartDrawer />
            </CartProvider>
          </ProductsProvider>
        </Providers>
      </body>
    </html>
  );
}
