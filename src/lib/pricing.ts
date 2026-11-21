import { SHOP, type PaymentMethod } from "./config";
import { getGovernorate } from "./egypt";
import { getProduct } from "./products";

type PricedItem = { productId: string; quantity: number };

/** Used by both the browser (to show totals) and the server (to charge them). */
export function calculateTotals(items: PricedItem[], governorateId?: string) {
  const subtotal = items.reduce((sum, i) => sum + (getProduct(i.productId)?.price ?? 0) * i.quantity, 0);
  const governorate = governorateId ? getGovernorate(governorateId) : undefined;
  const freeShipping = subtotal >= SHOP.freeShippingThreshold;
  const shipping = !governorate ? null : freeShipping ? 0 : SHOP.shippingByZone[governorate.zone];
  return { subtotal, shipping, freeShipping, total: subtotal + (shipping ?? 0) };
}

/**
 * How much is paid online now and how much in cash on delivery.
 * Cash on delivery: a deposit of SHOP.codDepositPercent of the total, rounded up
 * to whole pounds, is paid online first.
 */
export function paymentSplit(total: number, method: PaymentMethod) {
  if (method === "online") return { payOnline: total, payOnDelivery: 0 };
  const deposit = Math.min(total, Math.ceil((total * SHOP.codDepositPercent) / 100 / 100) * 100);
  return { payOnline: deposit, payOnDelivery: total - deposit };
}
