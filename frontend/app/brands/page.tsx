import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Бренди — Martosoli",
  description: "Усі бренди, представлені в каталозі Martosoli.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest text-accent">Martosoli</span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Бренди</h1>
      </div>

      {brands.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          Бренди з&apos;являться тут, щойно їх додадуть у каталог.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-line p-6 text-center transition-colors hover:border-ink"
            >
              <div className="relative flex h-16 w-full items-center justify-center">
                {brand.imageUrl ? (
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <span className="font-display text-xl text-ink">{brand.name}</span>
                )}
              </div>
              {brand.imageUrl && (
                <span className="text-sm font-medium text-ink-soft group-hover:text-ink">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
