import { emailConfigured, sendConfirmationToCustomer, sendOrderToShop } from "@/lib/email";
import { parseOrder } from "@/lib/orders";

/**
 * Receives an order from the checkout page and emails it to the shop.
 *
 * Payment is either cash on delivery or online. For online orders the shop
 * currently sends the payment link by hand (e.g. from the Paymob dashboard).
 * To automate it later: when order.paymentMethod is "online", create a Paymob
 * payment link here and send it to the customer by SMS / email.
 */
export async function POST(request: Request) {
  if (!emailConfigured()) {
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

  try {
    await sendOrderToShop(order);
  } catch (error) {
    console.error(`Could not email order ${order.number}:`, error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  try {
    await sendConfirmationToCustomer(order);
  } catch (error) {
    // The shop already has the order, so don't fail the checkout for this.
    console.error(`Could not email confirmation for ${order.number}:`, error);
  }

  return Response.json({ orderNumber: order.number, total: order.total });
}
