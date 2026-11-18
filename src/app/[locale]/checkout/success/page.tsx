import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/checkout-success";

export const metadata = { robots: { index: false } };

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      {/* Reads ?session_id= from the URL, so it renders in the browser. */}
      <Suspense fallback={<div className="h-64" />}>
        <CheckoutSuccess />
      </Suspense>
    </div>
  );
}
