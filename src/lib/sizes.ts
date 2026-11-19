import { SIZES, type Size } from "./config";

type Range = [number, number];

export type SizeInfo = {
  /** Letter size shoppers in Egypt also use (S, M, L, XL…). */
  letter: string;
  /** Typical body weight for this size in Regular fit, in kg. */
  weight: Range;
  /** Typical height for this size, in cm. */
  height: Range;
  chest: Range;
  waist: Range;
  /** Matching trouser (jeans) waist size in inches. */
  trousers: string;
};

/**
 * Size chart. These are guide values: adjust them to the real measurements
 * of your suits once you have them from your supplier or tailor.
 */
export const SIZE_INFO: Record<Size, SizeInfo> = {
  "44": { letter: "XS", weight: [50, 62], height: [160, 172], chest: [86, 89], waist: [74, 77], trousers: "30" },
  "46": { letter: "S", weight: [62, 70], height: [165, 175], chest: [90, 93], waist: [78, 81], trousers: "31–32" },
  "48": { letter: "M", weight: [70, 78], height: [168, 178], chest: [94, 97], waist: [82, 85], trousers: "33" },
  "50": { letter: "L", weight: [78, 86], height: [170, 182], chest: [98, 101], waist: [86, 89], trousers: "34–35" },
  "52": { letter: "XL", weight: [86, 94], height: [172, 185], chest: [102, 105], waist: [90, 93], trousers: "36" },
  "54": { letter: "2XL", weight: [94, 102], height: [174, 188], chest: [106, 109], waist: [94, 97], trousers: "37–38" },
  "56": { letter: "3XL", weight: [102, 110], height: [175, 190], chest: [110, 113], waist: [98, 101], trousers: "39–40" },
  "58": { letter: "4XL", weight: [110, 122], height: [175, 192], chest: [114, 117], waist: [102, 105], trousers: "41–42" },
};

/** "48 (M)" */
export function sizeLabel(size: Size) {
  return `${size} (${SIZE_INFO[size].letter})`;
}

export type SizeSuggestion =
  | { status: "ok"; size: Size; tallerSize?: Size }
  | { status: "outOfRange" };

/** Suggests a size from weight (kg) and height (cm). */
export function suggestSize(weight: number, height: number): SizeSuggestion {
  if (!(weight >= 45 && weight <= 125 && height >= 150 && height <= 205)) return { status: "outOfRange" };

  const index = SIZES.findIndex((s) => weight <= SIZE_INFO[s].weight[1]);
  if (index === -1) return { status: "outOfRange" };

  const size = SIZES[index];
  const next = SIZES[index + 1];
  // Tall for this size: sleeves and jacket length may feel short, so mention the next size.
  const tallerSize = next && height > SIZE_INFO[size].height[1] ? next : undefined;
  return { status: "ok", size, tallerSize };
}
