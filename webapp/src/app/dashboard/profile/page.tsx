import { createClient } from "@/lib/supabase/server";
import { levelProgress } from "@/lib/fynd/xp";
import { ProfileEditForm } from "./ProfileEditForm";
import { logout } from "../actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  const { data: badges } = await supabase
    .from("player_badges")
    .select("earned_at, badges(slug, name, emoji, description)")
    .eq("profile_id", user.id)
    .order("earned_at", { ascending: false });

  const { count: trainingsAttended } = await supabase
    .from("training_attendance")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .eq("status", "present");

  const { count: goals } = await supabase
    .from("match_events")
    .select("id", { count: "exact", head: true })
    .eq("player_id", user.id)
    .eq("type", "goal");

  const { data: ratings } = await supabase
    .from("post_match_ratings")
    .select("stars")
    .eq("target_id", user.id);
  const avgRating =
    ratings && ratings.length > 0
      ? Math.round((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) * 10) / 10
      : null;

  const { current } = levelProgress(profile.xp);
  const kitColor = (profile.avatar_config as { kit_color?: string })?.kit_color ?? "#00D97E";
  const instagram = (profile.socials as { instagram?: string } | null)?.instagram;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Môj profil</h1>
        <form action={logout}>
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-card">
            Odhlásiť sa
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold text-ink"
          style={{ backgroundColor: kitColor }}
        >
          {profile.level}
        </div>
        <div>
          <p className="font-display text-lg font-semibold">{profile.full_name}</p>
          <p className="text-sm text-muted">
            Level {profile.level} · {current.name} · {profile.xp} XP
          </p>
          {instagram && <p className="text-sm text-muted">@{instagram}</p>}
        </div>
      </div>

      {profile.bio && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm text-fg">{profile.bio}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-line bg-surface py-4">
          <p className="font-display text-xl font-bold text-gold">{trainingsAttended ?? 0}</p>
          <p className="text-xs text-muted">tréningov</p>
        </div>
        <div className="rounded-xl border border-line bg-surface py-4">
          <p className="font-display text-xl font-bold text-gold">{goals ?? 0}</p>
          <p className="text-xs text-muted">gólov</p>
        </div>
        <div className="rounded-xl border border-line bg-surface py-4">
          <p className="font-display text-xl font-bold text-gold">{avgRating ?? "—"}</p>
          <p className="text-xs text-muted">★ hodnotenie</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Odznaky ({badges?.length ?? 0})</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {(badges ?? []).map((b) => {
            const badge = (b as unknown as { badges?: { slug: string; name: string; emoji: string; description: string } }).badges;
            return (
              <div key={badge?.slug} title={badge?.description} className="flex flex-col items-center gap-1 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-2xl">
                  {badge?.emoji}
                </span>
                <span className="text-[10px] text-muted">{badge?.name}</span>
              </div>
            );
          })}
          {(!badges || badges.length === 0) && (
            <p className="col-span-full text-sm text-muted">Zatiaľ žiadne odznaky — ukáž sa na tréningu 💪</p>
          )}
        </div>
      </div>

      <ProfileEditForm
        fullName={profile.full_name}
        bio={profile.bio ?? ""}
        kitColor={kitColor}
        instagram={instagram ?? ""}
        visibility={profile.leaderboard_visibility}
      />
    </div>
  );
}
