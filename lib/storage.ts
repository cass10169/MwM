import { objectStorage } from "./platform";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxBytes = 20 * 1024 * 1024;

export interface StorageAdapter {
  put(
    key: string,
    body: ReadableStream,
    metadata: { contentType: string; cacheControl: string; customMetadata: Record<string, string> },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export class CloudflareR2StorageAdapter implements StorageAdapter {
  async put(
    key: string,
    body: ReadableStream,
    metadata: { contentType: string; cacheControl: string; customMetadata: Record<string, string> },
  ) {
    await objectStorage().put(key, body, {
      httpMetadata: { contentType: metadata.contentType, cacheControl: metadata.cacheControl },
      customMetadata: metadata.customMetadata,
    });
  }
  async delete(key: string) {
    await objectStorage().delete(key);
  }
}

export class S3CompatibleStorageAdapter implements StorageAdapter {
  constructor(readonly configuration: { endpoint: string; region: string; bucket: string }) {}
  async put() {
    throw new Error(
      "The S3 adapter boundary is ready, but a reviewed SigV4 client must be supplied before selecting STORAGE_DRIVER=s3.",
    );
  }
  async delete() {
    throw new Error(
      "The S3 adapter boundary is ready, but a reviewed SigV4 client must be supplied before selecting STORAGE_DRIVER=s3.",
    );
  }
}

function storageAdapter(): StorageAdapter {
  return new CloudflareR2StorageAdapter();
}

async function hasExpectedSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png")
    return bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  const ascii = new TextDecoder().decode(bytes);
  if (file.type === "image/webp") return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
  return ascii.slice(4, 12) === "ftypavif" || ascii.slice(4, 12) === "ftypavis";
}

export async function storePhotographAsset(
  file: File,
  photographId: string,
  kind: "thumbnail" | "display" | "social" | "product",
) {
  if (!allowedTypes.has(file.type)) throw new Error("Only JPEG, PNG, WebP, and AVIF files are accepted.");
  if (file.size < 1 || file.size > maxBytes) throw new Error("Image must be between 1 byte and 20 MB.");
  if (!(await hasExpectedSignature(file)))
    throw new Error("The file signature does not match its declared image type.");
  const extension = (
    { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>
  )[file.type];
  const key = `photographs/${photographId}/${kind}/${crypto.randomUUID()}.${extension}`;
  await storageAdapter().put(key, file.stream(), {
    contentType: file.type,
    cacheControl: "public, max-age=31536000, immutable",
    customMetadata: { originalName: file.name.slice(0, 150), kind },
  });
  return { key, size: file.size, mimeType: file.type };
}

export async function deletePhotographAsset(key: string) {
  if (!/^photographs\/[a-zA-Z0-9-]+\/(thumbnail|display|social|product)\/[a-zA-Z0-9.-]+$/.test(key))
    throw new Error("Invalid object key.");
  await storageAdapter().delete(key);
}
