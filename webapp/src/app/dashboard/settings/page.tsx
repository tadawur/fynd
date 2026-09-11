import { createClient } from "@/lib/supabase/server";
import type { SeasonKey } from "@/lib/fynd/season";
import { SeasonThemeForm } from "./SeasonThemeForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("season_theme")
    .eq("id", user.id)
    .maybeSingle();

  const currentSeason = ((profile as { season_theme?: string } | null)?.season_theme ??
    "default") as SeasonKey;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Nastavenia</h1>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-1 font-medium">Vzhľad appky podľa sezóny</h2>
        <p className="mb-4 text-sm text-muted">
          Vyber si, ako má appka vyzerať — zmení sa len farebný akcent, tmavé pozadie
          zostáva rovnaké.
        </p>
        <SeasonThemeForm current={currentSeason} />
      </div>
    </div>
  );
}
