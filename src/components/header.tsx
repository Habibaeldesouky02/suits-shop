import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CartButton, LanguageSwitcher } from "./header-actions";

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/shop`, label: t.nav.shop },
    { href: `/${locale}/size-guide`, label: t.nav.sizeGuide },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
      <p className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-4 py-1.5 text-center text-xs font-semibold text-black">
        {t.announcement}
      </p>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Fast Suit">
          <Image src="/brand/logo-wordmark.png" alt="Fast Suit" width={700} height={131} priority className="h-7 w-auto sm:h-9" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wider md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/80 transition hover:text-gold-300">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <CartButton />
        </div>
      </div>
      <nav className="flex justify-center gap-6 pb-3 text-xs font-medium uppercase tracking-wider md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-white/80 hover:text-gold-300">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
