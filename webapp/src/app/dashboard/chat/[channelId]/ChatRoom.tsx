"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  created_at: string;
  profile_id: string;
  author: string;
};

export function ChatRoom({
  channelId,
  currentUserId,
  initialMessages,
}: {
  channelId: string;
  currentUserId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const nameCache = useRef(new Map<string, string>());
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    initialMessages.forEach((m) => nameCache.current.set(m.profile_id, m.author));
  }, [initialMessages]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat_messages:${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `channel_id=eq.${channelId}` },
        async (payload) => {
          const row = payload.new as { id: string; content: string; created_at: string; profile_id: string };

          const cached = nameCache.current.get(row.profile_id);
          let author: string;
          if (cached) {
            author = cached;
          } else {
            const { data } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", row.profile_id)
              .maybeSingle();
            author = data?.full_name ?? "?";
            nameCache.current.set(row.profile_id, author);
          }

          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [...prev, { id: row.id, content: row.content, created_at: row.created_at, profile_id: row.profile_id, author }]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const content = draft.trim();
    if (!content) return;
    setSending(true);
    setDraft("");
    await supabase.from("chat_messages").insert({
      channel_id: channelId,
      profile_id: currentUserId,
      content,
    });
    setSending(false);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const mine = m.profile_id === currentUserId;
            return (
              <div key={m.id} className={"flex flex-col " + (mine ? "items-end" : "items-start")}>
                {!mine && <span className="mb-0.5 text-xs text-muted">{m.author}</span>}
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm " +
                    (mine ? "bg-green text-ink" : "bg-card text-fg")
                  }
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted">Zatiaľ žiadne správy — napíš prvú 👋</p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t border-line p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Napíš správu..."
          className="flex-1 rounded-full border border-line bg-card px-4 py-2 text-sm outline-none focus:border-green"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="rounded-full bg-green px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
        >
          Poslať
        </button>
      </form>
    </div>
  );
}
