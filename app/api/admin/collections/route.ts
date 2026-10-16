import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { collectionInput, saveCollection } from "@/lib/collection-admin";
export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = collectionInput.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Review the collection fields." },
      { status: 400 },
    );
  try {
    return NextResponse.json(await saveCollection(parsed.data, user.email), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Collection could not be saved." },
      { status: 400 },
    );
  }
}
