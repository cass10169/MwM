import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderFrame } from "@/components/placeholder-frame";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Michael Kennedy",
  description: "Meet Lawrence, Kansas photographer Michael Kennedy and the purpose behind Memories with Mike.",
};
export default function AboutPage() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael Kennedy",
    jobTitle: "Outdoor Photographer & Field Content Creator",
    worksFor: { "@type": "Organization", name: "Memories with Mike" },
    homeLocation: { "@type": "Place", name: "Lawrence, Kansas" },
    url: "https://memorieswithmike.com/about",
  };
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <section className="about-hero section-dark">
        <div className="container-wide about-hero-grid">
          <div>
            <p className="eyebrow">About the photographer</p>
            <h1>A photograph begins long before the shutter.</h1>
            <p>
              Michael Kennedy is an outdoor photographer and field content creator. Memories with Mike is his photography and storytelling practice, based in
              Lawrence, Kansas.
            </p>
          </div>
          <PlaceholderFrame
            label="Portrait of Michael Kennedy"
            filename="studio-gaze-2048.webp"
            ratio="3 / 2"
            fit="contain"
            variant="detail"
            src="/photographs/studio-gaze-2048.webp"
            alt="Portrait of Michael Kennedy, photographer and founder of Memories with Mike."
            focalPointX={50}
            focalPointY={44}
            loading="eager"
          />
        </div>
      </section>
      <section className="section section-ivory">
        <div className="container-narrow prose-page">
          <p className="lead-serif dark-lead">
            Memories with Mike presents fine-art landscape and wildlife photography by Michael Kennedy, alongside
            commissioned photography for people, milestones, and events.
          </p>
          <h2>Why “Memories with Mike”</h2>
          <p>
            The journey gives a photograph its context: a changing sky, a trail beside water, a wildlife encounter, or a brief opening in the light. Michael’s work connects the finished frame to the place and experience behind it.
          </p>
          <p>
            Michael’s primary specialties are landscapes, wildlife, travel, and field storytelling. Brand photography and commercial image licensing are available by inquiry. Memories with Mike also offers weddings,
            graduations, family portraits, events, and commercial or commissioned photography.
          </p>
          <p>
            His work is grounded in patience, natural light, and an appreciation for the details that give a place or
            moment its character. Whether photographing the Colorado high country, wildlife, or a personal milestone,
            Michael approaches each frame as a memory worth preserving carefully.
          </p>
          <Link className="button button-dark" href="/contact">
            Work with Michael
          </Link>
        </div>
      </section>
    </main>
  );
}
