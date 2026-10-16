import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Checkout Cancelled", robots: { index: false, follow: false } };
export default function OrderCancelledPage() {
  return (
    <main id="main-content" className="status-page section-ivory">
      <div className="container-narrow">
        <p className="eyebrow ink">Checkout paused</p>
        <h1>Your photographs are still in the cart.</h1>
        <p>No payment was completed. You can review your selections, make changes, or return whenever you are ready.</p>
        <div className="button-row">
          <Link className="button button-dark" href="/cart">
            Return to cart
          </Link>
          <Link className="text-link" href="/prints">
            Continue browsing →
          </Link>
        </div>
      </div>
    </main>
  );
}
