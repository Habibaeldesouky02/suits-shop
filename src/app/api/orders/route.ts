import { emailConfigured, sendConfirmationToCustomer, sendOrderToShop } from "@/lib/email";
import { parseOrder } from "@/lib/orders";
import { sendOrderToWhatsApp, whatsappConfigured } from "@/lib/whatsapp";

/**
 * Receives an order from the checkout page and sends it to the shop:
 * by WhatsApp (CALLMEBOT_* settings) and/or by email (RESEND_* settings),
 * whichever are set up. The order counts as received when at least one arrives.
 *
 * Payment is either cash on delivery or online. For online orders the shop
 * currently sends the payment link by hand (e.g. from the Paymob dashboard).
 * To automate it later: when order.paymentMethod is "online", create a Paymob
 * payment link here and send it to the customer by SMS / email.
 */
export async function POST(request: Request) {
  const channels = [
    whatsappConfigured() && { name: "WhatsApp", send: sendOrderToWhatsApp },
    emailConfigured() && { name: "email", send: sendOrderToShop },
  ].filter((c) => c !== false);

  if (channels.length === 0) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = parseOrder(body);
  if ("error" in result) {
    // Pretend spam succeeded so bots don't retry.
    if (result.error === "spam") return Response.json({ orderNumber: "FS-0", total: 0 });
    return Response.json(result, { status: 400 });
  }

  const { order } = result;

  // Also written to the server logs (Vercel → Logs) as a backup copy of every order.
  console.log(`NEW ORDER ${order.number}`, JSON.stringify(order));

  const results = await Promise.allSettled(channels.map((c) => c.send(order)));
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`Could not send order ${order.number} by ${channels[i].name}:`, r.reason);
  });
  if (!results.some((r) => r.status === "fulfilled")) {
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  if (emailConfigured()) {
    try {
      await sendConfirmationToCustomer(order);
    } catch (error) {
      // The shop already has the order, so don't fail the checkout for this.
      console.error(`Could not email confirmation for ${order.number}:`, error);
    }
  }

  return Response.json({ orderNumber: order.number, total: order.total });
}
