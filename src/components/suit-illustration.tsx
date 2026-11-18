/**
 * A drawn suit in any colour. Used as the product picture until real photos
 * are added to the product's `images` list.
 */
export function SuitIllustration({
  color,
  tie = "#d9ad45",
  goldTrim = false,
  className,
}: {
  color: string;
  tie?: string;
  goldTrim?: boolean;
  className?: string;
}) {
  const id = `s${color.replace("#", "")}${goldTrim ? "g" : ""}`;
  const trim = goldTrim ? "#d9ad45" : "rgba(255,255,255,0.10)";

  return (
    <svg viewBox="0 0 300 360" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Jacket body */}
      <path d="M118 58 Q60 66 34 100 Q24 116 22 140 L16 360 L284 360 L278 140 Q276 116 266 100 Q240 66 182 58 Z" fill={color} />
      <path d="M118 58 Q60 66 34 100 Q24 116 22 140 L16 360 L284 360 L278 140 Q276 116 266 100 Q240 66 182 58 Z" fill={`url(#${id}-sheen)`} />

      {/* Sleeve seams */}
      <path d="M66 112 Q58 230 56 360" stroke="#000" strokeOpacity="0.25" strokeWidth="2" fill="none" />
      <path d="M234 112 Q242 230 244 360" stroke="#000" strokeOpacity="0.25" strokeWidth="2" fill="none" />

      {/* Shirt */}
      <path d="M118 58 L182 58 L150 222 Z" fill="#f4f4f2" />
      {/* Tie */}
      <path d="M143 80 L157 80 L161 92 L155 196 L150 208 L145 196 L139 92 Z" fill={tie} />
      <path d="M143 80 L157 80 L154 92 L146 92 Z" fill="#000" fillOpacity="0.18" />
      {/* Collar */}
      <path d="M118 56 L150 80 L130 98 L112 64 Z" fill="#ffffff" />
      <path d="M182 56 L150 80 L170 98 L188 64 Z" fill="#ffffff" />

      {/* Lapels */}
      <path d="M116 62 L96 120 L112 128 L150 232 L126 64 Z" fill={color} stroke={trim} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M184 62 L204 120 L188 128 L150 232 L174 64 Z" fill={color} stroke={trim} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M116 62 L96 120 L112 128 L150 232 L126 64 Z" fill="#000" fillOpacity="0.18" />
      <path d="M184 62 L204 120 L188 128 L150 232 L174 64 Z" fill="#fff" fillOpacity="0.05" />

      {/* Front opening */}
      <path d="M150 232 L150 300 Q146 334 128 360" stroke="#000" strokeOpacity="0.35" strokeWidth="2" fill="none" />

      {/* Breast pocket + pocket square */}
      <path d="M196 170 L234 164" stroke="#000" strokeOpacity="0.35" strokeWidth="3" />
      <path d="M204 168 L214 152 L226 166 Z" fill={goldTrim ? "#d9ad45" : "#f4f4f2"} />

      {/* Lower pockets */}
      <path d="M58 276 L118 272" stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M182 272 L242 276" stroke="#000" strokeOpacity="0.3" strokeWidth="3" />

      {/* Buttons */}
      <circle cx="150" cy="250" r="5" fill="#000" fillOpacity="0.55" />
      <circle cx="150" cy="284" r="5" fill="#000" fillOpacity="0.55" />
    </svg>
  );
}
