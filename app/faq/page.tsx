import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
const faqs = [
  [
    "What print materials will be available?",
    "Prints may be prepared on archival paper, metal, acrylic, or canvas. Contact the studio for the materials and sizes currently recommended for a particular photograph.",
  ],
  [
    "Are the photographs limited editions?",
    "Most current work is offered as an open edition. Any limited edition will be identified clearly with its edition size before purchase.",
  ],
  [
    "How long does production take?",
    "Production time depends on material, size, framing, and the selected lab. A current estimate is included with the print quote before payment.",
  ],
  [
    "Can you help me choose a size?",
    "Yes. Send a photograph of the wall, approximate dimensions, viewing distance, and the print you are considering through the contact page.",
  ],
  [
    "Do you photograph weddings and families?",
    "Yes. Memories with Mike also offers weddings, graduations, family portraits, events, and commissioned photography.",
  ],
  [
    "Will my print look exactly like my screen?",
    "Screens vary in brightness and color. Each approved print file is prepared for its material, but small differences between a backlit display and a physical print are normal.",
  ],
  [
    "Can I order a custom size?",
    "Use the contact page to ask about custom dimensions, panoramic formats, commercial installations, or coordinated groups of prints.",
  ],
];
export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Frequently Asked Questions",
  description: "Answers about Memories with Mike fine-art prints, materials, production, services, and custom orders.",
};
export default function FaqPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <PageHero
        eyebrow="Questions, answered"
        title="Before you choose a print or book a session."
        intro="Clear information about materials, orders, custom requests, and photography services."
      />
      <section className="section section-ivory">
        <div className="container-narrow faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
