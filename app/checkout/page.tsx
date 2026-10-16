import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";
export const metadata: Metadata = { title: "Secure Checkout", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-wide">
        <CheckoutView />
      </div>
    </main>
  );
}
