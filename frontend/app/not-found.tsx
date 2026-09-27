import Link from "next/link";
import { getCategories } from "@/lib/products";
import { NotFoundSearch } from "@/components/layout/NotFoundSearch";

export const metadata = {
  title: "Сторінку не знайдено — Martosoli",
};

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <span className="font-display text-6xl text-ink">404</span>
      <h1 className="mt-4 font-display text-2xl text-ink sm:text-3xl">
        Такої сторінки не існує
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        Можливо, вона застаріла або адресу введено з помилкою. Спробуйте пошук
        або перейдіть у потрібну категорію.
      </p>

      <div className="mt-8 w-full">
        <NotFoundSearch />
      </div>

      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <Link href="/" className="mt-10 text-sm font-medium text-accent hover:underline">
        На головну
      </Link>
    </div>
  );
}
