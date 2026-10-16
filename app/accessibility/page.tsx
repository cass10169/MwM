import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";
export const metadata: Metadata = {
  alternates: { canonical: "/accessibility" }, title: "Accessibility Statement" };
export default function AccessibilityPage() {
  return (
    <PolicyPage eyebrow="Inclusive access" title="Accessibility statement">
      <h2>Commitment</h2>
      <p>
        Memories with Mike is designed toward WCAG 2.2 Level AA, including keyboard access, visible focus, meaningful
        alternative text, sufficient contrast, logical structure, reduced motion, and accessible forms.
      </p>
      <h2>Photography descriptions</h2>
      <p>
        Published photographs include alternative text describing the visible subject and setting while preserving the
        purpose of the surrounding page.
      </p>
      <h2>Ongoing review</h2>
      <p>
        The site is reviewed with automated checks and manual testing for keyboard navigation, zoom, contrast, reduced
        motion, and common assistive-technology patterns. New content and third-party features are reviewed as they are
        added.
      </p>
      <h2>Feedback</h2>
      <p>
        If any part of the site is difficult to access, include the page, device, browser, and problem in your message
        so it can be investigated.
      </p>
    </PolicyPage>
  );
}
