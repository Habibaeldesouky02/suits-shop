import type { Fit, Occasion } from "./config";
import type { Locale } from "@/i18n/config";

type Localized = Record<Locale, string>;

export type ProductColor = {
  id: string;
  name: Localized;
  /** Main fabric colour, used for the swatch and the illustration. */
  hex: string;
  /** Tie colour shown in the illustration. */
  tie?: string;
};

export type Product = {
  id: string;
  /**
   * The product's own code, shown on its page and used instead of the name in
   * the order messages you receive. Every product needs a different code.
   */
  code: string;
  /** Last part of the product's link: <your site>/product/<slug> */
  slug: string;
  name: Localized;
  description: Localized;
  details: Record<Locale, string[]>;
  /** Price in piasters (EGP × 100), e.g. 899900 = EGP 8,999. */
  price: number;
  /** Optional old price in piasters, shown crossed out. */
  compareAtPrice?: number;
  colors: ProductColor[];
  fits: Fit[];
  occasions: Occasion[];
  featured?: boolean;
  isNew?: boolean;
  /** Gold lapel trim in the illustration (tuxedos). */
  goldTrim?: boolean;
  /**
   * Real product photos in /public/products, e.g. ["/products/midnight-classic-1.jpg"].
   * While this is empty, a drawn illustration in the suit's colour is shown instead.
   */
  images?: string[];
};

const GOLD = "#d9ad45";

