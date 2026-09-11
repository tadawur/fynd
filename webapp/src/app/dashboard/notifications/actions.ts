"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markAllRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notifications").update({ read: true }).eq("profile_id", user.id).eq("read", false);
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard");
}

export async function markRead(id: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ read: true }).eq("id", id);
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard");
}

// Web Push (docs/push-notifications.md) — uloženie/zrušenie subscription pre
// aktuálne zariadenie. RLS (push_subscriptions: insert/delete own) zaručuje,
// že si používateľ vie spravovať len svoje vlastné subscriptions.
export async function savePushSubscription(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Neprihlásený." };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      profile_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  return { error: error?.message ?? null };
}

export async function deletePushSubscription(endpoint: string) {
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  return { error: null };
}
