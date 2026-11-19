"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fill } from "@/i18n/config";
import { ONLINE_METHODS, type OnlineMethod } from "@/lib/config";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { CheckIcon } from "./icons";

export function CheckoutSuccess() {
  const { locale, t } = useI18n();
  const { clear, ready } = useCart();
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const total = Number(params.get("total"));
  const methodParam = params.get("method");
  const onlineMethod = ONLINE_METHODS.find((m) => m === methodParam) as OnlineMethod | undefined;
  const online = params.get("pay") === "online" && Boolean(onlineMethod);

  // The order has been sent, so empty the cart (once it has loaded).
  useEffect(() => {
    if (ready && orderNumber) clear();
  }, [ready, orderNumber, clear]);

  const methodName = onlineMethod ? t.checkout.onlineMethods[onlineMethod].title : "";

  return (
    <>
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold-400 text-black">
        <CheckIcon className="size-8" />
      </span>
      <h1 className="mt-8 text-4xl font-bold">{t.success.title}</h1>
      <p className="mt-4 text-white/70">{online ? fill(t.success.textOnline, { method: methodName }) : t.success.text}</p>
      {orderNumber && (
        <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">{t.success.reference}</dt>
            <dd className="font-mono font-semibold text-gold-300" dir="ltr">
              {orderNumber}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">{t.success.paymentMethod}</dt>
            <dd className="font-semibold">{online ? `${t.checkout.online} · ${methodName}` : t.checkout.cod}</dd>
          </div>
          {total > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">{online ? t.success.amountOnline : t.success.amountDue}</dt>
              <dd className="font-semibold">{formatPrice(total, locale)}</dd>
            </div>
          )}
        </dl>
      )}
      <Link href={`/${locale}/shop`} className="btn-gold mt-10">
        {t.success.continue}
      </Link>
    </>
  );
}
