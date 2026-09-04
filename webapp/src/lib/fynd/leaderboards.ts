import type { SupabaseClient } from "@supabase/supabase-js";

export type Dimension = "xp" | "attendance" | "goals" | "streak" | "rating" | "fairplay";
export type Tier = "club" | "regional" | "national";

export const DIMENSIONS: { key: Dimension; label: string; unit: string }[] = [
  { key: "xp", label: "XP Total", unit: "XP" },
  { key: "attendance", label: "Dochádzka %", unit: "%" },
  { key: "goals", label: "Góly", unit: "⚽" },
  { key: "streak", label: "Streak King", unit: "dní" },
  { key: "rating", label: "Najlepšie hodnotení", unit: "★" },
  { key: "fairplay", label: "Fair Play", unit: "b." },
];

export const TIERS: { key: Tier; label: string }[] = [
  { key: "club", label: "Klub" },
  { key: "regional", label: "Región" },
  { key: "national", label: "Slovensko" },
];

export type LeaderboardRow = {
  profileId: string;
  name: string;
  clubName: string | null;
  value: number;
  birthDate: string | null;
};

function age(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

/** Vek < 13 na regionálnom/národnom rebríčku = iba iniciály (docs/leaderboards.md#privacy). */
export function displayName(row: LeaderboardRow, tier: Tier): string {
  const a = age(row.birthDate);
  if (tier !== "club" && a !== null && a < 13) {
    const parts = row.name.trim().split(/\s+/);
    return parts.map((p) => p[0]?.toUpperCase() + ".").join(" ");
  }
  return row.name;
}

/**
 * Vypočíta rebríček pre danú úroveň a dimenziu. Zjednodušená implementácia bez
 * materializovaného pohľadu — vhodná pre MVP/testovaciu veľkosť dát (1 pilotný klub).
 */
export async function computeLeaderboard(
  supabase: SupabaseClient,
  tier: Tier,
  dimension: Dimension,
  myClubIds: string[],
  myRegion: string | null
): Promise<LeaderboardRow[]> {
  // 1. Nájsť kandidátske profily podľa úrovne (club/regional/national), rešpektuje leaderboard_visibility.
  let clubFilterIds: string[] | null = null;
  if (tier === "club") {
    clubFilterIds = myClubIds;
  } else if (tier === "regional" && myRegion) {
    const { data: regionalClubs } = await supabase.from("clubs").select("id").eq("region", myRegion);
    clubFilterIds = (regionalClubs ?? []).map((c) => c.id);
  }

  let membershipsQuery = supabase
    .from("club_memberships")
    .select("profile_id, club_id, clubs(name)")
    .eq("role", "player");
  if (clubFilterIds) membershipsQuery = membershipsQuery.in("club_id", clubFilterIds);
  const { data: memberships } = await membershipsQuery;

  const profileClub = new Map<string, string | null>();
  (memberships ?? []).forEach((m) =>
    profileClub.set(m.profile_id, (m as unknown as { clubs?: { name?: string } }).clubs?.name ?? null)
  );
  const profileIds = [...profileClub.keys()];
  if (profileIds.length === 0) return [];

  const profilesQuery = supabase
    .from("profiles")
    .select("id, full_name, xp, birth_date, leaderboard_visibility")
    .in("id", profileIds);
  const { data: profiles } = await profilesQuery;
  const eligible = (profiles ?? []).filter(
    (p) => tier === "club" || p.leaderboard_visibility === "public"
  );

  const values = new Map<string, number>();

  if (dimension === "xp") {
    eligible.forEach((p) => values.set(p.id, p.xp));
  } else if (dimension === "attendance") {
    const { data: rows } = await supabase
      .from("training_attendance")
      .select("profile_id, status")
      .in("profile_id", profileIds);
    const totals = new Map<string, { present: number; total: number }>();
    (rows ?? []).forEach((r) => {
      const t = totals.get(r.profile_id) ?? { present: 0, total: 0 };
      t.total += 1;
      if (r.status === "present") t.present += 1;
      totals.set(r.profile_id, t);
    });
    eligible.forEach((p) => {
      const t = totals.get(p.id);
      values.set(p.id, t && t.total > 0 ? Math.round((t.present / t.total) * 100) : 0);
    });
  } else if (dimension === "goals") {
    const { data: rows } = await supabase
      .from("match_events")
      .select("player_id")
      .eq("type", "goal")
      .in("player_id", profileIds);
    const counts = new Map<string, number>();
    (rows ?? []).forEach((r) => {
      if (!r.player_id) return;
      counts.set(r.player_id, (counts.get(r.player_id) ?? 0) + 1);
    });
    eligible.forEach((p) => values.set(p.id, counts.get(p.id) ?? 0));
  } else if (dimension === "streak") {
    const { data: rows } = await supabase
      .from("training_attendance")
      .select("profile_id, status, trainings(starts_at)")
      .in("profile_id", profileIds);
    const byProfile = new Map<string, { status: string; starts_at: string }[]>();
    (rows ?? []).forEach((r) => {
      const t = (r as unknown as { trainings?: { starts_at?: string } }).trainings;
      if (!t?.starts_at) return;
      const arr = byProfile.get(r.profile_id) ?? [];
      arr.push({ status: r.status, starts_at: t.starts_at });
      byProfile.set(r.profile_id, arr);
    });
    eligible.forEach((p) => {
      const arr = (byProfile.get(p.id) ?? []).sort(
        (a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
      );
      let streak = 0;
      for (const a of arr) {
        if (a.status !== "present") break;
        streak += 1;
      }
      values.set(p.id, streak);
    });
  } else if (dimension === "rating") {
    const { data: rows } = await supabase
      .from("post_match_ratings")
      .select("target_id, stars")
      .in("target_id", profileIds);
    const totals = new Map<string, { sum: number; count: number }>();
    (rows ?? []).forEach((r) => {
      const t = totals.get(r.target_id) ?? { sum: 0, count: 0 };
      t.sum += r.stars;
      t.count += 1;
      totals.set(r.target_id, t);
    });
    eligible.forEach((p) => {
      const t = totals.get(p.id);
      values.set(p.id, t && t.count > 0 ? Math.round((t.sum / t.count) * 10) / 10 : 0);
    });
  } else if (dimension === "fairplay") {
    const { data: rows } = await supabase
      .from("xp_events")
      .select("profile_id, amount, type")
      .in("profile_id", profileIds)
      .in("type", ["yellow_card_penalty", "red_card_penalty"]);
    const totals = new Map<string, number>();
    (rows ?? []).forEach((r) => {
      totals.set(r.profile_id, (totals.get(r.profile_id) ?? 0) + r.amount);
    });
    eligible.forEach((p) => values.set(p.id, -(totals.get(p.id) ?? 0)));
  }

  return eligible
    .map((p) => ({
      profileId: p.id,
      name: p.full_name,
      clubName: profileClub.get(p.id) ?? null,
      value: values.get(p.id) ?? 0,
      birthDate: p.birth_date,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50);
}
