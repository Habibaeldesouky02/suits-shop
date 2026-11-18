# Fast Suit – online suit shop

A bilingual (English / Arabic) web shop for suits. Customers browse the collection, pick colour, fit and size, add to cart and pay securely with Stripe.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Stripe Checkout

## Features

- English and Arabic, with full right-to-left layout for Arabic (`/en/...`, `/ar/...`)
- Visitors are sent to their browser language automatically, and the language button remembers their choice
- Home page, shop with occasion filter and sorting, product pages, size guide
- Colour, fit (slim / regular) and EU size (44–58) selection
- Cart saved in the browser (survives reloads, stays in sync across tabs)
- Stripe Checkout: card, PayPal, Apple Pay, Klarna and more (whatever you enable in Stripe)
- Prices are always checked on the server, so customers can't change what they pay
- Shipping options with free standard shipping above €300
- Stripe webhook that receives every paid order
- Placeholder legal pages (Imprint, Privacy, Terms, Returns)

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then add your Stripe keys
npm run dev
```

Open http://localhost:3000.

## Set up payments (Stripe)

1. Create a free account at https://dashboard.stripe.com and stay in **test mode**.
2. Copy your **secret key** (`sk_test_...`) into `.env.local` as `STRIPE_SECRET_KEY`.
3. Restart `npm run dev`, add a suit to the cart and click **Checkout securely**.
4. Pay with the test card `4242 4242 4242 4242`, any future date and any CVC.

To receive orders locally, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Put the `whsec_...` value it prints into `.env.local` as `STRIPE_WEBHOOK_SECRET`. Each paid order is then printed in the terminal running `npm run dev`.

Payment methods (PayPal, Klarna, Apple Pay, …) are switched on in the Stripe Dashboard under **Settings → Payment methods**. No code change is needed.

## Edit the shop

| What | Where |
| --- | --- |
| Products (names, prices, colours, descriptions) | `src/lib/products.ts` |
| Shipping prices, free-shipping limit, countries | `src/lib/config.ts` |
| All texts in English and Arabic | `src/i18n/dictionaries.ts` |
| Colours and buttons | `src/app/globals.css` |
| Logo files | `public/brand/`, `src/app/icon.png` |

### Adding real product photos

Put photos in `public/products/` and list them on the product:

```ts
images: ["/products/midnight-classic-1.jpg"],
```

Until a product has photos, the shop shows a drawn suit in the product's colour.

## Project structure

```
src/
  app/
    [locale]/            pages for /en and /ar
      page.tsx           home
      shop/              all suits + filters
      product/[slug]/    product page
      cart/              cart
      checkout/success/  thank-you page after payment
      size-guide/
      legal/[page]/      imprint, privacy, terms, returns
    api/
      checkout/          creates the Stripe payment page
      webhooks/stripe/   receives paid orders from Stripe
  components/            header, footer, product card, cart, …
  i18n/                  languages and translations
  lib/                   products, shop settings, Stripe client
  proxy.ts               sends visitors to /en or /ar
```

## Go live (Vercel)

1. Push this repository to GitHub.
2. Import it at https://vercel.com/new.
3. Add the environment variables from `.env.example` with your **live** Stripe keys and your real domain as `NEXT_PUBLIC_SITE_URL`.
4. In Stripe, add a webhook endpoint `https://your-domain.com/api/webhooks/stripe` for the event `checkout.session.completed` and copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

## Before you sell for real

- [ ] Replace the legal placeholder pages with a real Impressum, Datenschutzerklärung, AGB and Widerrufsbelehrung
- [ ] Add real product photos
- [ ] Save orders in a database (e.g. Supabase) inside `src/app/api/webhooks/stripe/route.ts`
- [ ] Send order confirmation emails (Stripe can send receipts: Dashboard → Settings → Emails)
- [ ] Set separate shipping prices for Gulf countries if needed
- [ ] Add stock levels per size if you have limited inventory
