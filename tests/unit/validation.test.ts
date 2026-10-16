import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/validation";
describe("inquiry validation", () => {
  const valid = {
    name: "Michael Kennedy",
    email: "michael@example.com",
    phone: "",
    serviceType: "Commissioned work",
    eventDate: "",
    location: "Lawrence, Kansas",
    groupSize: "",
    budget: "",
    referral: "",
    message: "I would like to discuss a commissioned landscape photograph.",
    consent: true,
    website: "",
  };
  it("rejects unsafe company URLs and accepts brand inquiry details", () => {
    expect(inquirySchema.safeParse({ ...valid, companyWebsite: "javascript:alert(1)" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, company: "Example", companyWebsite: "https://example.com", serviceType: "Brand Partnership", partnershipType: "Content Partnership" }).success).toBe(true);
  });
  it("accepts a complete consented inquiry", () => expect(inquirySchema.safeParse(valid).success).toBe(true));
  it("rejects spam honeypots, short messages, invalid emails, and missing consent", () => {
    expect(inquirySchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, message: "Hi" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, email: "wrong" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});
