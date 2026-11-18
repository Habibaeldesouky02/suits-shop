import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe calls this URL when something happens to a payment.
 * This is the reliable place to record an order: it runs even if the
 * customer closes the browser before reaching the success page.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", secret);
  } catch {
    return Response.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const order = {
      stripeSessionId: session.id,
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      phone: session.customer_details?.phone,
      shippingAddress: session.collected_information?.shipping_details?.address,
      total: session.amount_total,
      currency: session.currency,
      locale: session.metadata?.locale,
      items: lineItems.data.map((li) => {
        const product = li.price?.product as Stripe.Product | undefined;
        return { ...product?.metadata, quantity: li.quantity, amount: li.amount_total };
      }),
    };

    // TODO: save the order in your database and send a confirmation email.
    console.log("New paid order:", JSON.stringify(order, null, 2));
  }

  return Response.json({ received: true });
}
