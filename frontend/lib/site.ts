// Falls back to the actual Vercel deployment until a custom domain is
// connected — set NEXT_PUBLIC_SITE_URL then. Everything that needs an
// absolute URL (sitemap, robots, metadataBase) reads from here.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://frontend-indol-delta-x35sal3cpn.vercel.app";
