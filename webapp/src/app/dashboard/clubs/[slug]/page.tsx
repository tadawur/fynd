import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateNotifySettings } from "../actions";
import { FollowButton } from "../FollowButton";
import { formatDateTimeSk } from "@/lib/fynd/date";

const NOTIFY_LABELS: { key: string; label: string; emoji: string }[] = [
  { key: "goals", label: "Góly", emoji: "⚽" },
  { key: "yellow_cards", label: "Žlté karty", emoji: "🟨" },
  { key: "red_cards", label: "Červené karty", emoji: "🟥" },
  { key: "half_time", label: "Polčasové skóre", emoji: "⏱️" },
  { key: "full_time", label: "Konečný výsledok", emoji: "🏁" },
  { key: "match_reminder", label: "Pripomienka zápasu (3 dni vopred)", emoji: "📅" },
  { key: "match_day", label: "V deň zápasu ráno", emoji: "☀️" },
  { key: "announcements", label: "Klubové oznamy", emoji: "📣" },
];

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: club } = await supabase
    .from("clubs")
    .select("id, name, slug, region, founded_year")
    .eq("slug", slug)
    .maybeSingle();

  if (!club) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("club_id", club.id)
    .order("name");

  const { data: upcomingMatches } = await supabase
    .from("matches")
    .select("id, opponent_name, is_home, starts_at, status, score_home, score_away")
    .eq("club_id", club.id)
    .order("starts_at", { ascending: false })
    .limit(5);

  const { data: follow } = user
    ? await supabase
        .from("club_follows")
        .select("notify")
        .eq("profile_id", user.id)
        .eq("club_id", club.id)
        .maybeSingle()
    : { data: null };

  const { data: membership } = user
    ? await supabase
        .from("club_memberships")
        .select("role")
        .eq("profile_id", user.id)
        .eq("club_id", club.id)
        .maybeSingle()
    : { data: null };

  const notify = (follow?.notify as Record<string, boolean>) ?? null;
  const boundUpdate = updateNotifySettings.bind(null, club.id, club.slug);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{club.name}</h1>
          <p className="text-sm text-muted">
            {club.region ?? "—"}
            {club.founded_year ? ` · založený ${club.founded_year}` : ""}
          </p>
          {membership && (
            <span className="mt-2 inline-block rounded-full bg-green/15 px-2 py-0.5 text-xs text-green">
              Si člen · {membership.role}
            </span>
          )}
        </div>
        <FollowButton clubId={club.id} slug={club.slug} following={!!follow} />
      </div>

      {categories && categories.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-medium">Kategórie</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Zápasy</h2>
          <Link href="/dashboard/matches" className="text-sm text-green hover:underline">
            live ticker
          </Link>
        </div>
        {upcomingMatches && upcomingMatches.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {upcomingMatches.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm">
                <span>
                  {m.is_home ? `${club.name} vs ${m.opponent_name}` : `${m.opponent_name} vs ${club.name}`}
                </span>
                <span className="text-muted">
                  {m.status === "scheduled"
                    ? formatDateTimeSk(m.starts_at)
                    : `${m.score_home}:${m.score_away}${m.status === "live" ? " 🔴" : ""}`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Zatiaľ žiadne zápasy.</p>
        )}
      </div>

      {follow && (
        <form action={boundUpdate} className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-medium">Notifikácie pre tento klub</h2>
          <div className="flex flex-col gap-2.5">
            {NOTIFY_LABELS.map((n) => (
              <label key={n.key} className="flex items-center justify-between text-sm">
                <span>
                  {n.emoji} {n.label}
                </span>
                <input
                  type="checkbox"
                  name={n.key}
                  defaultChecked={notify?.[n.key] ?? true}
                  className="h-4 w-4 accent-green"
                />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110"
          >
            Uložiť nastavenia
          </button>
        </form>
      )}
    </div>
  );
}
