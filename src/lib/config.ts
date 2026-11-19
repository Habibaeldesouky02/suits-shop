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
 * How customers can pay:
 *   cod    – cash on delivery
 *   online – the shop sends a payment link (SMS / email); the customer pays
 *            with one of ONLINE_METHODS on the payment page
 */
export const PAYMENT_METHODS = ["cod", "online"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ONLINE_METHODS = ["card", "instapay", "vodafone_cash"] as const;
export type OnlineMethod = (typeof ONLINE_METHODS)[number];

/** Names used in the order email to the shop. */
export const ONLINE_METHOD_NAMES: Record<OnlineMethod, string> = {
  card: "Card (Visa / Mastercard / Meeza)",
  instapay: "InstaPay",
  vodafone_cash: "Vodafone Cash",
};

export const SIZES = ["44", "46", "48", "50", "52", "54", "56", "58"] as const;
export type Size = (typeof SIZES)[number];

export const FITS = ["slim", "regular"] as const;
export type Fit = (typeof FITS)[number];

export const OCCASIONS = ["business", "wedding", "evening", "summer"] as const;
export type Occasion = (typeof OCCASIONS)[number];
