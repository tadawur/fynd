import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StarPicker } from "./StarPicker";

export default async function RateMatchPage({
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

  const { data: match } = await supabase.from("matches").select("*").eq("id", id).maybeSingle();
  if (!match) notFound();

  const { data: lineup } = await supabase
    .from("match_lineups")
    .select("profile_id, profiles(full_name)")
    .eq("match_id", id);

  const teammates = (lineup ?? []).filter((l) => l.profile_id !== user.id);

  const { data: coaches } = match.category_id
    ? await supabase
        .from("club_memberships")
        .select("profile_id, profiles(full_name)")
        .eq("club_id", match.club_id)
        .eq("category_id", match.category_id)
        .eq("role", "coach")
    : { data: [] };

  const { data: myRatings } = await supabase
    .from("post_match_ratings")
    .select("target_id, target_type, stars")
    .eq("match_id", id)
    .eq("rater_id", user.id);
  const existing = new Map((myRatings ?? []).map((r) => [`${r.target_type}:${r.target_id}`, r.stars]));

  if (match.status !== "finished") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-sm text-muted">
        Hodnotenie bude dostupné po skončení zápasu.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div>
        <Link href={`/dashboard/matches/${id}`} className="text-sm text-muted hover:underline">
          ← Späť na zápas
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">Pozápasové hodnotenie</h1>
        <p className="text-sm text-muted">Anonymné pre spoluhráčov — pomáha trénerovi vidieť trend v čase.</p>
      </div>

      {coaches && coaches.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-3 font-medium">Tréner</h2>
          <div className="flex flex-col gap-3">
            {coaches.map((c) => (
              <StarPicker
                key={c.profile_id}
                matchId={id}
                targetId={c.profile_id}
                targetType="coach"
                name={(c as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? "Tréner"}
                initialStars={existing.get(`coach:${c.profile_id}`) ?? 0}
              />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Spoluhráči</h2>
        <div className="flex flex-col gap-3">
          {teammates.map((t) => (
            <StarPicker
              key={t.profile_id}
              matchId={id}
              targetId={t.profile_id}
              targetType="teammate"
              name={(t as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? "Hráč"}
              initialStars={existing.get(`teammate:${t.profile_id}`) ?? 0}
            />
          ))}
          {teammates.length === 0 && <p className="text-sm text-muted">Zostava nebola vyplnená.</p>}
        </div>
      </div>

      <p className="text-xs text-muted">
        Hodnotenie rozhodcu nie je zatiaľ podporené — rozhodcovia nie sú registrovaní vo Fynde.
      </p>
    </div>
  );
}
