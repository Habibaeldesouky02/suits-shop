# Fast Suit – online suit shop for Egypt

A bilingual (Arabic / English) web shop for suits. Customers browse the collection, pick colour, fit and size, and order with **cash on delivery** anywhere in Egypt. Every order is emailed to the shop.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · WhatsApp (Whatabot / CallMeBot) / Resend (email)

## Features

- Arabic (right-to-left) and English: `/ar/...` and `/en/...`. New visitors get Arabic unless their browser is in English
- Home page, shop with occasion filter and sorting, product pages, size guide
- Colour, fit (slim / regular) and EU size (44–58) selection
- Cart saved in the browser
- Checkout with name, Egyptian mobile number, governorate (all 27), city and address
- Delivery fee by governorate zone, free above a set amount
- Cash on delivery, or pay online by card, InstaPay or Vodafone Cash (payment link)
- After ordering, the customer sends the order to your WhatsApp with one tap (message already typed)
- Each order can also be sent to you automatically by WhatsApp bot and/or email
- Prices and delivery fees are always calculated on the server, so customers can't change them
- Every order is also written to the server logs as a backup (Vercel → your project → Logs, search for `NEW ORDER`)

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Customers send their order to your WhatsApp (simplest, free)

Set `SHOP_WHATSAPP_NUMBER` in Vercel (your WhatsApp number in international format, e.g. `491701234567` or `201001234567`) and redeploy.

After ordering, the thank-you page shows **"Last step: send us your order on WhatsApp"** with a big green button. It opens WhatsApp with your number and the full order already typed (order number, suits, sizes, total, payment method, name, mobile and address, in the customer's language). The customer just presses Send, and you can reply in that chat to confirm or send a payment link.

If a customer doesn't press Send, you still get the order through any channel below that is set up (email recommended as a backup), and in Vercel → Logs (`NEW ORDER`).

## Receive orders on WhatsApp automatically

Every order is sent to your own WhatsApp number with a free service that can only message your own number (exactly what this needs). Two are supported; set up one of them.

### Whatabot (recommended)

1. On [whatabot.io](https://whatabot.io) → **Get Started**, save the Whatabot phone number shown there as a contact.
2. Send it the activation message shown on that page and wait for the reply with your **API key**.
3. In Vercel: your project → **Settings → Environment Variables**, add:
   - `WHATABOT_PHONE` = your WhatsApp number, e.g. `201001234567`
   - `WHATABOT_APIKEY` = the key from the bot
4. **Deployments → ⋯ → Redeploy**, then place a test order.

Whatabot allows 200 characters per message, so each order arrives as a few short messages in a row, each marked like `(2/4 · FS-261119-AB12)`.

### CallMeBot

1. On callmebot.com → **WhatsApp**, save the bot's phone number (when it is accepting new users).
2. Send it: `I allow callmebot to send me messages` and wait for your **API key**.
3. In Vercel add `CALLMEBOT_PHONE` (e.g. `+201001234567`) and `CALLMEBOT_APIKEY`, then redeploy.

If both are set up, Whatabot is used.

### Also (or instead) by email

Add `RESEND_API_KEY` and `ORDER_EMAIL_TO` (see `.env.example`) to get every order by email too. If both WhatsApp and email are set up, an order counts as received when at least one of them arrives. To stop emails, delete those two variables and redeploy.

Every order is also written to the server logs as a backup: Vercel → your project → **Logs**, search for `NEW ORDER`.

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

## Online payment (card, InstaPay, Vodafone Cash)

At checkout the customer chooses **cash on delivery** or **pay online**. For online, they pick one of: bank card (Visa / Mastercard / Meeza), InstaPay or Vodafone Cash.

For an online order, the order email starts with a yellow **"Action needed: send a payment link"** box showing the amount, the chosen method and the customer's mobile number and email. Send the link and ship once the payment has arrived:

- **Card or Vodafone Cash:** create a Payment Link in your [Paymob](https://paymob.com) dashboard and share it by SMS or email.
- **InstaPay:** send your InstaPay payment link or address, or a Paymob link if InstaPay is enabled on your Paymob account.

Stripe is not available for businesses in Egypt, so Paymob is the recommended provider.

**Automating it later:** once you have a Paymob account and API keys, the link can be created and sent automatically when the order is placed (the place for this is marked in `src/app/api/orders/route.ts`). Sending SMS automatically also needs an SMS service.

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
- [ ] Set `SHOP_WHATSAPP_NUMBER`, keep email as a backup, and place a test order
