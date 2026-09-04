"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string | null };

export async function createItem(_prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubId = String(formData.get("club_id") ?? "");
  const kind = String(formData.get("kind") ?? "lost");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!clubId || !title) return { error: "Vyplň názov a klub." };

  const { error } = await supabase.from("lost_found_items").insert({
    club_id: clubId,
    reported_by: user.id,
    kind,
    title,
    description,
  });
  if (error) return { error: "Nepodarilo sa uložiť." };

  revalidatePath("/dashboard/lost-found");
  return { error: null };
}

export async function postMessage(itemId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !content.trim()) return;

  await supabase.from("lost_found_messages").insert({
    item_id: itemId,
    profile_id: user.id,
    content: content.trim(),
  });
  revalidatePath(`/dashboard/lost-found/${itemId}`);
}

export async function resolveItem(itemId: string) {
  const supabase = await createClient();
  await supabase.from("lost_found_items").update({ status: "resolved" }).eq("id", itemId);
  revalidatePath(`/dashboard/lost-found/${itemId}`);
  revalidatePath("/dashboard/lost-found");
}
