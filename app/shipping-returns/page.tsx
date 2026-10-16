import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
export const metadata: Metadata = {
  alternates: { canonical: "/shipping-returns" }, title: "Shipping & Returns" };
export default function ShippingReturnsPage() {
  return (
    <PolicyPage eyebrow="Customer care" title="Shipping, delivery & returns">
      <h2>Made-to-order production</h2>
      <p>
        Fine-art prints are produced after an order is confirmed. Online purchasing is currently unavailable; current
        production timing, delivery options, and shipping charges are provided with each print quote.
      </p>
      <h2>Order review</h2>
      <p>
        Customers should review the photograph, material, dimensions, finish, frame, border, mat, and delivery address
        before payment. The order confirmation will preserve a snapshot of the selected options.
      </p>
      <h2>Damage or production defects</h2>
      <p>
        Report shipping damage or a production defect promptly and include photographs of the print and packaging.
        Retain the print and all packaging while the issue is reviewed.
      </p>
      <h2>Returns and cancellations</h2>
      <p>
        Because prints are made to order, cancellation and return eligibility depends on production status and the type
        of customization. The terms for a quoted order are provided before payment.
      </p>
      <h2>International delivery</h2>
      <p>
        International availability is confirmed individually. Any customs charges, duties, taxes, and estimated
        delivery timing are disclosed before an international order is accepted.
      </p>
    </PolicyPage>
  );
}
