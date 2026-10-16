import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
export const metadata: Metadata = {
  alternates: { canonical: "/terms" }, title: "Terms of Use & Sale" };
export default function TermsPage() {
  return (
    <PolicyPage eyebrow="Site and sale terms" title="Terms of use & sale">
      <h2>Website content</h2>
      <p>
        Photography, writing, branding, and other site content remain protected by their respective rights. Viewing the
        site does not grant permission to reproduce, train on, distribute, resell, or commercially use the work.
      </p>
      <h2>Orders</h2>
      <p>
        An inquiry or cart submission is not an accepted order. An order is accepted only after its specifications,
        total price, delivery terms, and payment are confirmed. An order may be declined or cancelled if pricing or
        availability is incorrect, payment cannot be completed, or production cannot be fulfilled.
      </p>
      <h2>Product presentation</h2>
      <p>
        Displays vary, so physical prints may differ modestly from screen previews. The material, dimensions, finish,
        and other specifications confirmed for the order control if a preview differs from the final selection.
      </p>
      <h2>Pricing and taxes</h2>
      <p>
        Prices are stored in integer cents and recalculated on the server. Applicable shipping, taxes, discounts,
        duties, and currency rules will be displayed through the configured checkout.
      </p>
      <h2>Photography services</h2>
      <p>
        Service inquiries do not create a booking. Scope, price, usage rights, deliverables, payment schedule,
        cancellation, and rescheduling should be governed by a separate signed agreement.
      </p>
      <h2>Governing terms</h2>
      <p>
        These terms are governed by applicable United States and Kansas law. Nothing in these terms limits rights that
        cannot legally be waived. Questions or concerns should first be sent through the contact information below.
      </p>
    </PolicyPage>
  );
}
