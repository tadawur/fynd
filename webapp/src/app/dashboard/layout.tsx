import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/nav/Sidebar";
import { BottomNav } from "@/components/nav/BottomNav";
import { FutbotMark } from "@/components/icons/FutbotMark";
import { IconBell } from "@/components/icons/BrandIcons";
import { Avatar } from "@/components/Avatar";
import { PitchBackground } from "@/components/PitchBackground";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp, level, onboarded, avatar_config, photo_url, season_theme, color_mode")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/login");
  if (!profile.onboarded) redirect("/onboarding");

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .eq("read", false);

  const kitColor =
    (profile.avatar_config as { kit_color?: string } | null)?.kit_color ?? "#00D97E";

  const seasonTheme = (profile as { season_theme?: string }).season_theme ?? "default";
  const colorMode = (profile as { color_mode?: string }).color_mode ?? "dark";
  return (
    <div
      className="relative z-0 flex min-h-dvh overflow-hidden bg-ink text-fg"
      data-season={seasonTheme}
      data-mode={colorMode}
      style={{ colorScheme: colorMode }}
    >
      <PitchBackground />
      <Sidebar seasonTheme={seasonTheme} />

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/90 px-4 py-3 backdrop-blur lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <FutbotMark size={24} />
            <span className="font-display font-bold">Fynd.</span>
          </Link>
          <span className="hidden text-sm text-muted lg:inline">
            Vitaj, {profile.full_name}
          </span>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-base"
              aria-label="Notifikácie"
            >
              <IconBell className="h-5 w-5" />
              {!!unreadCount && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-ink">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm"
            >
              <Avatar
                level={profile.level}
                kitColor={kitColor}
                photoUrl={(profile as { photo_url?: string | null }).photo_url}
                name={profile.full_name}
                size={28}
              />
              <span className="hidden font-display font-semibold text-gold sm:inline">
                {profile.xp} XP
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-8">{children}</main>
      </div>

      <BottomNav seasonTheme={seasonTheme} />
    </div>
  );
}
