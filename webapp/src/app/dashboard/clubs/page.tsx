import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "./FollowButton";

export default async function ClubsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id, name, slug, region, founded_year")
    .order("name");

  const { data: memberships } = user
    ? await supabase.from("club_memberships").select("club_id").eq("profile_id", user.id)
    : { data: [] };
  const { data: follows } = user
    ? await supabase.from("club_follows").select("club_id").eq("profile_id", user.id)
    : { data: [] };

  const memberClubIds = new Set((memberships ?? []).map((m) => m.club_id));
  const followedClubIds = new Set((follows ?? []).map((f) => f.club_id));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Kluby</h1>
      <p className="text-sm text-muted">
        Sleduj svoj klub aj rivalov — dostaneš presne tie notifikácie, ktoré chceš.
      </p>

      <div className="flex flex-col gap-3">
        {(clubs ?? []).map((club) => (
          <div
            key={club.id}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4"
          >
            <Link href={`/dashboard/clubs/${club.slug}`} className="flex-1">
              <p className="font-medium">{club.name}</p>
              <p className="text-sm text-muted">
                {club.region ?? "—"}
                {club.founded_year ? ` · zal. ${club.founded_year}` : ""}
              </p>
              {memberClubIds.has(club.id) && (
                <span className="mt-1 inline-block rounded-full bg-green/15 px-2 py-0.5 text-xs text-green">
                  člen
                </span>
              )}
            </Link>
            <FollowButton
              clubId={club.id}
              slug={club.slug}
              following={followedClubIds.has(club.id)}
            />
          </div>
        ))}
        {(!clubs || clubs.length === 0) && (
          <p className="text-sm text-muted">Zatiaľ žiadne kluby vo Fynde.</p>
        )}
      </div>
    </div>
  );
}
