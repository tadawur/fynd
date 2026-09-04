import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { AttendanceRow } from "./AttendanceRow";

export default async function TrainingDetailPage({
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

  const { data: training } = await supabase
    .from("trainings")
    .select("id, starts_at, location, club_id, category_id, clubs(name), categories(name)")
    .eq("id", id)
    .maybeSingle();

  if (!training) notFound();

  const { data: myMembership } = await supabase
    .from("club_memberships")
    .select("role")
    .eq("profile_id", user.id)
    .eq("club_id", training.club_id)
    .maybeSingle();

  const isCoach = myMembership?.role === "coach" || myMembership?.role === "club_admin";

  const { data: attendance } = await supabase
    .from("training_attendance")
    .select("profile_id, status")
    .eq("training_id", id);

  const statusByProfile = new Map((attendance ?? []).map((a) => [a.profile_id, a.status]));

  let roster: { profile_id: string; profiles: { full_name: string } | null }[] = [];
  if (isCoach) {
    const { data } = await supabase
      .from("club_memberships")
      .select("profile_id, profiles(full_name)")
      .eq("club_id", training.club_id)
      .eq("category_id", training.category_id)
      .eq("role", "player");
    roster = (data ?? []) as never;
  }

  const myStatus = statusByProfile.get(user.id);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {(training as unknown as { categories?: { name?: string } }).categories?.name} tréning
        </h1>
        <p className="text-sm text-muted">
          {formatDateTimeSk(training.starts_at)}
          {training.location ? ` · ${training.location}` : ""}
        </p>
      </div>

      {!isCoach && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-muted">Tvoja dochádzka</p>
          <p className="mt-1 font-medium">
            {myStatus === "present"
              ? "✅ Zúčastnil/a si sa"
              : myStatus === "absent"
                ? "❌ Neprítomný/á"
                : myStatus === "excused"
                  ? "🟡 Ospravedlnený/á"
                  : "⏳ Ešte neoznačené trénerom"}
          </p>
        </div>
      )}

      {isCoach && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-medium">Dochádzka — {roster.length} hráčov</h2>
          <div className="flex flex-col gap-2">
            {roster.map((r) => (
              <AttendanceRow
                key={r.profile_id}
                trainingId={id}
                profileId={r.profile_id}
                name={r.profiles?.full_name ?? "Hráč"}
                initialStatus={statusByProfile.get(r.profile_id) ?? null}
              />
            ))}
            {roster.length === 0 && (
              <p className="text-sm text-muted">V tejto kategórii zatiaľ nie sú hráči.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
