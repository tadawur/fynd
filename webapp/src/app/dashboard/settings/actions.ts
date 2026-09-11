"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SeasonKey } from "@/lib/fynd/season";

export type SeasonFormState = { error: string | null; season?: SeasonKey };

const VALID: SeasonKey[] = ["default", "jar", "leto", "jesen", "zima"];

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
  if (!VALID.includes(season)) return { error: "Neplatná téma." };

  const { error } = await supabase
    .from("profiles")
    .update({ season_theme: season })
    .eq("id", user.id);

  if (error) return { error: "Nepodarilo sa uložiť tému." };

  revalidatePath("/dashboard", "layout");
  return { error: null, season };
}
