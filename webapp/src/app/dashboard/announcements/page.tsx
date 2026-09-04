import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { NewAnnouncementForm } from "./NewAnnouncementForm";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("club_id, role, clubs(name)")
    .eq("profile_id", user.id);

  const clubIds = [...new Set((memberships ?? []).map((m) => m.club_id))];
  const canBroadcast = (memberships ?? []).some((m) => m.role === "coach" || m.role === "club_admin");

  const { data: announcements } = clubIds.length
    ? await supabase
        .from("announcements")
        .select("id, title, body, created_at, category_id, categories(name), clubs(name)")
        .in("club_id", clubIds)
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };

  const { data: allCategories } = clubIds.length
    ? await supabase.from("categories").select("id, name, club_id").in("club_id", clubIds)
    : { data: [] };

  const coachClubIds = [
    ...new Set(
      (memberships ?? [])
        .filter((m) => m.role === "coach" || m.role === "club_admin")
        .map((m) => m.club_id)
    ),
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Oznamy</h1>

      {canBroadcast && (
        <NewAnnouncementForm
          clubIds={coachClubIds}
          categories={allCategories ?? []}
          clubNames={Object.fromEntries((memberships ?? []).map((m) => [m.club_id, (m as unknown as { clubs?: { name?: string } }).clubs?.name ?? ""]))}
        />
      )}

      <div className="flex flex-col gap-3">
        {(announcements ?? []).map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted">
              <span>
                {(a as unknown as { clubs?: { name?: string } }).clubs?.name}
                {" · "}
                {(a as unknown as { categories?: { name?: string } }).categories?.name ?? "celý klub"}
              </span>
              <span>{formatDateTimeSk(a.created_at)}</span>
            </div>
            <p className="font-medium">📣 {a.title}</p>
            <p className="mt-1 text-sm text-muted">{a.body}</p>
          </div>
        ))}
        {(!announcements || announcements.length === 0) && (
          <p className="text-sm text-muted">Zatiaľ žiadne oznamy.</p>
        )}
      </div>
    </div>
  );
}
