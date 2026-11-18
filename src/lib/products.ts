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
    slug: "midnight-classic",
    name: { en: "Midnight Classic", ar: "ميدنايت كلاسيك" },
    description: {
      en: "The essential black two-piece suit. Clean lines, a sharp shoulder and a fabric that keeps its shape from the first meeting to the last dance.",
      ar: "البدلة السوداء الأساسية من قطعتين. خطوط نظيفة وأكتاف محددة وقماش يحافظ على شكله من أول اجتماع حتى آخر رقصة.",
    },
    details: {
      en: ["Super 120s wool blend", "Two-button jacket, notch lapel", "Flat-front trousers", "Fully lined"],
      ar: ["مزيج صوف سوبر 120", "جاكيت بزرين وياقة كلاسيكية", "بنطال بدون ثنيات", "مبطّنة بالكامل"],
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
    slug: "gold-edge-tuxedo",
    name: { en: "Gold Edge Tuxedo", ar: "توكسيدو جولد إيدج" },
    description: {
      en: "Our signature tuxedo with satin lapels finished in a fine gold edge. Made for weddings, galas and every night that matters.",
      ar: "التوكسيدو المميز لدينا بياقة ساتان بحافة ذهبية رفيعة. مصمم للأعراس والحفلات وكل ليلة مهمة.",
    },
    details: {
      en: ["Wool with satin peak lapels", "One-button jacket", "Trousers with satin side stripe", "Gold-trim detailing"],
      ar: ["صوف مع ياقة ساتان مدببة", "جاكيت بزر واحد", "بنطال بشريط ساتان جانبي", "تفاصيل بحواف ذهبية"],
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
    slug: "navy-executive",
    name: { en: "Navy Executive", ar: "نيفي إكزكيوتيف" },
    description: {
      en: "A deep navy suit that works five days a week. Breathable, comfortable and always professional.",
      ar: "بدلة كحلية داكنة تناسب كل أيام العمل. مريحة وجيدة التهوية واحترافية دائماً.",
    },
    details: {
      en: ["Stretch wool blend", "Two-button jacket", "Hidden inner phone pocket", "Machine-washable trousers"],
      ar: ["مزيج صوف مرن", "جاكيت بزرين", "جيب داخلي مخفي للهاتف", "بنطال قابل للغسل في الغسالة"],
    },
    price: 799900,
    compareAtPrice: 949900,
    colors: [
      { id: "navy", name: { en: "Navy", ar: "كحلي" }, hex: "#1a2744", tie: "#7b1e2b" },
      { id: "blue", name: { en: "Royal blue", ar: "أزرق ملكي" }, hex: "#24408e", tie: "#e7e7e7" },
    ],
    fits: ["slim", "regular"],
    occasions: ["business"],
    featured: true,
  },
  {
    id: "charcoal-signature",
    slug: "charcoal-signature",
    name: { en: "Charcoal Signature", ar: "تشاركول سيغنتشر" },
    description: {
      en: "Charcoal grey with a subtle texture. Easier to wear than black and just as sharp.",
      ar: "رمادي فحمي بملمس ناعم. أسهل في الارتداء من الأسود وبنفس الأناقة.",
    },
    details: {
      en: ["Textured wool blend", "Two-button jacket", "Half-lined for comfort", "Slanted pockets"],
      ar: ["مزيج صوف بملمس مميز", "جاكيت بزرين", "مبطّنة جزئياً لراحة أكبر", "جيوب مائلة"],
    },
    price: 849900,
    colors: [{ id: "charcoal", name: { en: "Charcoal", ar: "فحمي" }, hex: "#3a3b3f", tie: GOLD }],
    fits: ["slim", "regular"],
    occasions: ["business", "evening"],
    featured: true,
  },
  {
    id: "silver-light",
    slug: "silver-light",
    name: { en: "Silver Light", ar: "سيلفر لايت" },
    description: {
      en: "Light grey and lightweight. A modern choice for daytime weddings and summer events.",
      ar: "رمادي فاتح وخفيف الوزن. خيار عصري لأعراس النهار ومناسبات الصيف.",
    },
    details: {
      en: ["Lightweight tropical wool", "Two-button jacket", "Unstructured shoulder", "Half-lined"],
      ar: ["صوف استوائي خفيف", "جاكيت بزرين", "أكتاف ناعمة غير مبطنة", "مبطّنة جزئياً"],
    },
    price: 749900,
    colors: [{ id: "light-grey", name: { en: "Light grey", ar: "رمادي فاتح" }, hex: "#9fa3aa", tie: "#1b2540" }],
    fits: ["slim", "regular"],
    occasions: ["wedding", "summer"],
    isNew: true,
  },
  {
    id: "sand-linen",
    slug: "sand-linen",
    name: { en: "Sand Linen", ar: "ساند لينن" },
    description: {
      en: "Pure linen in a warm sand tone. Cool on hot days, relaxed but still polished.",
      ar: "كتان خالص بلون رملي دافئ. منعش في الأيام الحارة، مريح وأنيق في نفس الوقت.",
    },
    details: {
      en: ["100% linen", "Patch pockets", "Unlined jacket", "Tailored trousers"],
      ar: ["كتان 100%", "جيوب خارجية", "جاكيت بدون بطانة", "بنطال مفصّل"],
    },
    price: 649900,
    colors: [
      { id: "sand", name: { en: "Sand", ar: "رملي" }, hex: "#c9b48e", tie: "#5a3b22" },
      { id: "olive", name: { en: "Olive", ar: "زيتي" }, hex: "#6b6a45", tie: "#e9dcc0" },
    ],
    fits: ["regular"],
    occasions: ["summer", "wedding"],
  },
  {
    id: "burgundy-velvet",
    slug: "burgundy-velvet",
    name: { en: "Burgundy Velvet", ar: "برغندي فيلفت" },
    description: {
      en: "A rich burgundy velvet dinner suit for when you want to stand out.",
      ar: "بدلة سهرة من المخمل العنابي الفاخر لمن يريد أن يكون مميزاً.",
    },
    details: {
      en: ["Cotton velvet", "Shawl lapel", "One-button jacket", "Black satin-trim trousers"],
      ar: ["مخمل قطني", "ياقة شال", "جاكيت بزر واحد", "بنطال أسود بحواف ساتان"],
    },
    price: 1099900,
    colors: [{ id: "burgundy", name: { en: "Burgundy", ar: "عنابي" }, hex: "#5c1626", tie: "#111111" }],
    fits: ["slim"],
    occasions: ["evening", "wedding"],
    isNew: true,
  },
  {
    id: "heritage-brown",
    slug: "heritage-brown",
    name: { en: "Heritage Brown", ar: "هيريتج براون" },
    description: {
      en: "A warm brown suit with a classic feel. Pairs perfectly with white or light blue shirts.",
      ar: "بدلة بنية دافئة بطابع كلاسيكي. تتناسب تماماً مع القمصان البيضاء أو الزرقاء الفاتحة.",
    },
    details: {
      en: ["Wool flannel blend", "Two-button jacket", "Ticket pocket", "Fully lined"],
      ar: ["مزيج صوف فلانيل", "جاكيت بزرين", "جيب تذاكر إضافي", "مبطّنة بالكامل"],
    },
    price: 779900,
    colors: [{ id: "brown", name: { en: "Brown", ar: "بني" }, hex: "#5a3e2b", tie: "#c9b48e" }],
    fits: ["regular"],
    occasions: ["business"],
  },
];

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
