import type { NextConfig } from "next";

/**
 * The site is exported as plain static files (the `out` folder) and served by
 * Cloudflare. Orders and the language redirect are handled by the small
 * Cloudflare Worker in /worker.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
