import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const pages = ["imprint", "privacy", "terms", "returns"] as const;
type LegalPage = (typeof pages)[number];
const isLegalPage = (p: string): p is LegalPage => (pages as readonly string[]).includes(p);

export function generateStaticParams() {
  return pages.map((page) => ({ page }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[page]">): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isLegalPage(page)) return {};
  return { title: getDictionary(locale).legal[page] };
}

/**
 * Placeholder legal pages. Before going live in Germany you need a real
 * Impressum, Datenschutzerklärung, AGB and Widerrufsbelehrung here.
 */
export default async function LegalPageView({ params }: PageProps<"/[locale]/legal/[page]">) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isLegalPage(page)) notFound();
  const t = getDictionary(locale).legal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold">{t[page]}</h1>
      <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white/70">{t.placeholder}</p>
    </div>
  );
}
