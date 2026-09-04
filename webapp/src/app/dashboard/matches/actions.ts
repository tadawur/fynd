"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fanoutClubNotification } from "@/lib/fynd/notify";

export type FormState = { error: string | null };

export async function createMatch(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubId = String(formData.get("club_id") ?? "");
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const opponent = String(formData.get("opponent_name") ?? "").trim();
  const isHome = formData.get("is_home") === "on";
  const competition = String(formData.get("competition") ?? "").trim() || null;
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  if (!clubId || !opponent || !date || !time) {
    return { error: "Vyplň súpera, dátum a čas." };
  }

  const { error } = await supabase.from("matches").insert({
    club_id: clubId,
    category_id: categoryId,
    opponent_name: opponent,
    is_home: isHome,
    competition,
    starts_at: new Date(`${date}T${time}:00`).toISOString(),
    created_by: user.id,
  });

  if (error) return { error: "Nepodarilo sa vytvoriť zápas." };

  revalidatePath("/dashboard/matches");
  return { error: null };
}

export async function setLineup(matchId: string, profileIds: string[]) {
  const supabase = await createClient();
  if (profileIds.length === 0) return { error: null };

  await supabase
    .from("match_lineups")
    .upsert(
      profileIds.map((id) => ({ match_id: matchId, profile_id: id, role: "player" })),
      { onConflict: "match_id,profile_id", ignoreDuplicates: true }
    );

  revalidatePath(`/dashboard/matches/${matchId}`);
  return { error: null };
}

const CARD_PENALTY: Record<string, number> = { yellow_card: -20, red_card: -50 };
const NOTIFY_KEY: Record<string, string> = {
  goal: "goals",
  yellow_card: "yellow_cards",
  red_card: "red_cards",
  half_time: "half_time",
  full_time: "full_time",
};

export async function addMatchEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Neprihlásený." };

  const matchId = String(formData.get("match_id") ?? "");
  const minute = Number(formData.get("minute") ?? 0);
  const type = String(formData.get("type") ?? "");
  const team = String(formData.get("team") ?? "") || null;
  const playerId = String(formData.get("player_id") ?? "") || null;
  const note = String(formData.get("note") ?? "").trim() || null;

  const { data: match } = await supabase.from("matches").select("*").eq("id", matchId).maybeSingle();
  if (!match) return { error: "Zápas neexistuje." };

  const { error: insertError } = await supabase.from("match_events").insert({
    match_id: matchId,
    minute,
    type,
    team,
    player_id: playerId,
    note,
    source: "manual",
  });
  if (insertError) return { error: "Nepodarilo sa uložiť udalosť (si tréner/admin?)." };

  let scoreHome = match.score_home;
  let scoreAway = match.score_away;
  const clubLabel = match.is_home ? "Domáci" : "Hostia";
  const oppLabel = match.opponent_name;

  if (type === "kickoff") {
    await supabase.from("matches").update({ status: "live" }).eq("id", matchId);
  }

  if (type === "goal") {
    if (team === "home") scoreHome += 1;
    if (team === "away") scoreAway += 1;
    await supabase.from("matches").update({ score_home: scoreHome, score_away: scoreAway }).eq("id", matchId);

    if (playerId) {
      const { count: matchGoals } = await supabase
        .from("match_events")
        .select("id", { count: "exact", head: true })
        .eq("match_id", matchId)
        .eq("type", "goal")
        .eq("player_id", playerId);
      const { count: seasonGoals } = await supabase
        .from("match_events")
        .select("id", { count: "exact", head: true })
        .eq("type", "goal")
        .eq("player_id", playerId);

      if ((matchGoals ?? 0) === 1) await supabase.rpc("award_badge", { p_profile_id: playerId, p_badge_slug: "scorer" });
      if ((matchGoals ?? 0) >= 3) await supabase.rpc("award_badge", { p_profile_id: playerId, p_badge_slug: "hat-trick" });
      if ((seasonGoals ?? 0) >= 10) await supabase.rpc("award_badge", { p_profile_id: playerId, p_badge_slug: "sniper" });
    }

    let scorerName = "";
    if (playerId) {
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", playerId).maybeSingle();
      scorerName = p?.full_name ?? "";
    }
    await fanoutClubNotification(
      supabase,
      match.club_id,
      "goals",
      "goal",
      `⚽ Gól! ${match.is_home ? "" : oppLabel + " "}${scoreHome}–${scoreAway}`,
      `${scorerName || "Hráč"}, ${minute}. minúta`
    );
  }

  if (type === "yellow_card" || type === "red_card") {
    if (playerId) {
      await supabase.rpc("award_match_xp", {
        p_profile_id: playerId,
        p_xp_type: type === "yellow_card" ? "yellow_card_penalty" : "red_card_penalty",
        p_amount: CARD_PENALTY[type],
        p_note: `${type === "yellow_card" ? "Žltá" : "Červená"} karta, zápas`,
      });
    }
    await fanoutClubNotification(
      supabase,
      match.club_id,
      NOTIFY_KEY[type],
      type,
      type === "yellow_card" ? "🟨 Žltá karta" : "🟥 Červená karta",
      `${minute}. minúta${note ? ` · ${note}` : ""}`
    );
  }

  if (type === "half_time") {
    await fanoutClubNotification(
      supabase,
      match.club_id,
      "half_time",
      "half_time",
      "⏱️ Polčas",
      `${clubLabel === "Domáci" ? "" : ""}${scoreHome}–${scoreAway}`
    );
  }

  if (type === "full_time") {
    await supabase.from("matches").update({ status: "finished" }).eq("id", matchId);

    const { data: lineup } = await supabase
      .from("match_lineups")
      .select("profile_id")
      .eq("match_id", matchId)
      .eq("role", "player");
    if (lineup && lineup.length > 0) {
      await Promise.all(
        lineup.map((l) =>
          supabase.rpc("award_match_xp", {
            p_profile_id: l.profile_id,
            p_xp_type: "manual_adjustment",
            p_amount: 25,
            p_note: "Odohraný zápas (potvrdené trénerom)",
          })
        )
      );
    }

    await fanoutClubNotification(
      supabase,
      match.club_id,
      "full_time",
      "full_time",
      "🏁 Záverečný výsledok",
      `${scoreHome}–${scoreAway} vs ${oppLabel}`
    );
  }

  revalidatePath(`/dashboard/matches/${matchId}`);
  return { error: null };
}
