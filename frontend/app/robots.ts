import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /cart and /checkout are per-visitor session state, not content to
      // index; /api is the BFF layer, not a page. Parameterized catalog URLs
      // (sort, size, price filters) are deliberately left crawlable — their
      // canonical tag is what tells Google which URL to index, and blocking
      // the crawl would hide that signal instead of consolidating it.
      disallow: ["/cart", "/checkout", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
