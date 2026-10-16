import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PlaceholderFrame } from "@/components/placeholder-frame";
import { services } from "@/lib/content";
import { getSiteSetting, getPublicPhotographs } from "@/lib/catalog";
import { EditorialPhoto } from "@/components/editorial-photo";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Photography Services",
  description:
    "Wedding, graduation, family, event, commercial, and commissioned photography from Michael Kennedy in Lawrence, Kansas.",
};
export default async function ServicesPage() {
  const photographs = await getPublicPhotographs();
  const serviceImages: Record<string,string> = { weddings: "under-the-open-sky", graduations: "graduation-day-companion", families: "autumn-story", events: "night-lift", commissioned: "spring-portrait" };
  const startingPrices = await getSiteSetting("service-pricing", {
    weddings: "",
    graduations: "",
    families: "",
    events: "",
    commissioned: "",
  } as Record<string, string>);
  const serviceStructured = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Memories with Mike",
    areaServed: "Lawrence, Kansas",
    email: "michael.kennedy@ku.edu",
    founder: { "@type": "Person", name: "Michael Kennedy" },
    serviceType: services.map((service) => service.title),
  };
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructured) }} />
      <PageHero
        eyebrow="Photography services"
        title="The moments you live. The memories you keep."
        intro="Natural, attentive photography for milestones, gatherings, families, organizations, and commissioned projects."
      />
      <section className="section section-ivory">
        <div className="container-wide services-list illustrated-services">
          {services.map((service, index) => (
            <article key={service.slug}>
              <EditorialPhoto photo={photographs.find(p=>p.slug===serviceImages[service.slug])} ratio="3 / 2" />
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              {startingPrices[service.slug] && <p className="service-starting-price">{startingPrices[service.slug]}</p>}
              <Link className="text-link" href="/contact?service=Photography%20Services">
                Ask about availability →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="service-process section-dark">
        <div className="container-wide service-process-grid">
          <PlaceholderFrame
            label="Photography session"
            filename="the-vow-2048.webp"
            ratio="3 / 2"
            variant="detail"
            src="/photographs/the-vow-2048.webp"
            alt="Bride and groom facing one another during an outdoor ceremony."
            focalPointX={50}
            focalPointY={50}
          />
          <div>
            <p className="eyebrow">A clear process</p>
            <h2>Thoughtful before, present during, careful after.</h2>
            <ol>
              <li>
                <strong>Conversation</strong>
                <span>We begin with what matters, what the day requires, and how the photographs should feel.</span>
              </li>
              <li>
                <strong>Photography</strong>
                <span>Direction when it helps, space when the moment needs to unfold naturally.</span>
              </li>
              <li>
                <strong>Delivery</strong>
                <span>A carefully edited collection prepared for viewing, sharing, and printing.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section className="cta-band section-copper">
        <div className="container-narrow">
          <p className="eyebrow ink">Begin a conversation</p>
          <h2>Tell me what you want to remember.</h2>
          <p>
            Every assignment is shaped around the date, location, coverage, and final deliverables. Share the details
            of what you are planning to receive a tailored estimate.
          </p>
          <Link className="button button-dark" href="/contact">
            Start an inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
