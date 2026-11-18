import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CartView } from "@/components/cart-view";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).cart.title, robots: { index: false } } : {};
}

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <CartView />
    </div>
  );
}
