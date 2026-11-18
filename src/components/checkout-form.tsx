"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { GOVERNORATES, normalizeEgyptianMobile } from "@/lib/egypt";
import { calculateTotals } from "@/lib/pricing";
import { formatPrice, getProduct } from "@/lib/products";
import { cartKey, useCart } from "./cart-provider";
import { useI18n } from "./locale-provider";
import { CheckIcon } from "./icons";

type Field = "name" | "phone" | "email" | "governorate" | "city" | "street";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#0b0b0b] px-4 py-3 text-white placeholder:text-white/30 focus:border-gold-400 focus:outline-none aria-[invalid=true]:border-red-400";

function validate(values: Record<string, string>, t: Dictionary["checkout"]["errors"]): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = t.required;
  if (!normalizeEgyptianMobile(values.phone)) errors.phone = values.phone.trim() ? t.phone : t.required;
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = t.email;
  if (!values.governorate) errors.governorate = t.required;
  if (values.city.trim().length < 2) errors.city = t.required;
  if (values.street.trim().length < 5) errors.street = t.required;
  return errors;
}

export function CheckoutForm() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const { items, ready } = useCart();
  const [values, setValues] = useState({ name: "", phone: "", email: "", governorate: "", city: "", street: "", notes: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "notConfigured">("idle");

  const totals = calculateTotals(items, values.governorate || undefined);
  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values, t.checkout.errors);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale, items, paymentMethod: "cod" }),
      });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        router.push(`/${locale}/checkout/success?order=${encodeURIComponent(data.orderNumber)}&total=${data.total}`);
        return;
      }
      if (data.error === "invalid" && data.field && data.field !== "items" && data.field !== "payment") {
        setErrors({ [data.field]: data.field === "phone" ? t.checkout.errors.phone : t.checkout.errors.required });
        setStatus("idle");
        return;
      }
      setStatus(data.error === "not_configured" ? "notConfigured" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (!ready) return <div className="h-96" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold">{t.checkout.title}</h1>
        <p className="mt-4 text-white/60">{t.cart.empty}</p>
        <Link href={`/${locale}/shop`} className="btn-gold mt-8">
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  const fieldProps = (field: Field) => ({
    id: field,
    name: field,
    value: values[field],
    onChange: set(field),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });
  const error = (field: Field) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-red-400">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="text-4xl font-bold">{t.checkout.title}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t.checkout.contact}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2" htmlFor="name">
                <span className="text-sm">{t.checkout.fullName}</span>
                <input {...fieldProps("name")} autoComplete="name" className={inputClass} />
                {error("name")}
              </label>
              <label className="block" htmlFor="phone">
                <span className="text-sm">{t.checkout.phone}</span>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  placeholder="010 1234 5678"
                  className={`${inputClass} text-start rtl:text-end`}
                />
                {error("phone") ?? <p className="mt-1.5 text-xs text-white/40">{t.checkout.phoneHint}</p>}
              </label>
              <label className="block" htmlFor="email">
                <span className="text-sm">{t.checkout.email}</span>
                <input {...fieldProps("email")} type="email" autoComplete="email" dir="ltr" className={`${inputClass} text-start rtl:text-end`} />
                {error("email")}
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t.checkout.address}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block" htmlFor="governorate">
                <span className="text-sm">{t.checkout.governorate}</span>
                <select {...fieldProps("governorate")} autoComplete="address-level1" className={inputClass}>
                  <option value="">{t.checkout.chooseGovernorate}</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name[locale]}
                    </option>
                  ))}
                </select>
                {error("governorate")}
              </label>
              <label className="block" htmlFor="city">
                <span className="text-sm">{t.checkout.city}</span>
                <input {...fieldProps("city")} autoComplete="address-level2" className={inputClass} />
                {error("city")}
              </label>
              <label className="block sm:col-span-2" htmlFor="street">
                <span className="text-sm">{t.checkout.street}</span>
                <input {...fieldProps("street")} autoComplete="street-address" className={inputClass} />
                {error("street")}
              </label>
              <label className="block sm:col-span-2" htmlFor="notes">
                <span className="text-sm">{t.checkout.notes}</span>
                <textarea id="notes" name="notes" rows={3} value={values.notes} onChange={set("notes")} className={inputClass} />
              </label>
              {/* Hidden from people; catches spam bots. */}
              <input
                type="text"
                name="company"
                value={values.company}
                onChange={set("company")}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t.checkout.payment}</h2>
            <div className="mt-4 flex items-start gap-4 rounded-xl border border-gold-400 bg-gold-400/10 p-5">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-400 text-black">
                <CheckIcon className="size-4" />
              </span>
              <div>
                <p className="font-semibold">{t.checkout.cod}</p>
                <p className="mt-1 text-sm text-white/70">{t.checkout.codText}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 lg:sticky lg:top-32">
          <h2 className="font-semibold">{t.checkout.summary}</h2>
          <ul className="mt-4 space-y-3 border-b border-white/10 pb-4 text-sm">
            {items.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              const color = product.colors.find((c) => c.id === item.colorId) ?? product.colors[0];
              return (
                <li key={cartKey(item)} className="flex justify-between gap-4">
                  <span>
                    {product.name[locale]} × {item.quantity}
                    <span className="block text-white/50">
                      {color.name[locale]} · {t.fits[item.fit]} · EU {item.size}
                    </span>
                  </span>
                  <span className="shrink-0">{formatPrice(product.price * item.quantity, locale)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/70">{t.cart.subtotal}</dt>
              <dd>{formatPrice(totals.subtotal, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">{t.checkout.delivery}</dt>
              <dd className={totals.shipping === null ? "text-white/50" : ""}>
                {totals.shipping === null
                  ? t.checkout.chooseGovernorateFirst
                  : totals.shipping === 0
                    ? t.checkout.free
                    : formatPrice(totals.shipping, locale)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <dt>{t.checkout.total}</dt>
              <dd className="text-gold-300">{formatPrice(totals.total, locale)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={status === "sending"} className="btn-gold mt-6 w-full">
            {status === "sending" ? t.checkout.placing : t.checkout.placeOrder}
          </button>
          {status === "error" && <p className="mt-3 text-sm text-red-400">{t.checkout.errors.general}</p>}
          {status === "notConfigured" && <p className="mt-3 text-sm text-red-400">{t.checkout.errors.notConfigured}</p>}
          <Link href={`/${locale}/cart`} className="mt-4 block text-center text-sm text-white/60 hover:text-gold-300">
            {t.checkout.backToCart}
          </Link>
        </aside>
      </div>
    </form>
  );
}
