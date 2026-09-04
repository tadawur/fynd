"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function redeemReward(itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("redeem_reward", { p_reward_item_id: itemId });
  revalidatePath("/dashboard/rewards");
  return { error: error?.message ?? null };
}

export async function resolveOrder(orderId: string, approve: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("resolve_reward_order", {
    p_order_id: orderId,
    p_approve: approve,
  });
  revalidatePath("/dashboard/rewards");
  return { error: error?.message ?? null };
}

export async function buySkin(skinSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("buy_skin", { p_skin_slug: skinSlug });
  revalidatePath("/dashboard/rewards");
  revalidatePath("/dashboard/profile");
  return { error: error?.message ?? null };
}

export async function activateSkin(skinSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Neprihlásený." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_config")
    .eq("id", user.id)
    .maybeSingle();
  const config = (profile?.avatar_config as Record<string, unknown>) ?? {};

  await supabase
    .from("profiles")
    .update({ avatar_config: { ...config, background: skinSlug } })
    .eq("id", user.id);

  revalidatePath("/dashboard/rewards");
  revalidatePath("/dashboard/profile");
  return { error: null };
}

export type FormState = { error: string | null };

export async function createRewardItem(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubId = String(formData.get("club_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const xpCost = Number(formData.get("xp_cost") ?? 0);
  const minLevel = Number(formData.get("min_level") ?? 1);

  if (!clubId || !name || !xpCost) return { error: "Vyplň názov a cenu v XP." };

  const { error } = await supabase.from("reward_items").insert({
    club_id: clubId,
    name,
    xp_cost: xpCost,
    min_level: minLevel || 1,
  });

  if (error) return { error: "Nepodarilo sa pridať odmenu (si klubový admin?)." };

  revalidatePath("/dashboard/rewards");
  return { error: null };
}
