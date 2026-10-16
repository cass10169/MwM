import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";
export const metadata: Metadata = { title: "Order Received", robots: { index: false, follow: false } };
export default function OrderSuccessPage() {
  return (
    <main id="main-content" className="status-page section-dark">
      <ClearCart />
      <div className="container-narrow">
        <p className="eyebrow">Order received</p>
        <h1>Thank you for bringing a memory home.</h1>
        <p>
          Payment confirmation and order details will be sent by email. Production updates and tracking will follow as
          your print moves through the lab.
        </p>
        <div className="button-row">
          <Link className="button button-light" href="/portfolio">
            Return to the portfolio
          </Link>
          <Link className="text-link light" href="/contact">
            Contact Michael →
          </Link>
        </div>
      </div>
    </main>
  );
}
