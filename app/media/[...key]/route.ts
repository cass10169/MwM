import { imageTransformer, objectStorage } from "@/lib/platform";

export async function GET(request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: segments } = await params;
  const key = segments.map(decodeURIComponent).join("/");
  if (!/^photographs\/[a-zA-Z0-9-]+\/(thumbnail|display|social|product)\/[a-zA-Z0-9.-]+$/.test(key))
    return new Response("Not found", { status: 404 });
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
