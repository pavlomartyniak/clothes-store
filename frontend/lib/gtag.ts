declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type GtagItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price: number;
  quantity?: number;
};

/** No-op outside production / before gtag.js has loaded. */
function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push(args);
}

export function trackEvent(name: string, params: Record<string, unknown>) {
  gtag("event", name, params);
}

export function ecommerceItem(params: {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  quantity?: number;
}): GtagItem {
  return {
    item_id: params.id,
    item_name: params.name,
    item_brand: params.brand || undefined,
    item_category: params.category || undefined,
    price: params.price,
    quantity: params.quantity,
  };
}
