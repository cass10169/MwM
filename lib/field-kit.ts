import { z } from "zod";
export const fieldKitCategories = [
 { id: "photography", title: "Photography Equipment", description: "Camera bodies, lenses, filters, tripods, bags, storage, and photography tools." },
 { id: "production", title: "Editing & Production Equipment", description: "Computers, monitors, storage, software, and calibration tools." },
 { id: "travel", title: "Vehicle & Travel Setup", description: "Vehicle, cargo, power, storage, recovery, and travel equipment." },
 { id: "camping", title: "Camping & Field Equipment", description: "Shelter, sleep, packs, cooking, clothing, navigation, lighting, and power." },
] as const;
const verificationSchema = z.object({ source: z.string().trim().min(1), verifiedAt: z.iso.datetime() });
export const fieldKitItemSchema = z.object({
 id: z.string().trim().min(1), name: z.string().trim().min(1),
 category: z.enum(["photography", "production", "travel", "camping"]),
 description: z.string().optional(), image: z.string().optional(),
 publication: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
 inventoryVerification: verificationSchema.optional(),
 designations: z.array(z.object({ label: z.enum(["Owned", "Rented", "Loaned", "Field Tested", "Field Partner"]), verification: verificationSchema })).default([]),
 companyRelationship: z.object({ company: z.string().trim().min(1), type: z.enum(["Sponsor", "Partner", "Equipment Provider"]), verification: verificationSchema }).optional(),
}).superRefine((item,ctx)=>{
 if (item.publication === "PUBLISHED" && !item.inventoryVerification)
   ctx.addIssue({ code:"custom", path:["inventoryVerification"], message:"Verified inventory is required before publication." });
});
export type FieldKitItem = z.infer<typeof fieldKitItemSchema>;
// Owner-supplied inventory only. No sample records, inferred ownership, or seeded brands.
export const fieldKitItems: FieldKitItem[] = [];
export const fieldKitPublicationEnabled = false;
export function publishableFieldKitItems(items: unknown[]): FieldKitItem[] {
 return items.flatMap(item=>{const result=fieldKitItemSchema.safeParse(item);return result.success && result.data.publication === "PUBLISHED" ? [result.data] : [];});
}
export function fieldKitIsPublic(items: unknown[], enabled: boolean) {
 return enabled && publishableFieldKitItems(items).length > 0;
}
