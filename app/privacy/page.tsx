import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
export const metadata: Metadata = {
  alternates: { canonical: "/privacy" }, title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <PolicyPage eyebrow="Your information" title="Privacy policy">
      <h2>Information collected</h2>
      <p>
        The site collects information you choose to submit through inquiries, newsletter registration, checkout, order
        support, and administrative access. This may include your name, contact information, project details, delivery
        information, and communication preferences.
      </p>
      <h2>Payments</h2>
      <p>
        When online purchasing is enabled, payment details are collected and processed by Stripe. Memories with Mike
        does not store full payment-card numbers.
      </p>
      <h2>How information is used</h2>
      <p>
        Information may be used to respond to inquiries, fulfill and support orders, provide requested communications,
        secure the service, and understand aggregate site performance.
      </p>
      <h2>Service providers</h2>
      <p>
        Cloudflare provides hosting, database, and media-storage services. Stripe processes payments when checkout is
        enabled. Email and fulfillment providers receive only the information needed to deliver the requested service.
      </p>
      <h2>Retention and requests</h2>
      <p>
        Records are retained only as long as reasonably needed for inquiries, orders, security, accounting, and legal
        obligations. You may request access, correction, deletion, or an email opt-out through the contact information
        below.
      </p>
      <h2>Cookies and analytics</h2>
      <p>
        Only essential storage should operate by default. Optional analytics must respect the configured consent
        requirements and should not run within administrative pages.
      </p>
    </PolicyPage>
  );
}
