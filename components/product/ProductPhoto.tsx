import Image from "next/image";
import { LuShirt } from "react-icons/lu";
import { Product } from "@/lib/types";
import { getProductPalette } from "@/lib/color";
import { getAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

export function ProductPhoto({
  product,
  className,
  priority,
  palette,
  image,
}: {
  product: Pick<Product, "name" | "colors" | "images">;
  className?: string;
  priority?: boolean;
  palette?: [string, string];
  /** Override which uploaded photo to show; defaults to the product's first. */
  image?: string | null;
}) {
  const photo = image === undefined ? product.images[0]?.url : image;

  if (photo) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={getAssetUrl(photo)}
          alt={product.name}
          fill
          priority={priority}
          unoptimized
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  const [from, to] = palette ?? getProductPalette(product);
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{
        background: `linear-gradient(155deg, ${from}, ${to})`,
      }}
      aria-hidden={priority ? undefined : true}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <LuShirt
        className="h-1/3 w-1/3 text-white/40"
        strokeWidth={1}
        aria-label={product.name}
      />
    </div>
  );
}
