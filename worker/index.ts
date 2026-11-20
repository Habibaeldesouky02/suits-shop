/**
 * Cloudflare Worker for Fast Suit.
 *
 * The website itself is plain files (built by `next build` into /out) that
 * Cloudflare serves directly. This Worker only runs for requests that don't
 * match a file:
 *   - POST /api/orders  → receives an order (email / WhatsApp)
 *   - addresses without a language, e.g. "/" or "/shop" → sends the visitor
 *     to /ar/… or /en/… (saved choice → browser language → Arabic)
 *   - unknown pages → the "page not found" page
 */
import { setEnv } from "../src/lib/env";
import { handleOrderRequest } from "../src/lib/handle-order";

type Env = {
  ASSETS: { fetch(input: Request | string | URL, init?: RequestInit): Promise<Response> };
  [name: string]: unknown;
};

const LOCALES = ["en", "ar"];

function preferredLocale(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const saved = /(?:^|;\s*)NEXT_LOCALE=(en|ar)\b/.exec(cookie)?.[1];
  if (saved) return saved;
  const browser = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase() ?? "";
  return browser.startsWith("en") ? "en" : "ar";
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/orders") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      }
      setEnv(env);
      return handleOrderRequest(request);
    }

    const first = url.pathname.split("/")[1];
    if (!LOCALES.includes(first)) {
      const target = new URL(`/${preferredLocale(request)}${url.pathname === "/" ? "" : url.pathname}`, url);
      target.search = url.search;
      return Response.redirect(target.toString(), 302);
    }

    // A language is given but the page doesn't exist.
    const page = await env.ASSETS.fetch(new URL(`/${first}/404`, url));
    return new Response(page.body, { status: 404, headers: page.headers });
  },
};

export default worker;
