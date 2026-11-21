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
  /**
   * Cash on delivery: share of the total the customer pays online first as a deposit.
   * 0 = no deposit (everything is paid in cash on delivery). Set it to 10 to turn the 10% deposit on.
   */
  codDepositPercent: 10 as number,
} as const;

/** Whether cash-on-delivery orders need a deposit paid online first. */
export const COD_DEPOSIT = SHOP.codDepositPercent > 0;

export type ShippingZone = keyof typeof SHOP.shippingByZone;

/**
 * How customers can pay:
 *   cod    – cash on delivery, after a deposit (SHOP.codDepositPercent) paid online
 *   online – everything paid online
 * Online amounts (the deposit or the full total) are paid via a payment link the shop
 * sends by SMS / email; the customer pays with one of ONLINE_METHODS.
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
