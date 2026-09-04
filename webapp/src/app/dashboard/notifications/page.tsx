import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { markAllRead, markRead } from "./actions";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line react-hooks/purity -- server component: aktuálny čas je zámerný pri fetchi dát
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, body, read, created_at")
    .eq("profile_id", user.id)
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: false });

  const unread = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifikácie</h1>
        {unread > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="text-sm text-green hover:underline">
              Označiť všetko ako prečítané
            </button>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {(notifications ?? []).map((n) => (
          <form key={n.id} action={markRead.bind(null, n.id)}>
            <button
              type="submit"
              className={
                "flex w-full flex-col gap-0.5 rounded-2xl border p-4 text-left " +
                (n.read ? "border-line bg-surface" : "border-green/40 bg-green/5")
              }
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{n.title}</p>
                <span className="text-xs text-muted">{formatDateTimeSk(n.created_at)}</span>
              </div>
              <p className="text-sm text-muted">{n.body}</p>
            </button>
          </form>
        ))}
        {(!notifications || notifications.length === 0) && (
          <p className="text-sm text-muted">Za posledných 30 dní žiadne notifikácie.</p>
        )}
      </div>
    </div>
  );
}
