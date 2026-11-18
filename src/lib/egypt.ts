import type { ShippingZone } from "./config";
import type { Locale } from "@/i18n/config";

export type Governorate = { id: string; name: Record<Locale, string>; zone: ShippingZone };

/** All 27 governorates of Egypt with their delivery zone. */
export const GOVERNORATES: Governorate[] = [
  { id: "cairo", name: { en: "Cairo", ar: "القاهرة" }, zone: "cairo" },
  { id: "giza", name: { en: "Giza", ar: "الجيزة" }, zone: "cairo" },
  { id: "qalyubia", name: { en: "Qalyubia", ar: "القليوبية" }, zone: "cairo" },
  { id: "alexandria", name: { en: "Alexandria", ar: "الإسكندرية" }, zone: "delta" },
  { id: "dakahlia", name: { en: "Dakahlia", ar: "الدقهلية" }, zone: "delta" },
  { id: "sharqia", name: { en: "Sharqia", ar: "الشرقية" }, zone: "delta" },
  { id: "gharbia", name: { en: "Gharbia", ar: "الغربية" }, zone: "delta" },
  { id: "monufia", name: { en: "Monufia", ar: "المنوفية" }, zone: "delta" },
  { id: "beheira", name: { en: "Beheira", ar: "البحيرة" }, zone: "delta" },
  { id: "kafr-el-sheikh", name: { en: "Kafr El Sheikh", ar: "كفر الشيخ" }, zone: "delta" },
  { id: "damietta", name: { en: "Damietta", ar: "دمياط" }, zone: "delta" },
  { id: "port-said", name: { en: "Port Said", ar: "بورسعيد" }, zone: "delta" },
  { id: "ismailia", name: { en: "Ismailia", ar: "الإسماعيلية" }, zone: "delta" },
  { id: "suez", name: { en: "Suez", ar: "السويس" }, zone: "delta" },
  { id: "faiyum", name: { en: "Faiyum", ar: "الفيوم" }, zone: "upper" },
  { id: "beni-suef", name: { en: "Beni Suef", ar: "بني سويف" }, zone: "upper" },
  { id: "minya", name: { en: "Minya", ar: "المنيا" }, zone: "upper" },
  { id: "asyut", name: { en: "Asyut", ar: "أسيوط" }, zone: "upper" },
  { id: "sohag", name: { en: "Sohag", ar: "سوهاج" }, zone: "upper" },
  { id: "qena", name: { en: "Qena", ar: "قنا" }, zone: "upper" },
  { id: "luxor", name: { en: "Luxor", ar: "الأقصر" }, zone: "upper" },
  { id: "aswan", name: { en: "Aswan", ar: "أسوان" }, zone: "upper" },
  { id: "red-sea", name: { en: "Red Sea", ar: "البحر الأحمر" }, zone: "upper" },
  { id: "new-valley", name: { en: "New Valley", ar: "الوادي الجديد" }, zone: "upper" },
  { id: "matrouh", name: { en: "Matrouh", ar: "مطروح" }, zone: "upper" },
  { id: "north-sinai", name: { en: "North Sinai", ar: "شمال سيناء" }, zone: "upper" },
  { id: "south-sinai", name: { en: "South Sinai", ar: "جنوب سيناء" }, zone: "upper" },
];

export function getGovernorate(id: string) {
  return GOVERNORATES.find((g) => g.id === id);
}

/**
 * Normalises an Egyptian mobile number to the form 01XXXXXXXXX.
 * Accepts +20, 0020 or 0 prefixes, spaces and dashes. Returns null if invalid.
 */
export function normalizeEgyptianMobile(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "").replace(/^(\+20|0020)/, "0");
  const withZero = digits.startsWith("1") ? `0${digits}` : digits;
  return /^01[0125]\d{8}$/.test(withZero) ? withZero : null;
}
