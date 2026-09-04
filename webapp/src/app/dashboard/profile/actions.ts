"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string | null; success?: boolean };

export async function updateProfile(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const kitColor = String(formData.get("kit_color") ?? "#00D97E");
  const instagram = String(formData.get("instagram") ?? "").trim();
  const visibility = String(formData.get("leaderboard_visibility") ?? "public");

  if (!fullName) return { error: "Meno nemôže byť prázdne." };

  const { data: current } = await supabase
    .from("profiles")
    .select("avatar_config")
    .eq("id", user.id)
    .maybeSingle();
  const config = (current?.avatar_config as Record<string, unknown>) ?? {};

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      bio: bio || null,
      avatar_config: { ...config, kit_color: kitColor },
      socials: instagram ? { instagram } : {},
      leaderboard_visibility: visibility,
    })
    .eq("id", user.id);

  if (error) return { error: "Nepodarilo sa uložiť profil." };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}
