import { z } from "zod";
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.email("Enter a valid email address.").max(254),
  phone: z.string().max(30).optional(),
  serviceType: z.string().min(1, "Select a service.").max(80),
  eventDate: z.string().max(20).optional(),
  company: z.string().trim().max(200).optional(),
  companyWebsite: z.union([z.url().refine(value => /^https?:\/\//i.test(value), "Use an https:// or http:// website."), z.literal("")]).optional(),
  partnershipType: z.string().max(100).optional(),
  projectTiming: z.string().trim().max(200).optional(),
  location: z.string().trim().min(2, "Enter a location.").max(200),
  groupSize: z.string().max(30).optional(),
  budget: z.string().max(80).optional(),
  referral: z.string().max(200).optional(),
  message: z.string().trim().min(20, "Tell me a little more—at least 20 characters.").max(5000),
  consent: z.boolean().refine((value) => value, { message: "Consent is required so I can respond." }),
  website: z.string().max(0),
});
export type InquiryData = z.infer<typeof inquirySchema>;
