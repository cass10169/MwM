import { getAdminApiUser } from "@/lib/admin-auth";
import { database } from "@/lib/platform";
import { ordersToCsv } from "@/lib/fulfillment";
export async function GET() {
  const user = await getAdminApiUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const rows = (
    await database()
      .prepare(
        "SELECT title,slug,location,status,orientation,aspect_ratio,featured,portfolio_visible,store_available,seo_visible,sort_order FROM photographs WHERE deleted_at IS NULL ORDER BY sort_order,title",
      )
      .all<Record<string, string | number | null>>()
  ).results;
  return new Response(ordersToCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="memories-with-mike-photographs.csv"',
      "cache-control": "no-store",
    },
  });
}
