import Image from "next/image";
import type { Product, ProductColor } from "@/lib/products";
import { SuitIllustration } from "./suit-illustration";

/** Shows the product photo if there is one, otherwise the drawn suit in the chosen colour. */
export function ProductVisual({
  product,
  color,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className = "",
}: {
  product: Product;
  color?: ProductColor;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const c = color ?? product.colors[0];
  const photo = product.images?.[0];

  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(217,173,69,0.18),_transparent_60%),linear-gradient(180deg,#161616,#070707)] ${className}`}
    >
      {photo ? (
        <Image src={photo} alt={product.name.en} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <SuitIllustration
          color={c.hex}
          tie={c.tie}
          goldTrim={product.goldTrim}
          className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        />
      )}
    </div>
  );
}
