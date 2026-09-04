"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error: string | null };

export async function createTraining(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubId = String(formData.get("club_id") ?? "");
  const categoryId = String(formData.get("category_id") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const location = String(formData.get("location") ?? "");

  if (!clubId || !categoryId || !date || !time) {
    return { error: "Vyplň všetky povinné polia." };
  }

  const startsAt = new Date(`${date}T${time}:00`).toISOString();

  const { error } = await supabase.from("trainings").insert({
    club_id: clubId,
    category_id: categoryId,
    starts_at: startsAt,
    location: location || null,
    created_by: user.id,
  });

  if (error) {
    return { error: "Nepodarilo sa vytvoriť tréning." };
  }

  // "Zmena tréningu" notifikácia je vždy zapnutá (docs/notifications.md) — informujeme
  // všetkých členov danej kategórie o novom/zmenenom tréningu.
  const { data: members } = await supabase
    .from("club_memberships")
    .select("profile_id")
    .eq("club_id", clubId)
    .eq("category_id", categoryId);

  if (members && members.length > 0) {
    await supabase.from("notifications").insert(
      members.map((m) => ({
        profile_id: m.profile_id,
        club_id: clubId,
        type: "training_change",
        title: "Nový tréning naplánovaný",
        body: `Tréning ${new Date(startsAt).toLocaleString("sk-SK")}${location ? ` · ${location}` : ""}`,
      }))
    );
  }

  revalidatePath("/dashboard/calendar");
  return { error: null };
}

export async function markAttendance(trainingId: string, profileId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_attendance", {
    p_training_id: trainingId,
    p_profile_id: profileId,
    p_status: status,
  });
  if (!error) {
    revalidatePath(`/dashboard/calendar/${trainingId}`);
  }
  return { error: error?.message ?? null };
}
