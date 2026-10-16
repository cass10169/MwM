import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { database, sha256Bytes } from "@/lib/platform";
import { storePhotographAsset } from "@/lib/storage";
import { validateImageMetadata } from "@/lib/domain";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { slug } = await params;
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") ?? "display");
    const width = Number(form.get("width"));
    const height = Number(form.get("height"));
    if (!(file instanceof File) || !["thumbnail", "display", "social", "product"].includes(kind)) {
      return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
    }
    if (
      !validateImageMetadata({ mimeType: file.type, bytes: file.size, width, height, focalPointX: 50, focalPointY: 50 })
    )
      return NextResponse.json({ error: "The image metadata is invalid." }, { status: 400 });
    const photo = await database()
      .prepare("SELECT id FROM photographs WHERE (id=? OR slug=?) AND deleted_at IS NULL")
      .bind(slug, slug)
      .first<{ id: string }>();
    if (!photo) return NextResponse.json({ error: "Photograph not found." }, { status: 404 });
    const checksum = await sha256Bytes(await file.arrayBuffer());
    const stored = await storePhotographAsset(file, photo.id, kind as "thumbnail" | "display" | "social" | "product");
    const now = Date.now();
    const assetId = crypto.randomUUID();
    const statements = [
      database()
        .prepare(
          "INSERT INTO photograph_assets (id,photograph_id,kind,object_key,mime_type,width,height,bytes,checksum,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(
          assetId,
          photo.id,
          kind.toUpperCase(),
          stored.key,
          stored.mimeType,
          width,
          height,
          stored.size,
          checksum,
          now,
        ),
      database()
        .prepare(
          "INSERT INTO audit_logs (id,user_id,action,entity_type,entity_id,summary,metadata_json,created_at) VALUES (?,?,?,?,?,?,?,?)",
        )
        .bind(
          crypto.randomUUID(),
          null,
          "UPLOAD",
          "PHOTOGRAPH_ASSET",
          assetId,
          `${kind} asset uploaded by ${user.email}`,
          JSON.stringify({ photographId: photo.id, key: stored.key, kind }),
          now,
        ),
    ];
    if (kind === "social")
      statements.push(
        database()
          .prepare("UPDATE photographs SET social_image_key=?,updated_at=? WHERE id=?")
          .bind(stored.key, now, photo.id),
      );
    await database().batch(statements);
    return NextResponse.json({ id: assetId, key: stored.key }, { status: 201 });
  } catch (error) {
    console.error("Asset upload failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "The asset could not be uploaded." }, { status: 500 });
  }
}
