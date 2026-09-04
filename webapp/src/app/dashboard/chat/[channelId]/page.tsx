import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "./ChatRoom";

export default async function ChatChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS zaručuje, že tento select vráti dáta len ak má používateľ prístup (can_access_chat_channel).
  const { data: channel } = await supabase
    .from("chat_channels")
    .select("id, name, kind, club_id, category_id")
    .eq("id", channelId)
    .maybeSingle();

  if (!channel) notFound();

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, content, created_at, profile_id, profiles(full_name)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(100);

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-2xl flex-col px-4 py-4 lg:h-[calc(100dvh-3.5rem)] lg:px-8">
      <h1 className="mb-3 text-lg font-semibold">{channel.name}</h1>
      <ChatRoom
        channelId={channel.id}
        currentUserId={user.id}
        initialMessages={(messages ?? []).map((m) => ({
          id: m.id,
          content: m.content,
          created_at: m.created_at,
          profile_id: m.profile_id,
          author: (m as unknown as { profiles?: { full_name?: string } }).profiles?.full_name ?? "?",
        }))}
      />
    </div>
  );
}
