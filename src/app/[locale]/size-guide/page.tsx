import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SIZES } from "@/lib/config";
import { SIZE_INFO } from "@/lib/sizes";
import { SizeFinder } from "@/components/size-finder";

export async function generateMetadata({ params }: PageProps<"/[locale]/size-guide">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).sizeGuide.title } : {};
}

export default async function SizeGuidePage({ params }: PageProps<"/[locale]/size-guide">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).sizeGuide;
  const range = ([a, b]: [number, number]) => `${a}–${b}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold sm:text-5xl">{t.title}</h1>
      <p className="mt-4 max-w-3xl text-white/70">{t.intro}</p>

      <SizeFinder />

      <h2 className="mt-14 text-2xl font-bold">{t.tableTitle}</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-center text-sm">
          <thead className="bg-gold-400/10 text-gold-200">
            <tr>
              <th className="px-3 py-3 font-semibold">{t.size}</th>
              <th className="px-3 py-3 font-semibold">{t.letter}</th>
              <th className="px-3 py-3 font-semibold">{t.weight}</th>
              <th className="px-3 py-3 font-semibold">{t.height}</th>
              <th className="px-3 py-3 font-semibold">{t.chest}</th>
              <th className="px-3 py-3 font-semibold">{t.waist}</th>
              <th className="px-3 py-3 font-semibold">{t.trousers}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10" dir="ltr">
            {SIZES.map((size) => {
              const info = SIZE_INFO[size];
              return (
                <tr key={size} className="hover:bg-white/5">
                  <td className="px-3 py-3 text-base font-bold">{size}</td>
                  <td className="px-3 py-3 font-semibold text-gold-300">{info.letter}</td>
                  <td className="px-3 py-3 text-white/70">{range(info.weight)}</td>
                  <td className="px-3 py-3 text-white/70">{range(info.height)}</td>
                  <td className="px-3 py-3 text-white/70">{range(info.chest)}</td>
                  <td className="px-3 py-3 text-white/70">{range(info.waist)}</td>
                  <td className="px-3 py-3 text-white/70">{info.trousers}</td>
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
