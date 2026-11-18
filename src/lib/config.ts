/**
 * Shop-wide settings. Change these in one place.
 * All money values are in piasters (1/100 of an Egyptian pound): 899900 = EGP 8,999.
 */
export const SHOP = {
  name: "Fast Suit",
  currency: "EGP",
  /** Orders at or above this subtotal get free delivery. */
  freeShippingThreshold: 1000000,
  /** Delivery fee per zone. Each governorate belongs to a zone (see src/lib/egypt.ts). */
  shippingByZone: {
    cairo: 7500, // Cairo, Giza, Qalyubia
    delta: 9500, // Alexandria, Delta and Canal cities
    upper: 12000, // Upper Egypt, Red Sea, Sinai, Matrouh, New Valley
  },
  maxQuantityPerItem: 10,
} as const;

export type ShippingZone = keyof typeof SHOP.shippingByZone;

/**
 * How customers can pay. Cash on delivery works now.
 * To add Paymob later, add "paymob" here and handle it in src/app/api/orders/route.ts.
 */
export const PAYMENT_METHODS = ["cod"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const SIZES = ["44", "46", "48", "50", "52", "54", "56", "58"] as const;
export type Size = (typeof SIZES)[number];

export const FITS = ["slim", "regular"] as const;
export type Fit = (typeof FITS)[number];

export const OCCASIONS = ["business", "wedding", "evening", "summer"] as const;
export type Occasion = (typeof OCCASIONS)[number];
