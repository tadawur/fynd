import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSk } from "@/lib/fynd/date";
import { MessageForm } from "./MessageForm";
import { resolveItem } from "../actions";

export default async function LostFoundItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: item } = await supabase
    .from("lost_found_items")
    .select("*, profiles(full_name)")
    .eq("id", id)
    .maybeSingle();
  if (!item) notFound();

  const { data: messages } = await supabase
    .from("lost_found_messages")
    .select("id, content, created_at, profile_id, profiles(full_name)")
    .eq("item_id", id)
    .order("created_at", { ascending: true });

  const { data: membership } = await supabase
    .from("club_memberships")
    .select("role")
    .eq("profile_id", user.id)
    .eq("club_id", item.club_id)
    .maybeSingle();
  const canResolve =
    item.reported_by === user.id || membership?.role === "coach" || membership?.role === "club_admin";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <Link href="/dashboard/lost-found" className="text-sm text-muted hover:underline">
        ← Straty a nálezy
      </Link>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="font-medium">
          {item.kind === "lost" ? "🔴 Stratené" : "🟢 Nájdené"} · {item.title}
        </p>
        {item.description && <p className="mt-1 text-sm text-muted">{item.description}</p>}
        <p className="mt-2 text-xs text-muted">
          Nahlásil {(item as unknown as { profiles?: { full_name?: string } }).profiles?.full_name} ·{" "}
          {formatDateTimeSk(item.created_at)}
        </p>
        {item.status === "resolved" ? (
          <span className="mt-2 inline-block rounded-full bg-green/15 px-2 py-0.5 text-xs text-green">vyriešené</span>
        ) : (
          canResolve && (
            <form action={resolveItem.bind(null, id)} className="mt-3">
              <button type="submit" className="rounded-full border border-green px-4 py-1.5 text-sm text-green hover:bg-green/10">
                Označiť ako vyriešené
              </button>
            </form>
          )
        )}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Správy</h2>
        <div className="flex flex-col gap-2">
          {(messages ?? []).map((m) => (
            <div key={m.id} className="text-sm">
              <span className="text-muted">
                {(m as unknown as { profiles?: { full_name?: string } }).profiles?.full_name}:{" "}
              </span>
              {m.content}
            </div>
          ))}
          {(!messages || messages.length === 0) && <p className="text-sm text-muted">Zatiaľ žiadne správy.</p>}
        </div>
        <MessageForm itemId={id} />
      </div>
    </div>
  );
}
