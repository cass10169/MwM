/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { runWithRuntimeBindings } from "../lib/runtime-env";
import { validateEnvironment } from "../lib/env";

validateEnvironment();

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  BUCKET: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const operationalPath =
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/api/admin") ||
      url.pathname.startsWith("/_") ||
      url.pathname.startsWith("/access-required") ||
      url.pathname.startsWith("/cdn-cgi/access/") ||
      url.pathname.startsWith("/media/");
    if (!operationalPath && env.DB) {
      try {
        const row = await env.DB.prepare("SELECT value_json FROM site_settings WHERE key='commerce'").first<{
          value_json: string;
        }>();
        const maintenanceMode = row
          ? Boolean((JSON.parse(row.value_json) as { maintenanceMode?: boolean }).maintenanceMode)
          : false;
        if (maintenanceMode) {
          if (request.headers.get("accept")?.includes("text/html"))
            return new Response(
              '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Studio update | Memories with Mike</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;color:#ebe7dc;background:#171813;font-family:Arial,sans-serif}.wrap{max-width:760px;padding:3rem}small{letter-spacing:.18em;text-transform:uppercase;color:#b2785d}h1{font:400 clamp(3rem,9vw,7rem)/.9 Georgia,serif}p{max-width:590px;color:#aaa99f;line-height:1.8}</style><main class="wrap"><small>Memories with Mike</small><h1>The studio is preparing something new.</h1><p>The gallery is temporarily unavailable while Michael updates the collection. Please return soon or email michael.kennedy@ku.edu.</p></main></html>',
              {
                status: 503,
                headers: {
                  "content-type": "text/html; charset=utf-8",
                  "cache-control": "no-store",
                  "retry-after": "3600",
                  "x-content-type-options": "nosniff",
                },
              },
            );
          return Response.json(
            { error: "The studio is temporarily in maintenance mode." },
            { status: 503, headers: { "cache-control": "no-store" } },
          );
        }
      } catch {}
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
    }

    return runWithRuntimeBindings(env, () => handler.fetch(request, env as Env & { DB: D1Database }, ctx));
  },
};

export default worker;
