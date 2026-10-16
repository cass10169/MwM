import { describe, it, expect } from 'vitest';
import { inquirySchema } from '@/lib/validation';
import { inquiryMessage } from '@/lib/inquiry-details';
import { inquiryLink, isOutdoor } from '@/lib/commercial';
const base={name:'Test Buyer',email:'buyer@example.com',serviceType:'Licensing',message:'Please quote this campaign usage.',consent:true,website:''};
describe('commercial buyer context',()=>{
 it('requires image reference and use for licensing',()=>{
  expect(inquirySchema.safeParse(base).success).toBe(false);
  expect(inquirySchema.safeParse({...base,imageSlug:'painted-silence',intendedUse:'Tourism brochure'}).success).toBe(true);
 });
 it('accepts print and service briefs without irrelevant location requirements',()=>{
  expect(inquirySchema.safeParse({...base,serviceType:'Print Question',imageSlug:'painted-silence',printSize:'Medium',printMedium:'Paper'}).success).toBe(true);
  expect(inquirySchema.safeParse({...base,serviceType:'Photography Services',sessionType:'Weddings',coverage:'Ceremony'}).success).toBe(true);
 });
 it('bounds context and rejects unsafe image references',()=>{
  expect(inquirySchema.safeParse({...base,imageSlug:'../../private',intendedUse:'Web'}).success).toBe(false);
  expect(inquirySchema.safeParse({...base,imageSlug:'painted-silence',intendedUse:'x'.repeat(1001)}).success).toBe(false);
 });
 it('preserves licensing and print details in the existing administrator message',()=>{
  const value=inquirySchema.parse({...base,imageSlug:'painted-silence',intendedUse:'Brochure',media:'Print',territory:'USA',duration:'12 months',exclusivity:'Non-exclusive',printSize:'24 inches',shippingDestination:'USA 66044'});
  const message=inquiryMessage(value,{title:'Painted Silence',slug:'painted-silence',id:'verified-id'});
  for(const text of ['Painted Silence','verified-id','Brochure','Print','USA','12 months','Non-exclusive','24 inches','66044']) expect(message).toContain(text);
 });
 it('encodes context and separates outdoor from people work',()=>{
  expect(inquiryLink('Print Question','painted-silence')).toBe('/contact?service=Print+Question&image=painted-silence');
  expect(isOutdoor({category:'Landscapes'})).toBe(true);
  expect(isOutdoor({category:'Weddings'})).toBe(false);
 });
});
