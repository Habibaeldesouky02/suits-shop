import type { Metadata } from "next";
import { COD_DEPOSIT } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProduct, products } from "@/lib/products";
import { ProductPurchase } from "@/components/product-purchase";
import { ArrowIcon, CheckIcon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/product/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(locale)) return {};
  return { title: product.name[locale], description: product.description[locale] };
}

export default async function ProductPage({ params }: PageProps<"/[locale]/product/[slug]">) {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product || !isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href={`/${locale}/shop`} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300">
        <ArrowIcon className="size-4 rotate-180" />
        {t.product.back}
      </Link>

      <ProductPurchase product={product}>
        <div className="mt-10 space-y-8 border-t border-white/10 pt-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t.product.details}</h2>
            <ul className="mt-4 space-y-2.5">
              {product.details[locale].map((d) => (
                <li key={d} className="flex items-center gap-3 text-white/80">
                  <CheckIcon className="size-4 shrink-0 text-gold-400" />
                  {d}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t.product.delivery}</h2>
            <p className="mt-3 text-white/70">{COD_DEPOSIT ? t.product.deliveryText : t.product.deliveryTextNoDeposit}</p>
          </section>
        </div>
      </ProductPurchase>
    </div>
  );
}
