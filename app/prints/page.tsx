import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PhotoCard } from "@/components/photo-card";
import { getPublicPhotographs } from "@/lib/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/prints" },
  title: "Fine-Art Prints",
  description:
    "Explore landscape and wildlife photographs by Michael Kennedy and request current print sizes, materials, and pricing.",
};
export default async function PrintsPage() {
  const photographs = await getPublicPhotographs();
  const productPhotos = photographs.filter(p => ["Landscapes", "Wildlife", "Nature & Macro"].includes(p.category));
  return (
    <main id="main-content">
      <PageHero
        eyebrow="The print collection"
        title="Art made to live with you."
        intro="Choose a photograph and request a tailored print estimate. Size, finish, crop, production, shipping, and pricing are confirmed before ordering."
      />
      <section className="shop-intro section-dark">
        <div className="container-wide shop-benefits">
          <div>
            <strong>01</strong>
            <h2>Prepared with intention</h2>
            <p>Discuss the image, proposed dimensions, and any crop before confirming your print.</p>
          </div>
          <div>
            <strong>02</strong>
            <h2>Made to order</h2>
            <p>Ask about paper, metal, acrylic, or canvas options appropriate for your chosen photograph.</p>
          </div>
          <div>
            <strong>03</strong>
            <h2>Handled with care</h2>
            <p>Production time, shipping cost, and damage or return terms are confirmed with your estimate.</p>
          </div>
        </div>
      </section>
      <section className="section section-ivory">
        <div className="container-wide">
          <div className="shop-heading">
            <p className="eyebrow ink">Print collection</p>
            <h2>Find the photograph that stays with you.</h2>
            <p>Open a photograph to request current sizes, materials, and pricing.</p>
          </div>
          <div className="standard-photo-grid">
            {productPhotos.map((photo) => photo && <PhotoCard key={photo.slug} photo={photo} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
