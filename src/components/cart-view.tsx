"use client";

import Link from "next/link";
import { fill } from "@/i18n/config";
import { SHOP } from "@/lib/config";
import { formatPrice, getProduct } from "@/lib/products";
import { cartKey, useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { SuitIllustration } from "./suit-illustration";
import { TrashIcon } from "./icons";

export function CartView() {
  const { locale, t } = useI18n();
  const { items, ready, subtotal, updateQuantity, removeItem } = useCart();
  if (!ready) return <div className="h-96" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold">{t.cart.title}</h1>
        <p className="mt-4 text-white/60">{t.cart.empty}</p>
        <Link href={`/${locale}/shop`} className="btn-gold mt-8">
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  const remaining = SHOP.freeShippingThreshold - subtotal;

  return (
    <>
      <h1 className="text-4xl font-bold">{t.cart.title}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const color = product.colors.find((c) => c.id === item.colorId) ?? product.colors[0];
            const key = cartKey(item);
            return (
              <li key={key} className="flex gap-5 py-6">
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="relative flex h-32 w-26 shrink-0 items-end justify-center overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,#161616,#070707)]"
                >
                  <SuitIllustration color={color.hex} tie={color.tie} goldTrim={product.goldTrim} className="h-[85%] w-auto" />
                </Link>
                <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <Link href={`/${locale}/product/${product.slug}`} className="font-semibold hover:text-gold-300">
                      {product.name[locale]}
                    </Link>
                    <p className="mt-1 text-sm text-white/60">
                      {color.name[locale]} · {t.fits[item.fit]} · EU {item.size}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <select
                        value={item.quantity}
                        onChange={(e) => updateQuantity(key, Number(e.target.value))}
                        aria-label={t.product.quantity}
                        className="rounded-full border border-white/20 bg-black px-3 py-1.5 text-sm focus:border-gold-400 focus:outline-none"
                      >
                        {Array.from({ length: SHOP.maxQuantityPerItem }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-red-400"
                      >
                        <TrashIcon className="size-4" />
                        {t.cart.remove}
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-gold-300">{formatPrice(product.price * item.quantity, locale)}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/70">{t.cart.subtotal}</dt>
              <dd className="font-semibold">{formatPrice(subtotal, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">{t.cart.shipping}</dt>
              <dd className="text-white/60">{t.cart.shippingAtCheckout}</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-lg bg-gold-400/10 px-4 py-3 text-sm text-gold-200">
            {remaining > 0
              ? fill(t.cart.freeShippingLeft, { amount: formatPrice(remaining, locale) })
              : t.cart.freeShippingUnlocked}
          </p>
          <Link href={`/${locale}/checkout`} className="btn-gold mt-6 w-full">
            {t.cart.checkout}
          </Link>
          <p className="mt-4 text-center text-xs text-white/50">{t.cart.codNote}</p>
          <Link href={`/${locale}/shop`} className="mt-4 block text-center text-sm text-white/60 hover:text-gold-300">
            {t.cart.continue}
          </Link>
        </aside>
      </div>
    </>
  );
}
