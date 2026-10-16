import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
export const metadata: Metadata = { title: "Cart", robots: { index: false, follow: false } };
export default function CartPage() {
  return (
    <main id="main-content" className="section section-ivory">
      <div className="container-wide">
        <CartView />
      </div>
    </main>
  );
}
