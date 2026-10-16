import { describe, expect, it } from "vitest";
import { fieldKitItemSchema, publishableFieldKitItems, fieldKitIsPublic, fieldKitItems } from "@/lib/field-kit";
const verification={source:"Owner-supplied inventory",verifiedAt:"2026-10-14T20:00:00Z"};
describe("verified equipment publication",()=>{
 it("keeps an empty inventory private even when enabled",()=>{expect(fieldKitItems).toEqual([]);expect(fieldKitIsPublic([],true)).toBe(false);});
 it("rejects published equipment without inventory verification",()=>{expect(fieldKitItemSchema.safeParse({id:"1",name:"Tool",category:"photography",publication:"PUBLISHED"}).success).toBe(false);});
 it("requires separate evidence for every designation and company relationship",()=>{
 const item={id:"1",name:"Tool",category:"photography",publication:"PUBLISHED",inventoryVerification:verification};
 expect(fieldKitItemSchema.safeParse({...item,designations:[{label:"Owned"}]}).success).toBe(false);
 expect(fieldKitItemSchema.safeParse({...item,companyRelationship:{company:"Company",type:"Sponsor"}}).success).toBe(false);
 expect(publishableFieldKitItems([{...item,designations:[{label:"Rented",verification}]}])).toHaveLength(1);
 });
 it("does not publish valid drafts or enable publication implicitly",()=>{const draft={id:"1",name:"Tool",category:"camping",inventoryVerification:verification};expect(publishableFieldKitItems([draft])).toEqual([]);expect(fieldKitIsPublic([{...draft,publication:"PUBLISHED"}],false)).toBe(false);});
});
