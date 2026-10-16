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
  location: z.string().trim().max(200).default(""),
  imageSlug: z.string().regex(/^[a-z0-9-]*$/).max(160).optional(),
  imageReference: z.string().trim().max(300).optional(),
    storySlug: z.string().regex(/^[a-z0-9-]*$/).max(160).optional(),
  sessionType: z.string().trim().max(100).optional(),
  projectSubject: z.string().trim().max(300).optional(),
  deliverables: z.string().trim().max(1000).optional(),
  intendedUse: z.string().trim().max(1000).optional(),
  media: z.string().trim().max(300).optional(),
  territory: z.string().trim().max(200).optional(),
  duration: z.string().trim().max(200).optional(),
  exclusivity: z.string().trim().max(200).optional(),
  printSize: z.string().trim().max(100).optional(),
  printMedium: z.string().trim().max(100).optional(),
  shippingDestination: z.string().trim().max(200).optional(),
  coverage: z.string().trim().max(1000).optional(),
  groupSize: z.string().max(30).optional(),
  budget: z.string().max(80).optional(),
  referral: z.string().max(200).optional(),
  message: z.string().trim().min(20, "Tell me a little more—at least 20 characters.").max(5000),
  consent: z.boolean().refine((value) => value, { message: "Consent is required so I can respond." }),
  website: z.string().max(0),
}).superRefine((value, ctx) => {
  if (value.serviceType === "Licensing") {
    if (!value.imageSlug && !value.imageReference && !value.storySlug) ctx.addIssue({code:"custom",path:["imageReference"],message:"Identify an image or describe the images you need."});
    if (!value.intendedUse) ctx.addIssue({code:"custom",path:["intendedUse"],message:"Tell me how you plan to use the image."});
  }
  if (["Print Question", "Print consultation"].includes(value.serviceType) && !value.imageSlug && !value.imageReference) ctx.addIssue({code:"custom",path:["imageReference"],message:"Identify a photograph or describe what you are looking for."});
});
export type InquiryData = z.infer<typeof inquirySchema>;
