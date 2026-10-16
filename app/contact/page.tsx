import Link from "next/link";
import { getRoadStory } from "@/lib/tales";
import { getPhotograph } from "@/lib/catalog";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/page-hero";
import { pageMetadata } from "@/lib/outdoor";
export const metadata: Metadata = pageMetadata("Contact & Partnership Inquiries", "Contact Michael Kennedy about brand partnerships, expeditions, commercial photography, licensing, prints, or local sessions.", "/contact");
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string; image?: string; print?: string; session?: string; story?: string }> }) {
  const query = await searchParams;
  const story = query.story ? getRoadStory(query.story) : undefined;
  const service = query.service === "print-consultation" ? "Print Question" : query.service;
  const slug = query.image ?? query.print;
  const photo = slug && /^[a-z0-9-]{1,160}$/.test(slug) ? await getPhotograph(slug) : undefined;
  const session = ["Weddings","Graduations","Families","Portraits","Events","Commissioned work"].includes(query.session ?? "") ? query.session : "";
  const initialType = ["Brand Partnership", "Expedition Partnership", "Commercial Photography", "Licensing", "Print Question", "Photography Services", "General Inquiry"].includes(service ?? "") ? service : "";
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Contact Michael"
        title="Tell me what you’re planning."
        intro="Share a creative brief, field project, licensing request, print question, or photography session. We’ll define a useful next step."
      />
      <section className="section section-ivory">
        <div className="container-wide contact-grid">
          <div>
            <p className="eyebrow ink">Start an inquiry</p>
            <InquiryForm initialType={initialType} image={photo ? {slug:photo.slug,title:photo.title} : undefined} session={session} story={story ? {slug:story.slug,title:story.title} : undefined}/>
          </div>
          <aside>
            <div>
              <p className="eyebrow ink">Direct contact</p>
              <a href="mailto:michael.kennedy@ku.edu">michael.kennedy@ku.edu</a>
              <p>Lawrence, Kansas</p>
            </div>
            <div>
              <h2>What happens next</h2>
              <ol>
                <li>I review the details you share.</li>
                <li>I respond with availability and any useful questions.</li>
                <li>We define the scope, timing, deliverables, and price before booking.</li>
              </ol>
            </div>
            <p className="privacy-note">
              Your information is used to respond to your inquiry and is not sold. See the <Link href="/privacy">privacy policy</Link> for details.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
