import { Product, brandName } from "./types";
import { siteUrl } from "./site";
import { optimizedImageUrl } from "./cloudinary";
import { getAssetUrl } from "./assets";

/**
 * Real policy (see /returns): the buyer inspects the parcel at the Nova
 * Poshta branch before accepting it and can refuse it there with no
 * conditions attached — but once accepted, it isn't returnable. Schema.org
 * doesn't have a vocabulary slot for "inspect before you accept", only for a
 * post-acceptance return window, so MerchantReturnNotPermitted is the
 * accurate mapping for what happens after acceptance; the pre-acceptance
 * inspection right is explained in prose via merchantReturnLink.
 *
 * No OfferShippingDetails here deliberately — the store doesn't charge or
 * quote a shipping price through this system (Nova Poshta bills the
 * recipient directly), so there's no honest rate to publish.
 */
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  merchantReturnLink: `${siteUrl}/returns`,
  applicableCountry: "UA",
};

export function productSchema(product: Product, url: string) {
  const brand = brandName(product.brand);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => optimizedImageUrl(getAssetUrl(img.url))),
    description: product.description,
    sku: product._id,
    url,
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(product.material ? { material: product.material } : {}),
    ...(product.sizes.length > 0 ? { size: product.sizes.join(", ") } : {}),
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "UAH",
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      hasMerchantReturnPolicy: RETURN_POLICY,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function collectionPageSchema(name: string, url: string, productUrls: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: productUrls.map((itemUrl, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: itemUrl,
      })),
    },
  };
}

/** Homepage only. No sameAs (no real social links yet) or telephone (no
 * real number yet) — better omitted than pointing at placeholders. */
export function organizationAndWebsiteSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Martosoli",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Martosoli",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/catalog?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}
