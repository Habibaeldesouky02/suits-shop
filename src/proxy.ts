import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "ar"];

/**
 * Sends visitors without a language in the URL to /en or /ar.
 * Order of preference: saved choice (cookie) → English if the browser is English → Arabic.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  const browser = request.headers.get("accept-language")?.split(",")[0]?.trim().toLowerCase() ?? "";
  const locale = saved && locales.includes(saved) ? saved : browser.startsWith("en") ? "en" : "ar";

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next.js internals and files like /icon.png
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
