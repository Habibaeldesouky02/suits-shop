import "server-only";
import { ONLINE_METHOD_NAMES } from "./config";
import type { Order } from "./orders";
import { formatPrice } from "./products";
import { sizeLabel } from "./sizes";

/*
 * Sends each new order to the shop owner's WhatsApp using CallMeBot
 * (https://www.callmebot.com). It can only send messages to your own number.
 *   CALLMEBOT_PHONE  – your WhatsApp number, e.g. +201001234567 or 01001234567
 *   CALLMEBOT_APIKEY – the API key the CallMeBot bot sent you on WhatsApp
 */
const API_URL = process.env.CALLMEBOT_API_URL ?? "https://api.callmebot.com/whatsapp.php";

export function whatsappConfigured() {
  return Boolean(process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY);
}

function internationalNumber(raw: string) {
  const digits = raw.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("01")) return `+2${digits}`; // Egyptian mobile 01… → +201…
  return `+${digits}`;
}

const egp = (piasters: number) => formatPrice(piasters, "en");

export function orderMessage(order: Order) {
  const c = order.customer;
  const a = order.address;
  const online = order.paymentMethod === "online" && order.onlineMethod;
  const lines = [
    `*New order ${order.number}*`,
    online
      ? `💳 *PAY ONLINE – ${ONLINE_METHOD_NAMES[order.onlineMethod!]}*\nSend a payment link for ${egp(order.total)} to ${c.phone}${c.email ? ` / ${c.email}` : ""}`
      : `💵 Cash on delivery`,
    "",
    `👤 ${c.name}`,
    `📱 ${c.phone}  wa.me/2${c.phone}`,
    ...(c.email ? [`✉️ ${c.email}`] : []),
    `📍 ${a.street}, ${a.city}, ${a.governorate}`,
    ...(a.notes ? [`📝 ${a.notes}`] : []),
    "",
    ...order.items.map(
      (i) =>
        `• ${i.name} – ${i.color}, ${i.fit === "slim" ? "Slim" : "Regular"}, size ${sizeLabel(i.size)} × ${i.quantity} = ${egp(i.lineTotal)}`,
    ),
    "",
    `Subtotal: ${egp(order.subtotal)}`,
    `Delivery: ${order.shipping === 0 ? "Free" : egp(order.shipping)}`,
    `*Total: ${egp(order.total)}*`,
  ];
  return lines.join("\n");
}

export async function sendOrderToWhatsApp(order: Order) {
  const url = new URL(API_URL);
  url.searchParams.set("phone", internationalNumber(process.env.CALLMEBOT_PHONE!));
  url.searchParams.set("apikey", process.env.CALLMEBOT_APIKEY!);
  url.searchParams.set("text", orderMessage(order));

  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const body = await res.text();
  // CallMeBot answers with a short web page; errors mention "error" or "invalid".
  if (!res.ok || (/error|invalid/i.test(body) && !/queued|sent/i.test(body))) {
    throw new Error(`CallMeBot responded ${res.status}: ${body.slice(0, 300)}`);
  }
}
