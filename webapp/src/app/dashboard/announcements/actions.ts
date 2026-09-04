"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string | null };

export async function createAnnouncement(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubId = String(formData.get("club_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const scope = formData.getAll("scope") as string[]; // "" (celý klub) alebo category_id[]

  if (!clubId || !title || !body || scope.length === 0) {
    return { error: "Vyplň nadpis, text a vyber aspoň jednu skupinu." };
  }

  const categoryIds = scope.includes("all") ? [null] : scope;

  for (const categoryId of categoryIds) {
    const { error } = await supabase.from("announcements").insert({
      club_id: clubId,
      category_id: categoryId,
      title,
      body,
      created_by: user.id,
    });
    if (error) return { error: "Nepodarilo sa uložiť oznam." };

    let recipientsQuery = supabase
      .from("club_memberships")
      .select("profile_id")
      .eq("club_id", clubId);
    if (categoryId) recipientsQuery = recipientsQuery.eq("category_id", categoryId);
    const { data: recipients } = await recipientsQuery;

    if (recipients && recipients.length > 0) {
      await supabase.from("notifications").insert(
        recipients.map((r) => ({
          profile_id: r.profile_id,
          club_id: clubId,
          type: "announcement",
          title: `📣 ${title}`,
          body,
        }))
      );
    }
  }

  revalidatePath("/dashboard/announcements");
  return { error: null };
}
