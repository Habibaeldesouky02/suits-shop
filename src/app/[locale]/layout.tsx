import "@fontsource-variable/montserrat";
import "@fontsource-variable/cairo";
import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDirection, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleProvider } from "@/components/locale-provider";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fastsuit.com.eg"),
    title: { default: t.meta.title, template: "%s · Fast Suit" },
    description: t.meta.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
    openGraph: { images: ["/brand/logo-full.png"] },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={getDirection(locale)} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
          <CartProvider>
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
