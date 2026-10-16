import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { journalInput, saveJournalPost } from "@/lib/journal-admin";
export async function POST(request: Request) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = journalInput.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Review the journal fields." },
      { status: 400 },
    );
  try {
    return NextResponse.json(await saveJournalPost(parsed.data, user.email), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Story could not be saved." },
      { status: 400 },
    );
  }
}
