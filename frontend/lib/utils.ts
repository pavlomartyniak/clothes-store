import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  // Intl's currency-symbol resolution for "UAH" can differ between the
  // server's and browser's ICU data ("грн" vs "₴"), causing a hydration
  // mismatch. Formatting only the number (stable across environments)
  // and appending a literal suffix avoids that.
  return `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value)} грн`;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
