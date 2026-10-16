import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { FieldKitTemplate } from "@/components/field-kit-template";
import { fieldKitIsPublic, fieldKitItems, fieldKitPublicationEnabled } from "@/lib/field-kit";
import { pageMetadata } from "@/lib/outdoor";
export const metadata = { ...pageMetadata("Field Kit", "Verified field equipment used by Michael Kennedy.", "/field-kit"), robots: { index: false, follow: false } };
export default function FieldKit() {
 if (!fieldKitIsPublic(fieldKitItems, fieldKitPublicationEnabled)) notFound();
 return <main id="main-content"><PageHero eyebrow="In the field" title="Field Kit" intro="Verified equipment and the role each tool plays in the field." /><FieldKitTemplate items={fieldKitItems}/></main>;
}
