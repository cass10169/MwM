import { NextResponse } from "next/server";
import { getAdminApiUser } from "@/lib/admin-auth";
import { productInput, saveProduct } from "@/lib/product-admin";
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAdminApiUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = productInput.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Review the product fields." },
      { status: 400 },
    );
  try {
    const { slug } = await params;
    return NextResponse.json(await saveProduct(parsed.data, user.email, slug));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product could not be saved." },
      { status: 400 },
    );
  }
}
