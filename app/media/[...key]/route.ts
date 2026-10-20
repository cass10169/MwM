import { imageTransformer, objectStorage } from "@/lib/platform";

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await params;
  const key = segments.map(decodeURIComponent).join("/");
  const video = /^stories\/colorado-autumn-2026\/phone-[a-f0-9]{12}\/[a-f0-9]{16}\.mp4$/.test(key);
  if (!video && !/^photographs\/[a-zA-Z0-9-]+\/(thumbnail|display|social|product)\/[a-zA-Z0-9.-]+$/.test(key))
    return new Response("Not found", { status: 404 });
  if (video) {
    const bucket=objectStorage();
    const info=await bucket.head(key);
    if(!info) return new Response("Not found",{status:404});
    const headers=new Headers({"content-type":"video/mp4","accept-ranges":"bytes","etag":info.httpEtag,"cache-control":"public, max-age=31536000, immutable","x-content-type-options":"nosniff"});
    let offset=0, length=info.size, status=200;
    const range=request.headers.get("range");
    const ifRange=request.headers.get("if-range");
    if(range && (!ifRange || ifRange===info.httpEtag)) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(range);
      if(!match || (!match[1] && !match[2])) return new Response(null,{status:416,headers:{"content-range":`bytes */${info.size}`}});
      if(match[1]) { offset=Number(match[1]); const end=match[2] ? Math.min(Number(match[2]),info.size-1) : info.size-1; length=end-offset+1; }
      else { length=Math.min(Number(match[2]),info.size); offset=info.size-length; }
      if(!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset>=info.size || length<=0) return new Response(null,{status:416,headers:{"content-range":`bytes */${info.size}`}});
      status=206; headers.set("content-range",`bytes ${offset}-${offset+length-1}/${info.size}`);
    }
    headers.set("content-length",String(length));
    const object=await bucket.get(key,{range:{offset,length}});
    if(!object) return new Response("Not found",{status:404});
    return new Response(object.body,{status,headers});
  }
  const object = await objectStorage().get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  const requestedWidth = Number(url.searchParams.get("width"));
  const format = url.searchParams.get("format");
  const allowedWidths = new Set([480, 768, 1200, 1600, 2048]);
  if (allowedWidths.has(requestedWidth) && ["avif", "webp", "jpeg"].includes(format ?? "")) {
    const transformer = imageTransformer();
    if (transformer) {
      const transformed = await transformer
        .input(object.body)
        .transform({ width: requestedWidth, fit: "scale-down" })
        .output({ format: format!, quality: 88 });
      const response = transformed.response();
      const headers = new Headers(response.headers);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      headers.set("vary", "accept");
      headers.set("x-content-type-options", "nosniff");
      return new Response(response.body, { status: response.status, headers });
    }
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("content-security-policy", "default-src 'none'");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
