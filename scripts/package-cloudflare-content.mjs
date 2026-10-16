import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { build } from 'esbuild';
import path from 'node:path';
const dir='dist/deployment';await mkdir(dir,{recursive:true});
await build({entryPoints:['dist/server/index.js'],bundle:true,format:'esm',target:'es2022',platform:'neutral',external:['node:*','cloudflare:*','util'],outfile:`${dir}/core.mjs`,minify:true});
const assets={};for(const name of await readdir('dist/client/assets')) {
 if(!/\.(js|css)$/.test(name))throw new Error(`Unsupported runtime asset: ${name}`);
 assets[`/assets/${name}`]={content:await readFile(path.join('dist/client/assets',name),'utf8'),type:name.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8'};
}
await writeFile(`${dir}/runtime-assets.mjs`,`export default ${JSON.stringify(assets)};\n`);
await writeFile(`${dir}/entry.mjs`, `import core from './core.mjs';\nimport assets from './runtime-assets.mjs';\nconst respond = (request, asset) => new Response(request.method === 'HEAD' ? null : asset.content, { headers: { 'content-type': asset.type, 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options':'nosniff' } });\nexport default { async fetch(request, env, ctx) {\n const url=new URL(request.url);\n if (['www.memorieswithmike.com','memories-with-mike.memorieswithmike15.workers.dev'].includes(url.hostname) && !url.pathname.startsWith('/api/') && !url.pathname.startsWith('/admin') && ['GET','HEAD'].includes(request.method)) { url.hostname='memorieswithmike.com'; url.protocol='https:'; return Response.redirect(url,301); }\n const asset=assets[url.pathname];\n if(asset && ['GET','HEAD'].includes(request.method)) return respond(request,asset);\n const scoped={...env,ASSETS:{ fetch: async input => { const req=input instanceof Request ? input : new Request(input); const a=assets[new URL(req.url).pathname]; return a ? respond(req,a) : env.ASSETS.fetch(req); } }};\n return core.fetch(request,scoped,ctx);\n} };\n`);
const files={};for(const name of ['entry.mjs','core.mjs','runtime-assets.mjs']) files[name]=await readFile(`${dir}/${name}`,'utf8');
await writeFile(`${dir}/modules.json`,JSON.stringify(files));
console.log(`Prepared three ESM modules (${Object.values(files).reduce((sum,s)=>sum+Buffer.byteLength(s),0)} bytes). Existing Cloudflare ASSETS remain intact for photographs.`);
