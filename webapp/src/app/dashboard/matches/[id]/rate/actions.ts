"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function rate(matchId: string, targetId: string, targetType: string, stars: number) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_rating", {
    p_match_id: matchId,
    p_target_id: targetId,
    p_target_type: targetType,
    p_stars: stars,
  });
  revalidatePath(`/dashboard/matches/${matchId}/rate`);
  return { error: error?.message ?? null };
}
