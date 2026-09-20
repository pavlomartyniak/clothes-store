function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hex: string, target: number, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const t = (channel: number) => channel + (target - channel) * amount;
  return rgbToHex(t(r), t(g), t(b));
}

export function gradientFromHex(hex: string): [string, string] {
  return [mix(hex, 255, 0.22), mix(hex, 0, 0.32)];
}

export function getProductPalette(product: { colors: { hex: string }[] }): [string, string] {
  return gradientFromHex(product.colors[0]?.hex ?? "#9C9C9A");
}
