"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = { error: string | null };

const ROLES = ["player", "coach", "parent", "club_admin", "photographer", "designer"] as const;

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = String(formData.get("role") ?? "player");
  const clubId = String(formData.get("club_id") ?? "");
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const birthDate = String(formData.get("birth_date") ?? "") || null;

  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return { error: "Neplatná rola." };
  }
  if (!clubId) {
    return { error: "Vyber si klub." };
  }
  if (["player", "coach", "parent"].includes(role) && !categoryId) {
    return { error: "Vyber si kategóriu." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      role: role as (typeof ROLES)[number],
      birth_date: birthDate,
      onboarded: true,
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Nepodarilo sa uložiť profil. Skús to znova." };
  }

  const { error: membershipError } = await supabase.from("club_memberships").insert({
    profile_id: user.id,
    club_id: clubId,
    category_id: categoryId,
    role: role as (typeof ROLES)[number],
  });

  if (membershipError) {
    return { error: "Nepodarilo sa pripojiť ku klubu. Skús to znova." };
  }

  // Členstvo v klube = automatické sledovanie vlastného klubu s predvolenými notifikáciami
  // (docs/notifications.md — "MFK Nová Baňa (my club)" je vždy medzi sledovanými klubmi).
  await supabase
    .from("club_follows")
    .upsert(
      {
        profile_id: user.id,
        club_id: clubId,
        notify: {
          goals: true,
          yellow_cards: false,
          red_cards: true,
          half_time: false,
          full_time: true,
          match_reminder: true,
          match_day: true,
          announcements: true,
        },
      },
      { onConflict: "profile_id,club_id", ignoreDuplicates: true }
    );

  redirect("/dashboard");
}
