import { runtimeBindings } from "./runtime-env";

export function database(): D1Database {
  const bindings = runtimeBindings();
  if (!bindings.DB) throw new Error("Database binding is unavailable.");
  return bindings.DB;
}

export function objectStorage(): R2Bucket {
  const bindings = runtimeBindings();
  if (!bindings.BUCKET) throw new Error("Object storage binding is unavailable.");
  return bindings.BUCKET;
}

export function imageTransformer() {
  return runtimeBindings().IMAGES;
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Bytes(value: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", value);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function clientAddress(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
