import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ShopCatalog } from "@/components/shop-catalog";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).shop.title } : {};
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">{t.shop.title}</h1>
      <p className="mt-3 text-white/60">{t.shop.subtitle}</p>
      {/* The catalog reads ?occasion= from the URL, so it renders in the browser. */}
      <Suspense fallback={<div className="mt-10 h-96" />}>
        <ShopCatalog />
      </Suspense>
    </div>
  );
}
