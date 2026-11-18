import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SIZES } from "@/lib/config";

export async function generateMetadata({ params }: PageProps<"/[locale]/size-guide">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).sizeGuide.title } : {};
}

export default async function SizeGuidePage({ params }: PageProps<"/[locale]/size-guide">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).sizeGuide;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">{t.title}</h1>
      <p className="mt-4 text-white/70">{t.intro}</p>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-center text-sm">
          <thead className="bg-gold-400/10 text-gold-200">
            <tr>
              <th className="px-4 py-3 font-semibold">{t.eu}</th>
              <th className="px-4 py-3 font-semibold">{t.ukus}</th>
              <th className="px-4 py-3 font-semibold">{t.chest}</th>
              <th className="px-4 py-3 font-semibold">{t.waist}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {SIZES.map((size) => {
              const n = Number(size);
              const step = (n - 44) / 2;
              return (
                <tr key={size} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold">{size}</td>
                  <td className="px-4 py-3 text-white/70">{n - 10}</td>
                  <td className="px-4 py-3 text-white/70">{86 + step * 4}–{89 + step * 4}</td>
                  <td className="px-4 py-3 text-white/70">{74 + step * 4}–{77 + step * 4}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-2xl font-bold">{t.howTo}</h2>
      <ol className="mt-5 space-y-3">
        {t.steps.map((step, i) => (
          <li key={step} className="flex gap-4 text-white/80">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-400 text-sm font-bold text-black">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-8 rounded-xl border border-gold-400/30 bg-gold-400/5 px-5 py-4 text-gold-200">{t.between}</p>
    </div>
  );
}
