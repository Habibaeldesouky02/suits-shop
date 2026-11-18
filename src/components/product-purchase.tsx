"use client";

import Link from "next/link";
import { useState } from "react";
import { SIZES, SHOP, type Fit, type Size } from "@/lib/config";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { ProductVisual } from "./product-visual";
import { CheckIcon } from "./icons";

export function ProductPurchase({ product, children }: { product: Product; children?: React.ReactNode }) {
  const { locale, t } = useI18n();
  const { addItem } = useCart();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [fit, setFit] = useState<Fit>(product.fits[0]);
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<"added" | "chooseSize" | null>(null);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];

  function handleAdd() {
    if (!size) {
      setMessage("chooseSize");
      return;
    }
    addItem({ productId: product.id, colorId, size, fit, quantity });
    setMessage("added");
  }

  const option = (active: boolean) =>
    `rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
      active ? "border-gold-400 bg-gold-400/10 text-gold-200" : "border-white/15 text-white/80 hover:border-white/40"
    }`;

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductVisual product={product} color={color} priority sizes="(min-width: 1024px) 50vw, 100vw" />

      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">{product.name[locale]}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-gold-300">{formatPrice(product.price, locale)}</span>
          {product.compareAtPrice && (
            <span className="text-lg text-white/40 line-through">{formatPrice(product.compareAtPrice, locale)}</span>
          )}
        </div>
        <p className="mt-6 leading-relaxed text-white/70">{product.description[locale]}</p>

        {/* Colour */}
        <div className="mt-8">
          <p className="text-sm font-semibold">
            {t.product.color}: <span className="font-normal text-white/60">{color.name[locale]}</span>
          </p>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorId(c.id)}
                aria-label={c.name[locale]}
                aria-pressed={c.id === colorId}
                className={`size-10 rounded-full border-2 transition ${
                  c.id === colorId ? "border-gold-400 ring-2 ring-gold-400/30" : "border-white/20 hover:border-white/50"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Fit */}
        <div className="mt-7">
          <p className="text-sm font-semibold">{t.product.fit}</p>
          <div className="mt-3 flex gap-3">
            {product.fits.map((f) => (
              <button key={f} type="button" onClick={() => setFit(f)} className={option(f === fit)} aria-pressed={f === fit}>
                {t.fits[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{t.product.size}</p>
            <Link href={`/${locale}/size-guide`} className="text-sm text-gold-300 underline-offset-4 hover:underline">
              {t.product.sizeGuide}
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setMessage(null);
                }}
                className={option(s === size)}
                aria-pressed={s === size}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + add */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <label className="sr-only" htmlFor="qty">
            {t.product.quantity}
          </label>
          <select
            id="qty"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-12 rounded-full border border-white/20 bg-black px-5 text-white focus:border-gold-400 focus:outline-none"
          >
            {Array.from({ length: SHOP.maxQuantityPerItem }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleAdd} className="btn-gold h-12 flex-1">
            {t.product.addToCart}
          </button>
        </div>

        <div aria-live="polite" className="mt-4 min-h-6 text-sm">
          {message === "chooseSize" && <p className="text-red-400">{t.product.chooseSize}</p>}
          {message === "added" && (
            <p className="flex items-center gap-2 text-gold-200">
              <CheckIcon className="size-4" />
              {t.product.added} ·{" "}
              <Link href={`/${locale}/cart`} className="font-semibold underline underline-offset-4">
                {t.product.viewCart}
              </Link>
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
