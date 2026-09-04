import { createClient } from "@/lib/supabase/server";
import { RewardCard } from "./RewardCard";
import { SkinCard } from "./SkinCard";
import { OrderRow } from "./OrderRow";
import { NewRewardItemForm } from "./NewRewardItemForm";

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, avatar_config")
    .eq("id", user.id)
    .maybeSingle();

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, role, clubs(name)")
    .eq("profile_id", user.id);

  const clubIds = [...new Set((memberships ?? []).map((m) => m.club_id))];
  const isAdminOf = new Set(
    (memberships ?? []).filter((m) => m.role === "club_admin").map((m) => m.club_id)
  );

  const { data: items } = clubIds.length
    ? await supabase
        .from("reward_items")
        .select("id, name, xp_cost, min_level, active, club_id")
        .in("club_id", clubIds)
        .eq("active", true)
        .order("xp_cost")
    : { data: [] };

  const { data: myOrders } = await supabase
    .from("reward_orders")
    .select("id, status, xp_cost_at_order, created_at, reward_items(name)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  const pendingOrdersToApprove = isAdminOf.size
    ? await supabase
        .from("reward_orders")
        .select("id, status, xp_cost_at_order, created_at, profiles(full_name), reward_items(name, club_id)")
        .eq("status", "pending")
    : { data: [] };

  const { data: skins } = await supabase.from("profile_skins").select("*").order("xp_cost");
  const { data: ownedSkins } = await supabase
    .from("player_owned_skins")
    .select("skin_slug")
    .eq("profile_id", user.id);
  const ownedSet = new Set((ownedSkins ?? []).map((s) => s.skin_slug).concat(["navy"]));
  const activeSkin = (profile?.avatar_config as { background?: string } | null)?.background ?? "navy";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <h1 className="text-2xl font-semibold">Odmeňovňa</h1>
        <p className="text-sm text-muted">Máš {profile?.xp ?? 0} XP · level {profile?.level ?? 1}</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Odmeny za XP</h2>
        <div className="flex flex-col gap-3">
          {(items ?? []).map((item) => (
            <RewardCard
              key={item.id}
              item={item}
              myXp={profile?.xp ?? 0}
              myLevel={profile?.level ?? 1}
            />
          ))}
          {(!items || items.length === 0) && (
            <p className="text-sm text-muted">Klub zatiaľ nemá pridané odmeny.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Profilové skiny</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(skins ?? []).map((skin) => (
            <SkinCard
              key={skin.slug}
              skin={skin}
              owned={ownedSet.has(skin.slug)}
              active={activeSkin === skin.slug}
              myXp={profile?.xp ?? 0}
            />
          ))}
        </div>
      </div>

      {myOrders && myOrders.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-medium">Moje objednávky</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {myOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between">
                <span>{(o as unknown as { reward_items?: { name?: string } }).reward_items?.name}</span>
                <span
                  className={
                    o.status === "fulfilled"
                      ? "text-green"
                      : o.status === "rejected"
                        ? "text-coral"
                        : "text-gold"
                  }
                >
                  {o.status === "fulfilled" ? "vybavené ✅" : o.status === "rejected" ? "zamietnuté" : "čaká sa"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAdminOf.size > 0 && (
        <>
          <NewRewardItemForm clubIds={[...isAdminOf]} clubNames={Object.fromEntries((memberships ?? []).map((m) => [m.club_id, (m as unknown as { clubs?: { name?: string } }).clubs?.name ?? ""]))} />

          {pendingOrdersToApprove.data && pendingOrdersToApprove.data.length > 0 && (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="mb-3 font-medium">Objednávky na schválenie</h2>
              <div className="flex flex-col gap-2">
                {pendingOrdersToApprove.data
                  .filter((o) =>
                    isAdminOf.has((o as unknown as { reward_items?: { club_id?: string } }).reward_items?.club_id ?? "")
                  )
                  .map((o) => (
                    <OrderRow
                      key={o.id}
                      orderId={o.id}
                      playerName={(o as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? "?"}
                      itemName={(o as unknown as { reward_items?: { name?: string } }).reward_items?.name ?? "?"}
                      xpCost={o.xp_cost_at_order}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
