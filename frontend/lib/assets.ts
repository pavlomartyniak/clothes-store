const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const ASSET_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** Turns a relative "/uploads/xxx.jpg" path from the backend into an
 * absolute URL the browser (or next/image) can load directly. */
export function getAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${ASSET_ORIGIN}${path}`;
}
