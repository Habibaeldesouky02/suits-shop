import { isLocale, type Locale } from "@/i18n/config";
import {
  FITS,
  ONLINE_METHODS,
  PAYMENT_METHODS,
  SHOP,
  SIZES,
  type Fit,
  type OnlineMethod,
  type PaymentMethod,
  type Size,
} from "./config";
import { getGovernorate, normalizeEgyptianMobile } from "./egypt";
import { calculateTotals } from "./pricing";
import { getProduct } from "./products";

export type OrderItem = {
  productId: string;
  name: string;
  color: string;
  size: Size;
  fit: Fit;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  number: string;
  createdAt: string;
  locale: Locale;
  paymentMethod: PaymentMethod;
  /** Set when paymentMethod is "online". */
  onlineMethod?: OnlineMethod;
  customer: { name: string; phone: string; email?: string };
  address: { governorateId: string; governorate: string; governorateAr: string; city: string; street: string; notes?: string };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

export type OrderField = "name" | "phone" | "email" | "governorate" | "city" | "street" | "items" | "payment";
type ParseResult = { order: Order } | { error: "invalid"; field: OrderField } | { error: "spam" };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function orderNumber() {
  const now = new Date();
  const date = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I to avoid confusion on the phone
  const random = crypto.getRandomValues(new Uint32Array(4));
  const code = Array.from(random, (n) => chars[n % chars.length]).join("");
  return `FS-${date}-${code}`;
}

/**
 * Checks everything the browser sent and builds the order.
 * Prices and delivery fees always come from the server, never from the browser.
 */
export function parseOrder(body: Record<string, unknown>): ParseResult {
  // Hidden field that real customers never fill in; bots often do.
  if (text(body.company, 100)) return { error: "spam" };

  const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "ar";

  const name = text(body.name, 80);
  if (name.length < 2) return { error: "invalid", field: "name" };

  const phone = normalizeEgyptianMobile(text(body.phone, 30));
  if (!phone) return { error: "invalid", field: "phone" };

  const email = text(body.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "invalid", field: "email" };

  const governorate = getGovernorate(text(body.governorate, 40));
  if (!governorate) return { error: "invalid", field: "governorate" };

  const city = text(body.city, 80);
  if (city.length < 2) return { error: "invalid", field: "city" };

  const street = text(body.street, 200);
  if (street.length < 5) return { error: "invalid", field: "street" };

  const notes = text(body.notes, 500);

  const paymentMethod = PAYMENT_METHODS.find((m) => m === body.paymentMethod);
  if (!paymentMethod) return { error: "invalid", field: "payment" };
  const onlineMethod = ONLINE_METHODS.find((m) => m === body.onlineMethod);
  if (paymentMethod === "online" && !onlineMethod) return { error: "invalid", field: "payment" };

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0 || rawItems.length > 30) return { error: "invalid", field: "items" };

  const items: OrderItem[] = [];
  for (const raw of rawItems as Record<string, unknown>[]) {
    const product = typeof raw?.productId === "string" ? getProduct(raw.productId) : undefined;
    const color = product?.colors.find((c) => c.id === raw.colorId);
    const size = SIZES.find((s) => s === raw.size);
    const fit = FITS.find((f) => f === raw.fit && product?.fits.includes(f));
    const quantity = Number(raw.quantity);
    if (!product || !color || !size || !fit || !Number.isInteger(quantity) || quantity < 1 || quantity > SHOP.maxQuantityPerItem) {
      return { error: "invalid", field: "items" };
    }
    items.push({
      productId: product.id,
      name: product.name.en,
      color: color.name.en,
      size,
      fit,
      quantity,
      unitPrice: product.price,
      lineTotal: product.price * quantity,
    });
  }

  const totals = calculateTotals(items, governorate.id);

  return {
    order: {
      number: orderNumber(),
      createdAt: new Date().toISOString(),
      locale,
      paymentMethod,
      onlineMethod: paymentMethod === "online" ? onlineMethod : undefined,
      customer: { name, phone, email: email || undefined },
      address: {
        governorateId: governorate.id,
        governorate: governorate.name.en,
        governorateAr: governorate.name.ar,
        city,
        street,
        notes: notes || undefined,
      },
      items,
      subtotal: totals.subtotal,
      shipping: totals.shipping ?? 0,
      total: totals.total,
    },
  };
}
