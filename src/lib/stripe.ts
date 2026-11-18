import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns the Stripe client, or null when STRIPE_SECRET_KEY is not set yet. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
