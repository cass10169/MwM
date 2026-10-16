import type { Metadata } from "next";
import { OrderLookupForm } from "@/components/order-lookup-form";
export const metadata: Metadata = { title: "Order Lookup", robots: { index: false, follow: false } };
export default function OrderLookupPage() {
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-narrow">
        <p className="eyebrow ink">Private order access</p>
        <h1 className="display-title">View an existing order.</h1>
        <p>For privacy, order details are delivered through a secure link sent to the address used at checkout.</p>
        <OrderLookupForm />
      </div>
    </main>
  );
}
