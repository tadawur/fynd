import { createClient } from "@/lib/supabase/server";
import { levelProgress } from "@/lib/fynd/xp";
import { frameForLevel } from "@/lib/fynd/frame";
import { Avatar } from "@/components/Avatar";
import { ProfileEditForm } from "./ProfileEditForm";
import { AvatarUpload } from "./AvatarUpload";
import { BadgeShowcase } from "./BadgeShowcase";
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

  const { data: badgesRaw } = await supabase
    .from("player_badges")
    .select("earned_at, badges(slug, name, emoji, description)")
    .eq("profile_id", user.id)
    .order("earned_at", { ascending: false });

  const badges = (badgesRaw ?? [])
    .map(
      (b) =>
        (b as unknown as {
          badges?: { slug: string; name: string; emoji: string; description: string };
        }).badges
    )
    .filter((b): b is NonNullable<typeof b> => !!b);

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

  const { current, next, progressPct } = levelProgress(profile.xp);
  const kitColor = (profile.avatar_config as { kit_color?: string })?.kit_color ?? "#00D97E";
  const instagram = (profile.socials as { instagram?: string } | null)?.instagram;
  const tier = frameForLevel(profile.level);
  const photoUrl = (profile as { photo_url?: string | null }).photo_url ?? null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Môj profil</h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-card"
          >
            Odhlásiť sa
          </button>
        </form>
      </div>

      {/* Hero banner — Steam-like hlavička profilu */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div
          className="animate-fynd-banner relative h-28 w-full sm:h-32"
          style={{
            backgroundImage: `linear-gradient(120deg, ${kitColor}55, var(--color-surface) 35%, var(--color-ink) 70%, ${kitColor}33)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 14px)",
            }}
            aria-hidden
          />
        </div>

        <div className="relative px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
            <Avatar
              level={profile.level}
              kitColor={kitColor}
              photoUrl={photoUrl}
              name={profile.full_name}
              size={84}
              showFrame
              className="ring-4 ring-surface rounded-full"
            />
            <div className="pb-1">
              <p className="font-display text-lg font-semibold sm:text-xl">
                {profile.full_name}
              </p>
              <p className="text-sm text-muted">
                Level {profile.level} · {current.name}
                {instagram && <span> · @{instagram}</span>}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-muted">
            <span className="text-gold">{tier.label}</span>
            <span>·</span>
            <span>{profile.xp} XP</span>
          </div>

          <div className="mt-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-card">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-green to-gold"
                style={{ width: `${progressPct}%` }}
              >
                <span className="animate-fynd-sheen absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-sm" />
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              {next
                ? `${progressPct}% do levelu ${next.level} · ${next.name}`
                : "Maximálny level 🏆"}
            </p>
          </div>
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

      <BadgeShowcase badges={badges} />

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Profilová fotka</h2>
        <AvatarUpload
          userId={user.id}
          level={profile.level}
          kitColor={kitColor}
          name={profile.full_name}
          initialPhotoUrl={photoUrl}
        />
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
