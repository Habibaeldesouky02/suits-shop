"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { fill } from "@/i18n/config";
import { ONLINE_METHODS, type OnlineMethod } from "@/lib/config";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { CheckIcon, WhatsAppIcon } from "./icons";

const noopSubscribe = () => () => {};

/** WhatsApp link saved by the checkout for this order (only exists in this browser tab). */
function useWhatsAppLink(orderNumber: string | null) {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!orderNumber) return null;
      try {
        const url = sessionStorage.getItem(`fastsuit-wa-${orderNumber}`);
        return url?.startsWith("https://wa.me/") ? url : null;
      } catch {
        return null;
      }
    },
    () => null,
  );
}

export function CheckoutSuccess() {
  const { locale, t } = useI18n();
  const { clear, ready } = useCart();
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const total = Number(params.get("total"));
  const methodParam = params.get("method");
  const onlineMethod = ONLINE_METHODS.find((m) => m === methodParam) as OnlineMethod | undefined;
  const online = params.get("pay") === "online";
  const payNow = Number(params.get("now")) || 0;
  const payLater = Number(params.get("later")) || 0;
  const whatsappUrl = useWhatsAppLink(orderNumber);

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
      {whatsappUrl ? (
        <div className="mx-auto mt-8 max-w-lg rounded-2xl border-2 border-[#25D366] bg-[#25D366]/10 p-6">
          <h2 className="text-xl font-bold">{t.success.waTitle}</h2>
          <p className="mt-2 text-white/80">{t.success.waText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-lg font-bold text-black transition hover:brightness-110"
          >
            <WhatsAppIcon className="size-6" />
            {t.success.waButton}
          </a>
        </div>
      ) : (
        <p className="mt-4 text-white/70">
          {!onlineMethod
            ? t.success.text
            : fill(online ? t.success.textOnline : t.success.textCodDeposit, { method: methodName })}
        </p>
      )}
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
            <dd className="font-semibold">
              {online ? t.checkout.online : t.success.codWithDeposit}
              {methodName && ` · ${methodName}`}
            </dd>
          </div>
          {payNow > 0 ? (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">{online ? t.success.amountOnline : t.success.depositAmount}</dt>
                <dd className="font-semibold text-gold-300">{formatPrice(payNow, locale)}</dd>
              </div>
              {payLater > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">{t.success.restAmount}</dt>
                  <dd className="font-semibold">{formatPrice(payLater, locale)}</dd>
                </div>
              )}
            </>
          ) : (
            total > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">{t.success.amountDue}</dt>
                <dd className="font-semibold">{formatPrice(total, locale)}</dd>
              </div>
            )
          )}
        </dl>
      )}
      <Link href={`/${locale}/shop`} className="btn-gold mt-10">
        {t.success.continue}
      </Link>
    </>
  );
}
