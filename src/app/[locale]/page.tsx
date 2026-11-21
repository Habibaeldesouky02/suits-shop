import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { COD_DEPOSIT, OCCASIONS } from "@/lib/config";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SuitIllustration } from "@/components/suit-illustration";
import { ArrowIcon, BoltIcon, CashIcon, ReturnIcon, SparkIcon } from "@/components/icons";

const occasionLook = {
  business: { color: "#1a2744", tie: "#7b1e2b" },
  wedding: { color: "#0e0e10", tie: "#d9ad45", goldTrim: true },
  evening: { color: "#5c1626", tie: "#111111" },
  summer: { color: "#c9b48e", tie: "#5a3b22" },
};

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const perkIcons = [BoltIcon, ReturnIcon, CashIcon, SparkIcon];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(217,173,69,0.16),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-400">{t.home.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl">
              <span className="block text-white">{t.home.titleLine1}</span>
              <span className="text-gold-gradient block pb-[0.15em]">{t.home.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70">{t.home.subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={`/${locale}/shop`} className="btn-gold">
                {t.home.cta}
                <ArrowIcon className="size-4" />
              </Link>
              <Link href={`/${locale}/size-guide`} className="btn-outline">
                {t.home.secondaryCta}
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            
            <Image
              src="/brand/logo-icon.png"
              alt="Fast Suit"
              width={400}
              height={301}
              priority
              className="relative w-full mix-blend-lighten"
            />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-y border-white/10 bg-[#070707]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {t.home.perks.map((perk, i) => {
            const Icon = perkIcons[i];
            return (
              <div key={perk.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-400/40 text-gold-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{perk.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{!COD_DEPOSIT && "textNoDeposit" in perk ? perk.textNoDeposit : perk.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.home.featured}</h2>
          <Link href={`/${locale}/shop`} className="flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200">
            {t.home.viewAll}
            <ArrowIcon className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">{t.home.occasionsTitle}</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {OCCASIONS.map((o) => {
            const look = occasionLook[o];
            return (
              <Link
                key={o}
                href={`/${locale}/shop?occasion=${o}`}
                className="group relative flex aspect-square items-end overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,#171717,#050505)] p-5 transition hover:border-gold-400/60"
              >
                <SuitIllustration
                  color={look.color}
                  tie={look.tie}
                  goldTrim={"goldTrim" in look}
                  className="absolute -bottom-6 end-0 h-[85%] w-auto opacity-80 transition duration-300 group-hover:scale-105"
                />
                <span className="relative flex items-center gap-2 text-xl font-bold">
                  {t.occasions[o]}
                  <ArrowIcon className="size-4 text-gold-300" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Size guide banner */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-gold-400/30 bg-[linear-gradient(110deg,rgba(217,173,69,0.16),rgba(0,0,0,0)_60%)] p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t.home.bannerTitle}</h2>
            <p className="mt-2 text-white/70">{t.home.bannerText}</p>
          </div>
          <Link href={`/${locale}/size-guide`} className="btn-gold shrink-0">
            {t.home.bannerCta}
          </Link>
        </div>
      </section>
    </>
  );
}
