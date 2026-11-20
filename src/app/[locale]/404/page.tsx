import NotFound from "../not-found";

/**
 * Pre-built "page not found" page for each language (/en/404, /ar/404).
 * The Cloudflare Worker shows it for addresses that don't exist.
 */
export const metadata = { robots: { index: false } };

export default function NotFoundPage() {
  return <NotFound />;
}
