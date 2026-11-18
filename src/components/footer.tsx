import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OCCASIONS } from "@/lib/config";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = 2026;

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Image src="/brand/logo-icon.png" alt="Fast Suit" width={400} height={301} className="h-20 w-auto mix-blend-lighten" />
          <p className="mt-4 text-sm text-white/60">{t.footer.tagline}</p>
        </div>
        <FooterColumn title={t.footer.shop}>
          <Link href={`/${locale}/shop`}>{t.shop.all}</Link>
          {OCCASIONS.map((o) => (
            <Link key={o} href={`/${locale}/shop?occasion=${o}`}>
              {t.occasions[o]}
            </Link>
          ))}
        </FooterColumn>
        <FooterColumn title={t.footer.help}>
          <Link href={`/${locale}/size-guide`}>{t.nav.sizeGuide}</Link>
          <Link href={`/${locale}/legal/returns`}>{t.legal.returns}</Link>
          <Link href={`/${locale}/cart`}>{t.nav.cart}</Link>
        </FooterColumn>
        <FooterColumn title={t.footer.legal}>
          <Link href={`/${locale}/legal/imprint`}>{t.legal.imprint}</Link>
          <Link href={`/${locale}/legal/privacy`}>{t.legal.privacy}</Link>
          <Link href={`/${locale}/legal/terms`}>{t.legal.terms}</Link>
        </FooterColumn>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-6">
          <p>{t.footer.payments}</p>
          <p>
            © {year} Fast Suit. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{title}</h3>
      <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/70 [&_a:hover]:text-white">{children}</div>
    </div>
  );
}
