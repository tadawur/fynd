import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { NewTrainingForm } from "./NewTrainingForm";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, category_id, role, clubs(name), categories(name)")
    .eq("profile_id", user.id);

  const clubIds = [...new Set((memberships ?? []).map((m) => m.club_id))];
  const canSchedule = (memberships ?? []).some((m) => m.role === "coach" || m.role === "club_admin");

  const { data: trainings } = clubIds.length
    ? await supabase
        .from("trainings")
        .select("id, starts_at, location, club_id, category_id, clubs(name), categories(name)")
        .in("club_id", clubIds)
        .order("starts_at", { ascending: true })
    : { data: [] };

  const now = new Date();
  const upcoming = (trainings ?? []).filter((t) => new Date(t.starts_at) >= now);
  const past = (trainings ?? []).filter((t) => new Date(t.starts_at) < now).reverse().slice(0, 10);

  const coachMemberships = (memberships ?? []).filter(
    (m) => m.role === "coach" || m.role === "club_admin"
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Kalendár tréningov</h1>

      {canSchedule && <NewTrainingForm memberships={coachMemberships as never} />}

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Nadchádzajúce</h2>
        {upcoming.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {upcoming.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/dashboard/calendar/${t.id}`}
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-card"
                >
                  <span>
                    {(t as unknown as { categories?: { name?: string } }).categories?.name ?? "Tréning"}
                    {t.location ? ` · ${t.location}` : ""}
                  </span>
                  <span className="text-muted">{formatDateTimeSk(t.starts_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Žiadne naplánované tréningy.</p>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Nedávne</h2>
        {past.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {past.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/dashboard/calendar/${t.id}`}
                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-card"
                >
                  <span>
                    {(t as unknown as { categories?: { name?: string } }).categories?.name ?? "Tréning"}
                  </span>
                  <span className="text-muted">{formatDateTimeSk(t.starts_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Zatiaľ žiadna história.</p>
        )}
      </div>
    </div>
  );
}
