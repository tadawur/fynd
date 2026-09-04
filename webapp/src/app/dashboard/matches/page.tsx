import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { NewMatchForm } from "./NewMatchForm";

export default async function MatchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, category_id, role, clubs(name), categories(name)")
    .eq("profile_id", user.id);

  const { data: follows } = await supabase.from("club_follows").select("club_id").eq("profile_id", user.id);

  const clubIds = [
    ...new Set([...(memberships ?? []).map((m) => m.club_id), ...(follows ?? []).map((f) => f.club_id)]),
  ];
  const canManage = (memberships ?? []).filter((m) => m.role === "coach" || m.role === "club_admin");

  const { data: matches } = clubIds.length
    ? await supabase
        .from("matches")
        .select("id, opponent_name, is_home, starts_at, status, score_home, score_away, clubs(name)")
        .in("club_id", clubIds)
        .order("starts_at", { ascending: false })
        .limit(30)
    : { data: [] };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Zápasy</h1>
      <p className="text-xs text-muted">
        Live ticker beží na manuálnom vstupe trénera — plnohodnotný Sportnet fallback (docs/sportnet-integration.md).
      </p>

      {canManage.length > 0 && (
        <NewMatchForm
          memberships={canManage as never}
        />
      )}

      <div className="flex flex-col gap-2">
        {(matches ?? []).map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/matches/${m.id}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 hover:bg-card"
          >
            <div>
              <p className="font-medium">
                {m.is_home ? `${(m as unknown as { clubs?: { name?: string } }).clubs?.name} vs ${m.opponent_name}` : `${m.opponent_name} vs ${(m as unknown as { clubs?: { name?: string } }).clubs?.name}`}
              </p>
              <p className="text-sm text-muted">{formatDateTimeSk(m.starts_at)}</p>
            </div>
            <div className="text-right">
              {m.status === "scheduled" ? (
                <span className="text-xs text-muted">plánovaný</span>
              ) : (
                <span className="font-display text-lg font-bold text-gold">
                  {m.score_home}:{m.score_away}
                </span>
              )}
              {m.status === "live" && <p className="text-xs text-coral">🔴 live</p>}
            </div>
          </Link>
        ))}
        {(!matches || matches.length === 0) && <p className="text-sm text-muted">Zatiaľ žiadne zápasy.</p>}
      </div>
    </div>
  );
}
