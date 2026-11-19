"use client";

import { useState } from "react";
import { fill } from "@/i18n/config";
import { sizeLabel, suggestSize } from "@/lib/sizes";
import { useI18n } from "./locale-provider";

const inputClass =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#0b0b0b] px-4 py-3 text-lg text-white placeholder:text-white/30 focus:border-gold-400 focus:outline-none";

export function SizeFinder() {
  const { t } = useI18n();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const w = Number(weight.replace(",", "."));
  const h = Number(height.replace(",", "."));
  const filled = weight.trim() !== "" && height.trim() !== "";
  const result = filled ? suggestSize(w, h) : null;

  return (
    <section className="mt-10 rounded-2xl border border-gold-400/40 bg-[linear-gradient(120deg,rgba(217,173,69,0.14),rgba(0,0,0,0)_60%)] p-6 sm:p-8">
      <h2 className="text-2xl font-bold">{t.sizeGuide.finderTitle}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm">{t.sizeGuide.finderWeight}</span>
          <input
            type="number"
            inputMode="numeric"
            min={40}
            max={150}
            placeholder="80"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm">{t.sizeGuide.finderHeight}</span>
          <input
            type="number"
            inputMode="numeric"
            min={140}
            max={210}
            placeholder="175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div aria-live="polite" className="mt-6 min-h-16">
        {!result && <p className="text-white/60">{t.sizeGuide.finderEmpty}</p>}
        {result?.status === "outOfRange" && <p className="text-white/80">{t.sizeGuide.finderOut}</p>}
        {result?.status === "ok" && (
          <>
            <p className="text-3xl font-extrabold">
              <span className="text-gold-gradient">{fill(t.sizeGuide.finderResult, { size: sizeLabel(result.size) })}</span>
            </p>
            {result.tallerSize && (
              <p className="mt-2 text-white/70">{fill(t.sizeGuide.finderTall, { size: sizeLabel(result.tallerSize) })}</p>
            )}
          </>
        )}
      </div>
      <p className="mt-4 text-xs text-white/40">{t.sizeGuide.finderNote}</p>
    </section>
  );
}
