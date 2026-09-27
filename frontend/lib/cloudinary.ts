/**
 * Injects a Cloudinary delivery transform into an existing Cloudinary URL by
 * splicing it in right after "/upload/". No-op for non-Cloudinary URLs (e.g.
 * local /images/* assets) since they don't have an "/upload/" segment.
 */
function withTransform(url: string, transform: string): string {
  const marker = "/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return url;
  const splitAt = index + marker.length;
  return `${url.slice(0, splitAt)}${transform}/${url.slice(splitAt)}`;
}

/** Automatic format (WebP/AVIF where supported) and quality — no fixed size. */
export function optimizedImageUrl(url: string): string {
  return withTransform(url, "f_auto,q_auto");
}

/** A fixed-size crop for Open Graph/Twitter card images (1200×630). */
export function ogImageUrl(url: string): string {
  return withTransform(url, "f_auto,q_auto,c_fill,w_1200,h_630");
}
