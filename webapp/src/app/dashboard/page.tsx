import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StreakGrid, type StreakDay } from "@/components/StreakGrid";
import { levelProgress } from "@/lib/fynd/xp";
import { startOfWeek, addDays, isSameDay, formatDateTimeSk } from "@/lib/fynd/date";
import { logout } from "./actions";

const DAY_LABELS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp, level, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: streakData } = await supabase.rpc("current_streak", {
    p_profile_id: user.id,
  });
  const currentStreak = typeof streakData === "number" ? streakData : 0;

  const monday = startOfWeek(new Date());
  const sunday = addDays(monday, 7);
  const { data: weekAttendance } = await supabase
    .from("training_attendance")
    .select("status, trainings(starts_at)")
    .eq("profile_id", user.id)
    .gte("trainings.starts_at", monday.toISOString())
    .lt("trainings.starts_at", sunday.toISOString());

  const today = new Date();
  const week: StreakDay[] = DAY_LABELS.map((label, i) => {
    const day = addDays(monday, i);
    const row = (weekAttendance ?? []).find((r) => {
      const t = (r as { trainings?: { starts_at?: string } | null }).trainings;
      return t?.starts_at && isSameDay(new Date(t.starts_at), day);
    });
    if (row) {
      return { label, status: row.status === "present" ? "present" : "missed" };
    }
    if (isSameDay(day, today)) return { label, status: "today" };
    if (day > today) return { label, status: "upcoming" };
    return { label, status: "none" };
  });

  const { count: badgeCount } = await supabase
    .from("player_badges")
    .select("badge_slug", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { data: myClubIds } = await supabase
    .from("club_memberships")
    .select("club_id")
    .eq("profile_id", user.id);
  const clubIds = (myClubIds ?? []).map((m) => m.club_id);

  const { data: nextTraining } = clubIds.length
    ? await supabase
        .from("trainings")
        .select("id, starts_at, location, clubs(name), categories(name)")
        .in("club_id", clubIds)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const { data: recentAnnouncements } = clubIds.length
    ? await supabase
        .from("announcements")
        .select("id, title, created_at")
        .in("club_id", clubIds)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] };

  const xp = profile?.xp ?? 0;
  const { current, next, progressPct } = levelProgress(xp);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <header className="flex items-center justify-between lg:hidden">
        <div>
          <p className="text-sm text-muted">Vitaj späť,</p>
          <h1 className="text-2xl font-semibold">{profile?.full_name || user.email}</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-card"
          >
            Odhlásiť sa
          </button>
        </form>
      </header>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold">
            Level {current.level} · {current.name}
          </p>
          <span className="text-sm font-semibold text-gold">{xp} XP</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-green" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          {next ? `${next.xp - xp} XP do levelu ${next.level} · ${next.name}` : "Maximálny level — Legenda 🏆"}
        </p>
      </div>

      <StreakGrid days={week} currentStreak={currentStreak} />

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/calendar"
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-xs text-muted">Najbližší tréning</p>
          {nextTraining ? (
            <>
              <p className="mt-1 font-medium">
                {(nextTraining as unknown as { categories?: { name?: string } }).categories?.name}
              </p>
              <p className="text-sm text-muted">{formatDateTimeSk(nextTraining.starts_at)}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted">Žiadny naplánovaný tréning</p>
          )}
        </Link>

        <Link href="/dashboard/profile" className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs text-muted">Odznaky</p>
          <p className="mt-1 font-display text-2xl font-bold text-gold">{badgeCount ?? 0}</p>
          <p className="text-sm text-muted">získaných</p>
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Posledné oznamy</h2>
          <Link href="/dashboard/announcements" className="text-sm text-green hover:underline">
            všetky
          </Link>
        </div>
        {recentAnnouncements && recentAnnouncements.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {recentAnnouncements.map((a) => (
              <li key={a.id} className="text-sm text-muted">
                📣 {a.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Zatiaľ žiadne oznamy.</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <Link href="/dashboard/matches" className="rounded-xl border border-line bg-surface py-4">
          ⚽<br />Zápasy
        </Link>
        <Link href="/dashboard/rewards" className="rounded-xl border border-line bg-surface py-4">
          🎁<br />Odmeňovňa
        </Link>
        <Link href="/dashboard/leaderboards" className="rounded-xl border border-line bg-surface py-4">
          🏆<br />Rebríčky
        </Link>
      </div>
    </div>
  );
}