export const products: Product[] = [
  {
    id: "midnight-classic",
    code: "FS-101",
    slug: "midnight-classic",
    name: { en: "Midnight Classic", ar: "ميدنايت كلاسيك" },
    description: {
      en: "The essential black two-piece suit. Clean lines, a sharp shoulder and a fabric that keeps its shape from the first meeting to the last dance.",
      ar: "البدلة السودا الأساسية اللي لازم تبقى عندك. قَصّة نضيفة وكتف مظبوط، وقماشة بتفضل محافظة على شكلها من أول اجتماع لحد آخر رقصة.",
    },
    details: {
      en: ["Super 120s wool blend", "Two-button jacket, notch lapel", "Flat-front trousers", "Fully lined"],
      ar: ["صوف سوبر 120", "جاكيت بزرارين وياقة كلاسيك", "بنطلون من غير كسرات", "مبطّنة بالكامل"],
    },
    price: 899900,
    colors: [
      { id: "black", name: { en: "Black", ar: "أسود" }, hex: "#16161a", tie: GOLD },
      { id: "navy", name: { en: "Navy", ar: "كحلي" }, hex: "#1b2540", tie: "#9aa4b8" },
    ],
    fits: ["slim", "regular"],
    occasions: ["business", "wedding", "evening"],
    featured: true,
  },
  {
    id: "gold-edge-tuxedo",
    code: "FS-102",
    slug: "gold-edge-tuxedo",
    name: { en: "Gold Edge Tuxedo", ar: "توكسيدو جولد إيدج" },
    description: {
      en: "Our signature tuxedo with satin lapels finished in a fine gold edge. Made for weddings, galas and every night that matters.",
      ar: "التوكسيدو المميز بتاعنا بياقة ساتان وحرف دهبي رفيع. معمول للأفراح والحفلات وكل ليلة مهمة.",
    },
    details: {
      en: ["Wool with satin peak lapels", "One-button jacket", "Trousers with satin side stripe", "Gold-trim detailing"],
      ar: ["صوف بياقة ساتان مدببة", "جاكيت بزرار واحد", "بنطلون بشريط ساتان على الجنب", "تفاصيل بحرف دهبي"],
    },
    price: 1249900,
    colors: [{ id: "black", name: { en: "Black", ar: "أسود" }, hex: "#0e0e10", tie: GOLD }],
    fits: ["slim", "regular"],
    occasions: ["wedding", "evening"],
    featured: true,
    isNew: true,
    goldTrim: true,
  },
  {
    id: "navy-executive",
    code: "FS-103",
    slug: "navy-executive",
    name: { en: "Navy Executive", ar: "نيفي إكزكيوتيف" },
    description: {
      en: "A deep navy suit that works five days a week. Breathable, comfortable and always professional.",
      ar: "بدلة كحلي غامق تنفعك طول أيام الشغل. مريحة وبتهوّي، وشكلك فيها محترم دايماً.",
    },
    details: {
      en: ["Stretch wool blend", "Two-button jacket", "Hidden inner phone pocket", "Machine-washable trousers"],
      ar: ["صوف مرن", "جاكيت بزرارين", "جيب داخلي مخفي للموبايل", "بنطلون يتغسل في الغسالة"],
    },
    price: 799900,
    compareAtPrice: 949900,
    colors: [
      { id: "navy", name: { en: "Navy", ar: "كحلي" }, hex: "#1a2744", tie: "#7b1e2b" },
      { id: "blue", name: { en: "Royal blue", ar: "أزرق رويال" }, hex: "#24408e", tie: "#e7e7e7" },
    ],
    fits: ["slim", "regular"],
    occasions: ["business"],
    featured: true,
  },
  {
    id: "charcoal-signature",
    code: "FS-104",
    slug: "charcoal-signature",
    name: { en: "Charcoal Signature", ar: "تشاركول سيغنتشر" },
    description: {
      en: "Charcoal grey with a subtle texture. Easier to wear than black and just as sharp.",
      ar: "رمادي غامق بملمس خفيف. أسهل في اللبس من الأسود وشيك زيه بالظبط.",
    },
    details: {
      en: ["Textured wool blend", "Two-button jacket", "Half-lined for comfort", "Slanted pockets"],
      ar: ["صوف بملمس مميز", "جاكيت بزرارين", "نص بطانة عشان تبقى مريحة", "جيوب مايلة"],
    },
    price: 849900,
    colors: [{ id: "charcoal", name: { en: "Charcoal", ar: "رمادي غامق" }, hex: "#3a3b3f", tie: GOLD }],
    fits: ["slim", "regular"],
    occasions: ["business", "evening"],
    featured: true,
  },
  {
    id: "silver-light",
    code: "FS-105",
    slug: "silver-light",
    name: { en: "Silver Light", ar: "سيلفر لايت" },
    description: {
      en: "Light grey and lightweight. A modern choice for daytime weddings and summer events.",
      ar: "رمادي فاتح وخفيف. اختيار عصري لأفراح النهار ومناسبات الصيف.",
    },
    details: {
      en: ["Lightweight tropical wool", "Two-button jacket", "Unstructured shoulder", "Half-lined"],
      ar: ["صوف صيفي خفيف", "جاكيت بزرارين", "كتف طبيعي من غير حشو", "نص بطانة"],
    },
    price: 749900,
    colors: [{ id: "light-grey", name: { en: "Light grey", ar: "رمادي فاتح" }, hex: "#9fa3aa", tie: "#1b2540" }],
    fits: ["slim", "regular"],
    occasions: ["wedding", "summer"],
    isNew: true,
  },
  {
    id: "sand-linen",
    code: "FS-106",
    slug: "sand-linen",
    name: { en: "Sand Linen", ar: "ساند لينن" },
    description: {
      en: "Pure linen in a warm sand tone. Cool on hot days, relaxed but still polished.",
      ar: "كتان طبيعي بلون بيج دافي. مريح في الحر، وكاجوال بس برضه شيك.",
    },
    details: {
      en: ["100% linen", "Patch pockets", "Unlined jacket", "Tailored trousers"],
      ar: ["كتان 100%", "جيوب خارجية", "جاكيت من غير بطانة", "بنطلون متفصّل"],
    },
    price: 649900,
    colors: [
      { id: "sand", name: { en: "Sand", ar: "بيج" }, hex: "#c9b48e", tie: "#5a3b22" },
      { id: "olive", name: { en: "Olive", ar: "زيتي" }, hex: "#6b6a45", tie: "#e9dcc0" },
    ],
    fits: ["regular"],
    occasions: ["summer", "wedding"],
  },
  {
    id: "burgundy-velvet",
    code: "FS-107",
    slug: "burgundy-velvet",
    name: { en: "Burgundy Velvet", ar: "برغندي فيلفت" },
    description: {
      en: "A rich burgundy velvet dinner suit for when you want to stand out.",
      ar: "بدلة سهرة قطيفة نبيتي لو عايز تبقى مختلف وسط الكل.",
    },
    details: {
      en: ["Cotton velvet", "Shawl lapel", "One-button jacket", "Black satin-trim trousers"],
      ar: ["قطيفة قطن", "ياقة شال", "جاكيت بزرار واحد", "بنطلون أسود بحرف ساتان"],
    },
    price: 1099900,
    colors: [{ id: "burgundy", name: { en: "Burgundy", ar: "نبيتي" }, hex: "#5c1626", tie: "#111111" }],
    fits: ["slim"],
    occasions: ["evening", "wedding"],
    isNew: true,
  },
  {
    id: "heritage-brown",
    code: "FS-108",
    slug: "heritage-brown",
    name: { en: "Heritage Brown", ar: "هيريتج براون" },
    description: {
      en: "A warm brown suit with a classic feel. Pairs perfectly with white or light blue shirts.",
      ar: "بدلة بني دافي بروح كلاسيك. بتيجي حلوة جداً مع قميص أبيض أو لبني.",
    },
    details: {
      en: ["Wool flannel blend", "Two-button jacket", "Ticket pocket", "Fully lined"],
      ar: ["صوف فلانيل", "جاكيت بزرارين", "جيب صغير زيادة", "مبطّنة بالكامل"],
    },
    price: 779900,
    colors: [{ id: "brown", name: { en: "Brown", ar: "بني" }, hex: "#5a3e2b", tie: "#c9b48e" }],
    fits: ["regular"],
    occasions: ["business"],
  },
];

/** The product's own page, e.g. https://fastsuit.com.eg/product/midnight-classic (opens in the visitor's language). */
export function productLink(product: Pick<Product, "slug">, siteUrl: string) {
  return `${siteUrl.replace(/\/$/, "")}/product/${product.slug}`;
}

export function getProduct(slugOrId: string) {
  return products.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function formatPrice(piasters: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG-u-nu-latn" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: piasters % 100 === 0 ? 0 : 2,
  }).format(piasters / 100);
}
