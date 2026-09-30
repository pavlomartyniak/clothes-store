// Everything that needs an absolute URL (sitemap, robots, metadataBase,
// canonical tags) reads from here. Override with NEXT_PUBLIC_SITE_URL for
// previews/non-prod hosts.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://martosoli.com";
