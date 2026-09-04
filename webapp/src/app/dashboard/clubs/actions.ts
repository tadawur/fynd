"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_NOTIFY = {
  goals: true,
  yellow_cards: false,
  red_cards: true,
  half_time: false,
  full_time: true,
  match_reminder: true,
  match_day: true,
  announcements: true,
};

export async function toggleFollow(clubId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("club_follows")
    .select("id")
    .eq("profile_id", user.id)
    .eq("club_id", clubId)
    .maybeSingle();

  if (existing) {
    await supabase.from("club_follows").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("club_follows")
      .insert({ profile_id: user.id, club_id: clubId, notify: DEFAULT_NOTIFY });
  }

  revalidatePath("/dashboard/clubs");
  revalidatePath(`/dashboard/clubs/${slug}`);
}

export async function updateNotifySettings(clubId: string, slug: string, formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const notify = {
    goals: formData.get("goals") === "on",
    yellow_cards: formData.get("yellow_cards") === "on",
    red_cards: formData.get("red_cards") === "on",
    half_time: formData.get("half_time") === "on",
    full_time: formData.get("full_time") === "on",
    match_reminder: formData.get("match_reminder") === "on",
    match_day: formData.get("match_day") === "on",
    announcements: formData.get("announcements") === "on",
  };

  await supabase
    .from("club_follows")
    .update({ notify })
    .eq("profile_id", user.id)
    .eq("club_id", clubId);

  revalidatePath(`/dashboard/clubs/${slug}`);
}
