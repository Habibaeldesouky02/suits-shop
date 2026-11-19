import "server-only";
import { formatPrice } from "./products";
import type { Order } from "./orders";
import { sizeLabel } from "./sizes";
import { ONLINE_METHOD_NAMES } from "./config";

/*
 * Emails are sent with Resend (https://resend.com).
 *   RESEND_API_KEY   – your Resend API key
 *   ORDER_EMAIL_TO   – where new orders go (several addresses: separate with commas)
 *   ORDER_EMAIL_FROM – sender; until your domain is verified in Resend, keep the default
 *   SEND_CUSTOMER_EMAILS=true – also email the customer (needs a verified domain)
 */
const RESEND_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";
const DEFAULT_FROM = "Fast Suit <onboarding@resend.dev>";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_TO);
}

async function sendEmail(message: { to: string[]; subject: string; html: string; replyTo?: string }) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || DEFAULT_FROM,
      to: message.to,
      subject: message.subject,
      html: message.html,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}

function escape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const egp = (piasters: number) => formatPrice(piasters, "en");

function paymentName(order: Order) {
  return order.paymentMethod === "online" && order.onlineMethod
    ? `Online – ${ONLINE_METHOD_NAMES[order.onlineMethod]}`
    : "Cash on delivery";
}

function itemsTable(order: Order) {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${escape(i.name)}<br><span style="color:#666;font-size:13px">${escape(i.color)} · ${i.fit === "slim" ? "Slim" : "Regular"} fit · Size ${sizeLabel(i.size)}</span></td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${egp(i.lineTotal)}</td>
      </tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="background:#f6f1e3"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
    ${rows}
    <tr><td colspan="2" style="padding:8px;text-align:right">Subtotal</td><td style="padding:8px;text-align:right">${egp(order.subtotal)}</td></tr>
    <tr><td colspan="2" style="padding:8px;text-align:right">Delivery</td><td style="padding:8px;text-align:right">${order.shipping === 0 ? "Free" : egp(order.shipping)}</td></tr>
    <tr><td colspan="2" style="padding:8px;text-align:right;font-weight:bold">Total (${order.paymentMethod === "online" ? "pay online" : "cash on delivery"})</td><td style="padding:8px;text-align:right;font-weight:bold">${egp(order.total)}</td></tr>
  </table>`;
}

export async function sendOrderToShop(order: Order) {
  const c = order.customer;
  const a = order.address;
  const online = order.paymentMethod === "online";
  const action = online
    ? `<div style="margin:0 0 20px;padding:14px 16px;background:#fff4d6;border:2px solid #d9ad45;border-radius:8px;line-height:1.6">
        <b>Action needed: send a payment link</b><br>
        Amount: <b>${egp(order.total)}</b> · Method chosen: <b>${escape(order.onlineMethod ? ONLINE_METHOD_NAMES[order.onlineMethod] : "")}</b><br>
        Send it by SMS to <b>${c.phone}</b>${c.email ? ` and by email to <b>${escape(c.email)}</b>` : ""}.<br>
        Use order number <b>${escape(order.number)}</b> as the reference. Ship the order once the payment has arrived.
      </div>`
    : "";
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;color:#111">
    <h2 style="margin:0 0 4px">New order ${escape(order.number)}</h2>
    <p style="margin:0 0 20px;color:#666">${new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })} (Cairo time) · Payment: <b>${escape(paymentName(order))}</b></p>
    ${action}
    <h3 style="margin:0 0 8px">Customer</h3>
    <p style="margin:0 0 20px;line-height:1.6">
      ${escape(c.name)}<br>
      Mobile: <a href="tel:${c.phone}">${c.phone}</a> · <a href="https://wa.me/2${c.phone}">WhatsApp</a><br>
      ${c.email ? `Email: ${escape(c.email)}<br>` : ""}
      Website language: ${order.locale === "ar" ? "Arabic" : "English"}
    </p>
    <h3 style="margin:0 0 8px">Delivery address</h3>
    <p style="margin:0 0 20px;line-height:1.6">
      ${escape(a.street)}<br>
      ${escape(a.city)}, ${escape(a.governorate)} (${escape(a.governorateAr)})
      ${a.notes ? `<br><i>Notes: ${escape(a.notes)}</i>` : ""}
    </p>
    ${itemsTable(order)}
  </div>`;

  await sendEmail({
    to: process.env.ORDER_EMAIL_TO!.split(",").map((s) => s.trim()).filter(Boolean),
    subject: `${online ? "PAY ONLINE – " : ""}New order ${order.number} – ${egp(order.total)} – ${a.governorate}${
      online && order.onlineMethod ? ` – ${ONLINE_METHOD_NAMES[order.onlineMethod]}` : ""
    }`,
    html,
    replyTo: c.email,
  });
}

export async function sendConfirmationToCustomer(order: Order) {
  if (!order.customer.email || process.env.SEND_CUSTOMER_EMAILS !== "true") return;
  const ar = order.locale === "ar";
  const html = `<div dir="${ar ? "rtl" : "ltr"}" style="font-family:Arial,sans-serif;max-width:640px;color:#111">
    <h2>${ar ? "شكراً على طلبك من فاست سوت!" : "Thank you for your Fast Suit order!"}</h2>
    <p>${
      order.paymentMethod === "online"
        ? ar
          ? `رقم طلبك <b>${escape(order.number)}</b>. هنبعتلك لينك الدفع قريب. المطلوب تدفعه أونلاين: <b>${formatPrice(order.total, "ar")}</b>.`
          : `Your order number is <b>${escape(order.number)}</b>. We'll send you a payment link shortly. Amount to pay online: <b>${egp(order.total)}</b>.`
        : ar
          ? `رقم طلبك <b>${escape(order.number)}</b>. هنكلمك قريب عشان نأكد الطلب. المطلوب تدفعه عند الاستلام: <b>${formatPrice(order.total, "ar")}</b>.`
          : `Your order number is <b>${escape(order.number)}</b>. We'll call you shortly to confirm it. Amount to pay on delivery: <b>${egp(order.total)}</b>.`
    }</p>
    <div dir="ltr">${itemsTable(order)}</div>
  </div>`;
  await sendEmail({
    to: [order.customer.email],
    subject: ar ? `تأكيد طلبك ${order.number}` : `Your order ${order.number}`,
    html,
  });
}
