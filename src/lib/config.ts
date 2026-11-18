/**
 * Shop-wide settings. Change these in one place.
 * All money values are in cents (e.g. 29900 = €299.00).
 */
export const SHOP = {
  name: "Fast Suit",
  currency: "eur",
  /** Orders at or above this subtotal get free standard shipping. */
  freeShippingThreshold: 30000,
  standardShipping: 990,
  expressShipping: 1990,
  maxQuantityPerItem: 10,
  /** Countries customers can ship to (ISO codes). Edit to match where you deliver. */
  shippingCountries: [
    "DE", "AT", "CH", "NL", "BE", "LU", "FR", "IT", "ES", "DK", "SE", "PL",
    "SA", "AE", "QA", "KW", "BH", "OM", "JO", "TR",
  ],
} as const;

export const SIZES = ["44", "46", "48", "50", "52", "54", "56", "58"] as const;
export type Size = (typeof SIZES)[number];

export const FITS = ["slim", "regular"] as const;
export type Fit = (typeof FITS)[number];

export const OCCASIONS = ["business", "wedding", "evening", "summer"] as const;
export type Occasion = (typeof OCCASIONS)[number];
