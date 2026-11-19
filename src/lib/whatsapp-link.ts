import "server-only";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ONLINE_METHOD_NAMES } from "./config";
import { getGovernorate } from "./egypt";
import type { Order } from "./orders";
import { formatPrice, getProduct } from "./products";
import { sizeLabel } from "./sizes";

/*
 * "Send order on WhatsApp": after ordering, the customer gets a button that opens
 * WhatsApp with the whole order already typed, addressed to the shop's number.
 *   SHOP_WHATSAPP_NUMBER – the shop's WhatsApp number, e.g. 201001234567 or 01001234567
 */
export function shopWhatsAppNumber() {
  const raw = process.env.SHOP_WHATSAPP_NUMBER;
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("01") && digits.length === 11) return `2${digits}`; // Egyptian mobile
  return digits || null;
}

function orderText(order: Order, locale: Locale) {
  const t = getDictionary(locale);
  const ar = locale === "ar";
  const price = (p: number) => formatPrice(p, locale);
  const c = order.customer;
  const a = order.address;
  const governorate = getGovernorate(a.governorateId)?.name[locale] ?? a.governorate;

  const items = order.items.map((i) => {
    const product = getProduct(i.productId);
    const name = product?.name[locale] ?? i.name;
    const color = product?.colors.find((col) => col.name.en === i.color)?.name[locale] ?? i.color;
    return `• ${name} – ${color}، ${t.fits[i.fit]}، ${ar ? "مقاس" : "size"} ${sizeLabel(i.size)} × ${i.quantity} = ${price(i.lineTotal)}`;
  });

  const payment =
    order.paymentMethod === "online" && order.onlineMethod
      ? ar
        ? `${t.checkout.online} – ${t.checkout.onlineMethods[order.onlineMethod].title} (ابعتولي لينك الدفع لو سمحت)`
        : `${t.checkout.online} – ${ONLINE_METHOD_NAMES[order.onlineMethod]} (please send me the payment link)`
      : t.checkout.cod;

  const lines = ar
    ? [
        "السلام عليكم، عايز أأكد طلبي من فاست سوت 👋",
        `رقم الطلب: ${order.number}`,
        "",
        ...items,
        `التوصيل: ${order.shipping === 0 ? t.checkout.free : price(order.shipping)}`,
        `*الإجمالي: ${price(order.total)}*`,
        `الدفع: ${payment}`,
        "",
        `الاسم: ${c.name}`,
        `الموبايل: ${c.phone}`,
        `العنوان: ${a.street}، ${a.city}، ${governorate}`,
        ...(a.notes ? [`ملاحظات: ${a.notes}`] : []),
      ]
    : [
        "Hello! I'd like to confirm my Fast Suit order 👋",
        `Order number: ${order.number}`,
        "",
        ...items.map((l) => l.replace(/،/g, ",")),
        `Delivery: ${order.shipping === 0 ? t.checkout.free : price(order.shipping)}`,
        `*Total: ${price(order.total)}*`,
        `Payment: ${payment}`,
        "",
        `Name: ${c.name}`,
        `Mobile: ${c.phone}`,
        `Address: ${a.street}, ${a.city}, ${governorate}`,
        ...(a.notes ? [`Notes: ${a.notes}`] : []),
      ];
  return lines.join("\n");
}

/** wa.me link that opens a chat with the shop with the order typed in, or null if not set up. */
export function orderWhatsAppLink(order: Order) {
  const number = shopWhatsAppNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(orderText(order, order.locale))}`;
}
