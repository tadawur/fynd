import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { MatchLive } from "./MatchLive";
import { LineupPicker } from "./LineupPicker";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: match } = await supabase
    .from("matches")
    .select("*, clubs(name)")
    .eq("id", id)
    .maybeSingle();
  if (!match) notFound();

  const { data: myMembership } = await supabase
    .from("club_memberships")
    .select("role")
    .eq("profile_id", user.id)
    .eq("club_id", match.club_id)
    .maybeSingle();
  const isCoach = myMembership?.role === "coach" || myMembership?.role === "club_admin";

  const { data: events } = await supabase
    .from("match_events")
    .select("id, minute, type, team, note, player_id, profiles(full_name)")
    .eq("match_id", id)
    .order("minute", { ascending: true });

  const { data: lineup } = await supabase
    .from("match_lineups")
    .select("profile_id, profiles(full_name)")
    .eq("match_id", id)
    .eq("role", "player");

  let roster: { profile_id: string; profiles: { full_name: string } | null }[] = [];
  if (isCoach && match.category_id) {
    const { data } = await supabase
      .from("club_memberships")
      .select("profile_id, profiles(full_name)")
      .eq("club_id", match.club_id)
      .eq("category_id", match.category_id)
      .eq("role", "player");
    roster = (data ?? []) as never;
  }

  const clubName = (match as unknown as { clubs?: { name?: string } }).clubs?.name ?? "Klub";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <Link href="/dashboard/matches" className="text-sm text-muted hover:underline">
          ← Zápasy
        </Link>
        <h1 className="mt-1 text-xl font-semibold">
          {match.is_home ? `${clubName} vs ${match.opponent_name}` : `${match.opponent_name} vs ${clubName}`}
        </h1>
        <p className="text-sm text-muted">
          {match.competition ? `${match.competition} · ` : ""}
          {formatDateTimeSk(match.starts_at)}
        </p>
      </div>

      <MatchLive
        matchId={id}
        initialStatus={match.status}
        initialScoreHome={match.score_home}
        initialScoreAway={match.score_away}
        initialEvents={(events ?? []).map((e) => ({
          id: e.id,
          minute: e.minute,
          type: e.type,
          team: e.team,
          note: e.note,
          playerName: (e as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? null,
        }))}
        isCoach={isCoach}
        lineup={(lineup ?? []).map((l) => ({
          profileId: l.profile_id,
          name: (l as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? "?",
        }))}
      />

      {match.status === "finished" && (
        <Link
          href={`/dashboard/matches/${id}/rate`}
          className="rounded-full border border-gold px-5 py-2 text-center text-sm font-medium text-gold hover:bg-gold/10"
        >
          ⭐ Ohodnotiť zápas
        </Link>
      )}

      {isCoach && roster.length > 0 && (
        <LineupPicker
          matchId={id}
          roster={roster.map((r) => ({ profileId: r.profile_id, name: r.profiles?.full_name ?? "?" }))}
          currentLineup={(lineup ?? []).map((l) => l.profile_id)}
        />
      )}
    </div>
  );
}
