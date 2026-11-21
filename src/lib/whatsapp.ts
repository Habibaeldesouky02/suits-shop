import { ONLINE_METHOD_NAMES } from "./config";
import type { Order } from "./orders";
import { formatPrice } from "./products";
import { sizeLabel } from "./sizes";
import { env } from "./env";

/*
 * Sends each new order to the shop owner's own WhatsApp, using one of two free
 * services (whichever is set up; Whatabot is used if both are):
 *
 * Whatabot (https://whatabot.io)
 *   WHATABOT_PHONE   – your WhatsApp number, e.g. 201001234567 (01001234567 also works)
 *   WHATABOT_APIKEY  – the API key the Whatabot bot sent you on WhatsApp
 *
 * CallMeBot (https://www.callmebot.com)
 *   CALLMEBOT_PHONE  – your WhatsApp number, e.g. +201001234567 (01001234567 also works)
 *   CALLMEBOT_APIKEY – the API key the CallMeBot bot sent you on WhatsApp
 */
const whatabotUrl = () => env("WHATABOT_API_URL") ?? "https://api.whatabot.io/Whatsapp/RequestSendMessage";
const callMeBotUrl = () => env("CALLMEBOT_API_URL") ?? "https://api.callmebot.com/whatsapp.php";
/** Whatabot accepts at most 200 characters per message. */
const WHATABOT_MAX_LENGTH = 200;

const whatabotEnabled = () => Boolean(env("WHATABOT_PHONE") && env("WHATABOT_APIKEY"));
const callMeBotEnabled = () => Boolean(env("CALLMEBOT_PHONE") && env("CALLMEBOT_APIKEY"));

export function whatsappConfigured() {
  return whatabotEnabled() || callMeBotEnabled();
}

/** "01001234567", "+20 100 123 4567", "00201001234567" → "201001234567" */
function internationalDigits(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("01") && digits.length === 11) return `2${digits}`; // Egyptian mobile
  return digits;
}

const egp = (piasters: number) => formatPrice(piasters, "en");

/** The order as short lines, each one a separate piece of information. */
export function orderLines(order: Order) {
  const c = order.customer;
  const a = order.address;
  const method = ONLINE_METHOD_NAMES[order.onlineMethod];
  return [
    `🛍️ *New order ${order.number}* – ${egp(order.total)}`,
    order.paymentMethod === "online"
      ? `💳 *PAY ONLINE – ${method}*. Send a payment link for ${egp(order.payOnline)} to ${c.phone}${c.email ? ` / ${c.email}` : ""}`
      : `💵 *COD + DEPOSIT – ${method}*. Send a deposit link for ${egp(order.payOnline)} to ${c.phone}${c.email ? ` / ${c.email}` : ""}. Cash on delivery: ${egp(order.payOnDelivery)}`,
    `👤 ${c.name}`,
    `📱 ${c.phone}  wa.me/2${c.phone}`,
    ...(c.email ? [`✉️ ${c.email}`] : []),
    `📍 ${a.street}, ${a.city}, ${a.governorate}`,
    ...(a.notes ? [`📝 ${a.notes}`] : []),
    ...order.items.map(
      (i) =>
        `• ${i.name} – ${i.color}, ${i.fit === "slim" ? "Slim" : "Regular"}, size ${sizeLabel(i.size)} × ${i.quantity} = ${egp(i.lineTotal)}`,
    ),
    `Subtotal ${egp(order.subtotal)} · Delivery ${order.shipping === 0 ? "free" : egp(order.shipping)} · *Total ${egp(order.total)}*`,
  ];
}

/** Packs lines into as few messages as possible, each at most `max` characters. */
export function packMessages(lines: string[], max: number) {
  const messages: string[] = [];
  let current = "";
  for (const line of lines) {
    // A single line longer than the limit is cut into pieces.
    const pieces = line.length <= max ? [line] : (line.match(new RegExp(`[\\s\\S]{1,${max}}`, "g")) ?? []);
    for (const piece of pieces) {
      if (!current) current = piece;
      else if (current.length + 1 + piece.length <= max) current += `\n${piece}`;
      else {
        messages.push(current);
        current = piece;
      }
    }
  }
  if (current) messages.push(current);
  return messages;
}

async function sendWithWhatabot(text: string) {
  const res = await fetch(whatabotUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ApiKey: env("WHATABOT_APIKEY"),
      Text: text,
      Phone: internationalDigits(env("WHATABOT_PHONE")!),
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`Whatabot responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

async function sendWithCallMeBot(text: string) {
  const url = new URL(callMeBotUrl());
  url.searchParams.set("phone", `+${internationalDigits(env("CALLMEBOT_PHONE")!)}`);
  url.searchParams.set("apikey", env("CALLMEBOT_APIKEY")!);
  url.searchParams.set("text", text);
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  const body = await res.text();
  // CallMeBot answers with a short web page; errors mention "error" or "invalid".
  if (!res.ok || (/error|invalid/i.test(body) && !/queued|sent/i.test(body))) {
    throw new Error(`CallMeBot responded ${res.status}: ${body.slice(0, 300)}`);
  }
}

export async function sendOrderToWhatsApp(order: Order) {
  const lines = orderLines(order);
  if (whatabotEnabled()) {
    // Leave room for the "(2/3 · FS-261119-AB12)" label added to each message.
    const messages = packMessages(lines, WHATABOT_MAX_LENGTH - 26);
    // Send one after another so they arrive in the right order.
    for (const [i, message] of messages.entries()) {
      await sendWithWhatabot(messages.length > 1 ? `${message}\n(${i + 1}/${messages.length} · ${order.number})` : message);
      if (i < messages.length - 1) await new Promise((r) => setTimeout(r, 800));
    }
    return;
  }
  await sendWithCallMeBot(lines.join("\n"));
}
