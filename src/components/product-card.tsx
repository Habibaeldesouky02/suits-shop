import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { formatPrice, type Product } from "@/lib/products";
import { ProductVisual } from "./product-visual";

export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="group block">
      <div className="relative">
        <ProductVisual product={product} className="transition duration-300 group-hover:border-gold-400/60" />
        <div className="absolute start-3 top-3 flex gap-2">
          {product.isNew && (
            <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold uppercase text-black">
              {t.product.new}
            </span>
          )}
          {product.compareAtPrice && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase text-black">
              {t.product.sale}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white transition group-hover:text-gold-300">{product.name[locale]}</h3>
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.id}
                title={c.name[locale]}
                className="size-3.5 rounded-full border border-white/30"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
        <div className="text-end">
          <p className="font-semibold text-gold-300">{formatPrice(product.price, locale)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-white/40 line-through">{formatPrice(product.compareAtPrice, locale)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
