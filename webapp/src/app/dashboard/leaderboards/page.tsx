import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeLeaderboard, displayName, DIMENSIONS, TIERS, type Dimension, type Tier } from "@/lib/fynd/leaderboards";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardsPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; dim?: string }>;
}) {
  const sp = await searchParams;
  const tier = (sp.tier as Tier) ?? "club";
  const dimension = (sp.dim as Dimension) ?? "xp";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, clubs(region)")
    .eq("profile_id", user.id);
  const myClubIds = [...new Set((memberships ?? []).map((m) => m.club_id))];
  const myRegion =
    (memberships?.[0] as unknown as { clubs?: { region?: string } })?.clubs?.region ?? null;

  const rows = await computeLeaderboard(supabase, tier, dimension, myClubIds, myRegion);
  const dimMeta = DIMENSIONS.find((d) => d.key === dimension)!;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Rebríčky</h1>

      <div className="flex gap-2 overflow-x-auto">
        {TIERS.map((t) => (
          <Link
            key={t.key}
            href={`/dashboard/leaderboards?tier=${t.key}&dim=${dimension}`}
            className={
              "shrink-0 rounded-full border px-4 py-1.5 text-sm " +
              (tier === t.key ? "border-green bg-green/10 text-green" : "border-line text-muted")
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {DIMENSIONS.map((d) => (
          <Link
            key={d.key}
            href={`/dashboard/leaderboards?tier=${tier}&dim=${d.key}`}
            className={
              "shrink-0 rounded-full border px-3 py-1 text-xs " +
              (dimension === d.key ? "border-gold bg-gold/10 text-gold" : "border-line text-muted")
            }
          >
            {d.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-2">
        {rows.length === 0 && (
          <p className="p-4 text-sm text-muted">Zatiaľ nedostatok dát pre tento rebríček.</p>
        )}
        <ul>
          {rows.map((r, i) => (
            <li
              key={r.profileId}
              className={
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm " +
                (r.profileId === user.id ? "bg-green/10" : "")
              }
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center">{MEDALS[i] ?? i + 1}</span>
                <div>
                  <p className="font-medium">{displayName(r, tier)}</p>
                  {r.clubName && <p className="text-xs text-muted">{r.clubName}</p>}
                </div>
              </div>
              <span className="font-display font-semibold text-gold">
                {r.value} {dimMeta.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted">
        Hráči do 13 rokov sa na regionálnom a národnom rebríčku zobrazujú len s iniciálami.
      </p>
    </div>
  );
}
