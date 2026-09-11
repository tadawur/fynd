"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SeasonKey } from "@/lib/fynd/season";
import type { ColorMode } from "@/lib/fynd/mode";

export type SeasonFormState = { error: string | null; season?: SeasonKey };

const VALID_SEASONS: SeasonKey[] = [
  "default",
  "jar",
  "leto",
  "jesen",
  "zima",
  "halloween",
  "vianoce",
  "velkanoc",
];

export async function updateSeasonTheme(
  _prevState: SeasonFormState,
  formData: FormData
): Promise<SeasonFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const season = String(formData.get("season") ?? "default") as SeasonKey;
  if (!VALID_SEASONS.includes(season)) return { error: "Neplatná téma." };

  const { error } = await supabase
    .from("profiles")
    .update({ season_theme: season })
    .eq("id", user.id);

  if (error) return { error: "Nepodarilo sa uložiť tému." };

  revalidatePath("/dashboard", "layout");
  return { error: null, season };
}

export type ModeFormState = { error: string | null; mode?: ColorMode };

const VALID_MODES: ColorMode[] = ["dark", "light"];

export async function updateColorMode(
  _prevState: ModeFormState,
  formData: FormData
): Promise<ModeFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const mode = String(formData.get("mode") ?? "dark") as ColorMode;
  if (!VALID_MODES.includes(mode)) return { error: "Neplatný režim." };

  const { error } = await supabase
    .from("profiles")
    .update({ color_mode: mode })
    .eq("id", user.id);

  if (error) return { error: "Nepodarilo sa uložiť režim." };

  revalidatePath("/dashboard", "layout");
  return { error: null, mode };
}
