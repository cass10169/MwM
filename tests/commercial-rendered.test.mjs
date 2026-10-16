import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const ctx={waitUntil(){},passThroughOnException(){}};
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const get=async path=>(await worker.fetch(new Request('http://localhost'+path),env,ctx)).text();
test('buyer pages carry image and service context, and split outdoor from people',async()=>{
 const print=await get('/contact?service=Print+Question&image=painted-silence');
 assert.match(print,/Selected photograph/);assert.match(print,/Painted Silence/);assert.match(print,/Preferred dimensions/);assert.doesNotMatch(print,/Estimated group size/);
 const licensing=await get('/contact?service=Licensing&image=painted-silence');
 for(const text of ['Intended use','Territory','Usage duration','Exclusivity'])assert.ok(licensing.includes(text));
 const services=await get('/contact?service=Photography+Services&session=Weddings');
 assert.match(services,/<option[^>]*selected=""[^>]*>Weddings<\/option>/);
 const outdoor=await get('/portfolio');assert.doesNotMatch(outdoor,/Enlarge Laughter Beneath the Arbor/);assert.match(outdoor,/License this image/);
 const people=await get('/portfolio/people-events');assert.match(people,/Laughter Beneath the Arbor/);
 const media=await get('/media-kit');assert.ok((media.match(/<figure/g)||[]).length>=6);assert.match(media,/Commercial applications/);
 const sitemap=await get('/sitemap.xml');for(const path of ['/licensing','/portfolio/people-events','/prints/painted-silence'])assert.ok(sitemap.includes(path));
});
test('all four inquiry types persist structured context without schema changes',async()=>{
 for(const [serviceType,details,expected] of [
  ['Brand Partnership',{projectSubject:'Trail campaign',deliverables:'Hero library',intendedUse:'Website'},'Hero library'],
  ['Licensing',{imageSlug:'painted-silence',intendedUse:'Tourism brochure',territory:'USA',duration:'12 months'},'Usage duration: 12 months'],
  ['Print Question',{imageSlug:'painted-silence',printSize:'Medium',printMedium:'Paper',shippingDestination:'USA 66044'},'Shipping destination: USA 66044'],
  ['Photography Services',{sessionType:'Weddings',eventDate:'2027-06-01',coverage:'Ceremony and portraits'},'Coverage requirements: Ceremony and portraits']]) {
  let stored;
  const DB={prepare(sql){let values;return {bind(...v){values=v;return this},async first(){return {count:0}},async all(){return {results:[]}},async run(){if(sql.startsWith('INSERT INTO inquiries'))stored=values;return {success:true}}}}};
  const response=await worker.fetch(new Request('http://localhost/api/inquiries',{method:'POST',headers:{'content-type':'application/json','origin':'http://localhost'},body:JSON.stringify({name:'QA Buyer',email:'qa@example.com',message:'Automated test, no actual project.',consent:true,website:'',serviceType,...details})}),{...env,DB},ctx);
  assert.equal(response.status,201,await response.text());assert.ok(stored[9].includes(expected));
 }
});

