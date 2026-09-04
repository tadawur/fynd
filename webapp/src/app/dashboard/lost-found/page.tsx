import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewItemForm } from "./NewItemForm";

export default async function LostFoundPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, clubs(name)")
    .eq("profile_id", user.id);
  const clubIds = [...new Set((memberships ?? []).map((m) => m.club_id))];

  const { data: items } = clubIds.length
    ? await supabase
        .from("lost_found_items")
        .select("id, kind, title, status, created_at")
        .in("club_id", clubIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Straty a nálezy</h1>

      <NewItemForm
        clubIds={clubIds}
        clubNames={Object.fromEntries((memberships ?? []).map((m) => [m.club_id, (m as unknown as { clubs?: { name?: string } }).clubs?.name ?? ""]))}
      />

      <div className="flex flex-col gap-2">
        {(items ?? []).map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/lost-found/${item.id}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 hover:bg-card"
          >
            <div>
              <p className="font-medium">
                {item.kind === "lost" ? "🔴 Stratené" : "🟢 Nájdené"} · {item.title}
              </p>
            </div>
            {item.status === "resolved" && (
              <span className="rounded-full bg-green/15 px-2 py-0.5 text-xs text-green">vyriešené</span>
            )}
          </Link>
        ))}
        {(!items || items.length === 0) && <p className="text-sm text-muted">Zatiaľ nič nahlásené.</p>}
      </div>
    </div>
  );
}
