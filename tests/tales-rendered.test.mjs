import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const ctx={waitUntil(){},passThroughOnException(){}};
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const slug='colorado-autumn-2026';
const path='/tales-from-the-road/'+slug;
const request=(path,options)=>new Request('http://localhost'+path,options);
test('living story, archive and discovery paths render with truthful metadata',async()=>{
  for(const route of ['/','/journal','/tales-from-the-road',path]){
    const response=await worker.fetch(request(route),env,ctx);assert.equal(response.status,200);
    const html=await response.text();assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1);
    assert.ok(html.includes('Tales from the Road'));
    if(route!==path)assert.ok(html.includes(path));
    if(route===path){
      for(const s of ['Hardee','Fitch Ranch','Little Hawaii','Ewing Gulch','Version','still growing','BlogPosting','BreadcrumbList','story='+slug])assert.ok(html.includes(s),s);
      assert.doesNotMatch(html,/<video|View Colorado prints|Insert verified departure|roadside-final/);
      assert.ok(html.includes('rel="canonical" href="https://memorieswithmike.com'+path+'"'));
    }
  }
  const missing=await worker.fetch(request('/tales-from-the-road/not-published'),env,ctx);assert.equal(missing.status,404);
  const sitemap=await (await worker.fetch(request('/sitemap.xml'),env,ctx)).text();assert.ok(sitemap.includes(path));
  const rss=await (await worker.fetch(request('/rss.xml'),env,ctx)).text();assert.ok(rss.includes(path));
  for(const route of ['/field-kit','/expeditions/colorado-2026'])assert.equal((await worker.fetch(request(route),env,ctx)).status,404);
});
test('story-linked forms retain canonical context and reject invented stories',async()=>{
  const html=await (await worker.fetch(request('/contact?service=Licensing&story='+slug),env,ctx)).text();
  assert.match(html,/name="storySlug"[^>]*value="colorado-autumn-2026"/);
  let stored;
  const DB={prepare(sql){let values;return {bind(...v){values=v;return this},async first(){return {count:0}},async all(){return {results:[]}},async run(){if(sql.startsWith('INSERT INTO inquiries'))stored=values;return {success:true}}}}};
  for(const serviceType of ['Licensing','Expedition Partnership']) {
    const response=await worker.fetch(request('/api/inquiries',{method:'POST',headers:{'content-type':'application/json',origin:'http://localhost'},body:JSON.stringify({name:'QA Reader',email:'reader@example.com',serviceType,storySlug:slug,intendedUse:'Editorial feature',message:'Automated story-context test.',consent:true,website:''})}),{...env,DB},ctx);
    assert.equal(response.status,201,await response.text());assert.ok(stored[9].includes('Story: Colorado: Chasing Autumn Through the High Country'));assert.ok(stored[9].includes(path));
  }
  const response=await worker.fetch(request('/api/inquiries',{method:'POST',headers:{'content-type':'application/json',origin:'http://localhost'},body:JSON.stringify({name:'QA Reader',email:'reader@example.com',serviceType:'Licensing',storySlug:'invented-story',intendedUse:'Editorial',message:'An invalid story context test.',consent:true,website:''})}),{...env,DB},ctx);
  assert.equal(response.status,400);
});
