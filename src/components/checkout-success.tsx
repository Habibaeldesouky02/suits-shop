"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { CheckIcon } from "./icons";

export function CheckoutSuccess() {
  const { locale, t } = useI18n();
  const { clear, ready } = useCart();
  const sessionId = useSearchParams().get("session_id");

  // The order is paid, so empty the cart (once it has loaded).
  useEffect(() => {
    if (ready && sessionId) clear();
  }, [ready, sessionId, clear]);

  return (
    <>
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold-400 text-black">
        <CheckIcon className="size-8" />
      </span>
      <h1 className="mt-8 text-4xl font-bold">{t.success.title}</h1>
      <p className="mt-4 text-white/70">{t.success.text}</p>
      {sessionId && (
        <p className="mt-6 text-sm text-white/50">
          {t.success.reference}: <span className="font-mono text-gold-300">{sessionId.slice(-10).toUpperCase()}</span>
        </p>
      )}
      <Link href={`/${locale}/shop`} className="btn-gold mt-10">
        {t.success.continue}
      </Link>
    </>
  );
}
