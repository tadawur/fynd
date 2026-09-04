import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const KIND_ICON: Record<string, string> = {
  category: "💬",
  coaches: "🧑‍🏫",
  management: "🏛️",
  marketing: "📢",
};

export default async function ChatListPage() {
  const supabase = await createClient();

  // RLS (can_access_chat_channel) automaticky vráti len kanály, ku ktorým má
  // prihlásený používateľ prístup — vrátane U9 pravidla (docs/chat-permissions.md).
  const { data: channels } = await supabase
    .from("chat_channels")
    .select("id, name, kind, clubs(name)")
    .order("name");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold">Chat</h1>

      <div className="flex flex-col gap-2">
        {(channels ?? []).map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/chat/${c.id}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-card"
          >
            <span className="text-xl">{KIND_ICON[c.kind] ?? "💬"}</span>
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">
                {(c as unknown as { clubs?: { name?: string } }).clubs?.name}
              </p>
            </div>
          </Link>
        ))}
        {(!channels || channels.length === 0) && (
          <p className="text-sm text-muted">
            Zatiaľ nemáš prístup do žiadnej chat skupiny — dokonči onboarding a pripoj sa ku
            klubu.
          </p>
        )}
      </div>
    </div>
  );
}
