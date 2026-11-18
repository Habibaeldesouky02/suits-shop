"use client";

import Link from "next/link";
import { useI18n } from "@/components/locale-provider";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-gold-gradient text-7xl font-extrabold">404</p>
      <h1 className="mt-6 text-3xl font-bold">{t.notFound.title}</h1>
      <p className="mt-3 text-white/60">{t.notFound.text}</p>
      <Link href={`/${locale}`} className="btn-gold mt-8">
        {t.notFound.back}
      </Link>
    </div>
  );
}
