# Fast Suit – online suit shop for Egypt

A bilingual (Arabic / English) web shop for suits. Customers browse the collection, pick colour, fit and size, and order with **cash on delivery** anywhere in Egypt. Every order is emailed to the shop.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Resend (email)

## Features

- Arabic (right-to-left) and English: `/ar/...` and `/en/...`. New visitors get Arabic unless their browser is in English
- Home page, shop with occasion filter and sorting, product pages, size guide
- Colour, fit (slim / regular) and EU size (44–58) selection
- Cart saved in the browser
- Checkout with name, Egyptian mobile number, governorate (all 27), city and address
- Delivery fee by governorate zone, free above a set amount
- Cash on delivery
- Each order is emailed to the shop with the customer's details, a WhatsApp link and the items
- Prices and delivery fees are always calculated on the server, so customers can't change them
- Every order is also written to the server logs as a backup (Vercel → your project → Logs, search for `NEW ORDER`)

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Receive orders by email (Resend)

1. Create a free account at https://resend.com.
2. Go to **API Keys → Create API Key** and copy the key (`re_...`).
3. In Vercel: your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = your key
   - `ORDER_EMAIL_TO` = the email you signed up to Resend with
4. Go to **Deployments**, click **⋯** on the latest one and choose **Redeploy**.

Place a test order: it arrives in your inbox within seconds.

To run locally with email, copy `.env.example` to `.env.local` and fill in the same values.

**Later, with your own domain (fastsuit.com):** verify the domain in Resend (Domains → Add Domain). Then you can:
- send orders to any address, or several (`ORDER_EMAIL_TO=a@x.com,b@y.com`)
- set `ORDER_EMAIL_FROM=Fast Suit <orders@fastsuit.com>`
- set `SEND_CUSTOMER_EMAILS=true` to send customers a confirmation when they enter an email

## Edit the shop

| What | Where |
| --- | --- |
| Products (names, prices, colours, descriptions) | `src/lib/products.ts` |
| Delivery fees, free-delivery limit | `src/lib/config.ts` |
| Which governorate is in which delivery zone | `src/lib/egypt.ts` |
| All texts in Arabic and English (incl. exchange policy, delivery times) | `src/i18n/dictionaries.ts` |
| Colours and buttons | `src/app/globals.css` |
| Logo files | `public/brand/`, `src/app/icon.png` |

Prices are written in piasters (EGP × 100): `899900` means EGP 8,999.

### Adding real product photos

Put photos in `public/products/` and list them on the product:

```ts
images: ["/products/midnight-classic-1.jpg"],
```

Until a product has photos, the shop shows a drawn suit in the product's colour.

## Adding online payment later (Paymob)

Stripe is not available for businesses in Egypt. For cards, Meeza, mobile wallets (Vodafone Cash etc.) and ValU, use [Paymob](https://paymob.com):

1. Open a Paymob merchant account (needs business documents).
2. Add `"paymob"` to `PAYMENT_METHODS` in `src/lib/config.ts`.
3. In `src/app/api/orders/route.ts`, create the Paymob payment for those orders and return its checkout URL.
4. Add a Paymob webhook route that marks the order as paid.

## Project structure

```
src/
  app/
    [locale]/            pages for /ar and /en
      page.tsx           home
      shop/              all suits + filters
      product/[slug]/    product page
      cart/              cart
      checkout/          delivery details + place order
      checkout/success/  thank-you page with order number
      size-guide/
      legal/[page]/      imprint, privacy, terms, returns
    api/orders/          receives orders and emails them
  components/            header, footer, product card, cart, checkout form, …
  i18n/                  languages and translations
  lib/                   products, shop settings, governorates, pricing, orders, email
  proxy.ts               sends visitors to /ar or /en
```

## Before you sell for real

- [ ] Replace the sample products and prices with your real ones
- [ ] Add real product photos
- [ ] Check the delivery fees, free-delivery limit and the 14-day exchange text
- [ ] Fill in the legal pages (terms, privacy, returns)
- [ ] Set up Resend so orders reach you, and place a test order
