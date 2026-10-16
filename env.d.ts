declare global {
  interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
  }
}
declare module "cloudflare:workers" {
  interface Env {
    DB: D1Database;
    BUCKET: R2Bucket;
  }
}
export {};
