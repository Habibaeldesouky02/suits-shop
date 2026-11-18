"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fill } from "@/i18n/config";
import { OCCASIONS, type Occasion } from "@/lib/config";
import { products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useI18n } from "./locale-provider";

type SortKey = "featured" | "priceAsc" | "priceDesc";

export function ShopCatalog() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortKey>("featured");

  const param = searchParams.get("occasion");
  const occasion = OCCASIONS.includes(param as Occasion) ? (param as Occasion) : null;

  const visible = useMemo(() => {
    const list = occasion ? products.filter((p) => p.occasions.includes(occasion)) : [...products];
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sort === "featured") list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [occasion, sort]);

  function selectOccasion(next: Occasion | null) {
    router.replace(next ? `${pathname}?occasion=${next}` : pathname, { scroll: false });
  }

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition ${
      active ? "border-gold-400 bg-gold-400 text-black" : "border-white/20 text-white/80 hover:border-gold-400"
    }`;

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(!occasion)} onClick={() => selectOccasion(null)}>
            {t.shop.all}
          </button>
          {OCCASIONS.map((o) => (
            <button key={o} type="button" className={chip(occasion === o)} onClick={() => selectOccasion(o)}>
              {t.occasions[o]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-white/60">
          {t.shop.sortLabel}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-white/20 bg-black px-4 py-2 text-white focus:border-gold-400 focus:outline-none"
          >
            <option value="featured">{t.shop.sort.featured}</option>
            <option value="priceAsc">{t.shop.sort.priceAsc}</option>
            <option value="priceDesc">{t.shop.sort.priceDesc}</option>
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-white/50">{fill(t.shop.results, { count: visible.length })}</p>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-white/60">{t.shop.empty}</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
