import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import worker from '../dist/server/index.js';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
const request=path=>worker.fetch(new Request(`http://localhost${path}`,{headers:{accept:'text/html'}}),env,ctx);
test('redesign routes render, contain one H1, and resolve their linked images',async()=>{
 for(const route of ['/', '/partners','/media-kit','/expeditions','/expeditions/colorado-field-archive','/about','/services','/contact?service=Brand%20Partnership','/portfolio','/portfolio/waterfalls','/portfolio/kansas','/portfolio/national-parks','/prints','/prints/painted-silence','/photography/spring-portrait']) {
  const response=await request(route);assert.equal(response.status,200,route);const html=await response.text();
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route);assert.match(html,/id="main-content"/);
  assert.doesNotMatch(html, /srcSet="[^\"]* [123]x[,\"]/);
  for(const match of html.matchAll(/(?:src|srcSet)="(\/photographs\/[^\"]+)"/g)) {
   const path=match[1].split(' ')[0];assert.ok(existsSync(new URL(`../public${path}`,import.meta.url)),`${route}: ${path}`);
  }
 }
});
test('homepage keeps each photograph unique and has no equipment navigation',async()=>{
 const html=await (await request('/')).text();const images=[...html.matchAll(/<img[^>]*src="([^\"]+)"/g)].map(m=>m[1]);
 assert.equal(images.length,new Set(images).size);assert.doesNotMatch(html, /href="\/(field-kit|gear)"/);assert.doesNotMatch(html, /Nikon Z8|NIKKOR Z|Field Partner/);
});
test('unpublished inventory and trip case study return 404',async()=>{
 for(const route of ['/field-kit','/expeditions/colorado-2026']) assert.equal((await request(route)).status,404,route);
});
test('public internal navigation resolves without broken links',async()=>{
 const checked=new Set();
 for(const page of ['/','/partners','/media-kit','/expeditions','/portfolio','/services','/prints']) {
  const html=await (await request(page)).text();
  for(const match of html.matchAll(/<a\b[^>]*href="(\/[^\"]*)"/g)) {
   const path=match[1].replaceAll('&amp;','&');if(checked.has(path))continue;checked.add(path);
   const response=await request(path);assert.ok(response.status<400,`${page} links to ${path}: ${response.status}`);
  }
 }
});
