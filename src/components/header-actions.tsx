"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { BagIcon } from "./icons";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const target = locale === "en" ? "ar" : "en";
  // Swap the first path segment: /en/shop -> /ar/shop
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${target}`);

  return (
    <Link
      href={href}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 transition hover:border-gold-400 hover:text-gold-300"
      lang={target}
    >
      {t.nav.switchLanguage}
    </Link>
  );
}

export function CartButton() {
  const { locale, t } = useI18n();
  const { count } = useCart();

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-gold-400 hover:text-gold-300"
      aria-label={t.nav.cart}
    >
      <BagIcon className="size-5" />
      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold-400 text-[11px] font-bold text-black">
          {count}
        </span>
      )}
    </Link>
  );
}
