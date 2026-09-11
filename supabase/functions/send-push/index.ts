// Fynd — Edge Function "send-push"
// Volaná DB triggerom (schema_v4.sql, notifications_send_push) pri každom novom
// riadku v public.notifications. Pošle Web Push všetkým zariadeniam daného
// používateľa (public.push_subscriptions) cez VAPID. Neplatné/expirované
// subscriptions (404/410) rovno zmaže.
//
// Nasadenie a potrebné secrets: docs/push-notifications.md

import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:info@fynd.app";
const PUSH_TRIGGER_SECRET = Deno.env.get("PUSH_TRIGGER_SECRET");

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Zdieľané tajomstvo medzi DB triggerom a touto funkciou — chráni pred cudzím
  // volaním, keďže funkcia je nasadená s --no-verify-jwt (trigger nemá user JWT).
  if (PUSH_TRIGGER_SECRET && req.headers.get("x-push-secret") !== PUSH_TRIGGER_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  let notificationId: string | undefined;
  try {
    const body = await req.json();
    notificationId = body.notification_id;
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!notificationId) return new Response("Missing notification_id", { status: 400 });

  const { data: notification, error: notifError } = await supabase
    .from("notifications")
    .select("id, profile_id, type, title, body, club_id")
    .eq("id", notificationId)
    .maybeSingle();

  if (notifError || !notification) {
    return new Response(JSON.stringify({ error: "notification not found" }), { status: 404 });
  }

  const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("profile_id", notification.profile_id);

  if (subsError || !subs || subs.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    type: notification.type,
    url: pathForType(notification.type),
  });

  let sent = 0;
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent += 1;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        } else {
          console.error("web-push error", statusCode, err);
        }
      }
    })
  );

  return new Response(JSON.stringify({ sent }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

function pathForType(type: string): string {
  switch (type) {
    case "announcement":
      return "/dashboard/announcements";
    case "training_change":
    case "training_reminder":
      return "/dashboard/calendar";
    case "chat_message":
      return "/dashboard/chat";
    case "goal":
    case "yellow_card":
    case "red_card":
    case "half_time":
    case "full_time":
      return "/dashboard/matches";
    default:
      return "/dashboard/notifications";
  }
}
