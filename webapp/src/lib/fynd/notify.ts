import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Rozošle notifikáciu všetkým, ktorí sledujú daný klub a majú zapnutý daný typ
 * (docs/notifications.md — per-club nastavenia). notifyKey zodpovedá kľúču v
 * club_follows.notify (napr. "goals", "red_cards", "half_time", "full_time").
 */
export async function fanoutClubNotification(
  supabase: SupabaseClient,
  clubId: string,
  notifyKey: string | null, // null = vždy pošle (napr. training_change, announcement už rieši iná cesta)
  type: string,
  title: string,
  body: string
) {
  const { data: followers } = await supabase
    .from("club_follows")
    .select("profile_id, notify")
    .eq("club_id", clubId);

  const targets = (followers ?? []).filter((f) => {
    if (!notifyKey) return true;
    const notify = f.notify as Record<string, boolean> | null;
    return notify?.[notifyKey] !== false && notify?.[notifyKey] !== undefined
      ? notify[notifyKey]
      : true;
  });

  if (targets.length === 0) return;

  await supabase.from("notifications").insert(
    targets.map((t) => ({
      profile_id: t.profile_id,
      club_id: clubId,
      type,
      title,
      body,
    }))
  );
}
