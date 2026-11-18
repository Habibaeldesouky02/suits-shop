import type Stripe from "stripe";
import { isLocale, type Locale } from "@/i18n/config";
import { FITS, SHOP, SIZES, type Fit, type Size } from "@/lib/config";
import { getProduct } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

type IncomingItem = { productId?: unknown; colorId?: unknown; size?: unknown; fit?: unknown; quantity?: unknown };

/**
 * Creates a Stripe Checkout session from the cart.
 * Prices always come from the server-side catalogue, never from the browser,
 * so customers can't change what they pay.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { locale?: unknown; items?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";
  const items = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
  if (items.length === 0 || items.length > 50) {
    return Response.json({ error: "empty_cart" }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = typeof item.productId === "string" ? getProduct(item.productId) : undefined;
    const color = product?.colors.find((c) => c.id === item.colorId);
    const size = SIZES.includes(item.size as Size) ? (item.size as Size) : null;
    const fit = FITS.includes(item.fit as Fit) && product?.fits.includes(item.fit as Fit) ? (item.fit as Fit) : null;
    const quantity = Number(item.quantity);

    if (!product || !color || !size || !fit || !Number.isInteger(quantity) || quantity < 1 || quantity > SHOP.maxQuantityPerItem) {
      return Response.json({ error: "invalid_item" }, { status: 400 });
    }

    subtotal += product.price * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: SHOP.currency,
        unit_amount: product.price,
        product_data: {
          name: product.name[locale],
          description: `${color.name[locale]} · ${fit === "slim" ? "Slim" : "Regular"} fit · EU ${size}`,
          metadata: { productId: product.id, colorId: color.id, size, fit },
        },
      },
    });
  }

  const freeShipping = subtotal >= SHOP.freeShippingThreshold;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // Stripe Checkout has no Arabic yet, so Arabic visitors get their browser's language.
      locale: locale === "en" ? "en" : "auto",
      shipping_address_collection: {
        allowed_countries: [...SHOP.shippingCountries] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: locale === "ar" ? "شحن عادي" : "Standard shipping",
            fixed_amount: { amount: freeShipping ? 0 : SHOP.standardShipping, currency: SHOP.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: locale === "ar" ? "شحن سريع" : "Express shipping",
            fixed_amount: { amount: SHOP.expressShipping, currency: SHOP.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      metadata: { locale },
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: "stripe_error" }, { status: 502 });
  }
}
