"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addMatchEvent } from "../actions";

type Event = {
  id: string;
  minute: number;
  type: string;
  team: string | null;
  note: string | null;
  playerName: string | null;
};

const TYPE_LABEL: Record<string, { emoji: string; label: string }> = {
  kickoff: { emoji: "⚽", label: "Výkop" },
  goal: { emoji: "⚽", label: "Gól!" },
  yellow_card: { emoji: "🟨", label: "Žltá karta" },
  red_card: { emoji: "🟥", label: "Červená karta" },
  half_time: { emoji: "⏱️", label: "Polčas" },
  full_time: { emoji: "🏁", label: "Koniec zápasu" },
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Naplánovaný",
  live: "🔴 Live",
  finished: "Odohraný",
};

export function MatchLive({
  matchId,
  initialStatus,
  initialScoreHome,
  initialScoreAway,
  initialEvents,
  isCoach,
  lineup,
}: {
  matchId: string;
  initialStatus: string;
  initialScoreHome: number;
  initialScoreAway: number;
  initialEvents: Event[];
  isCoach: boolean;
  lineup: { profileId: string; name: string }[];
}) {
  const [status, setStatus] = useState(initialStatus);
  const [scoreHome, setScoreHome] = useState(initialScoreHome);
  const [scoreAway, setScoreAway] = useState(initialScoreAway);
  const [events, setEvents] = useState(initialEvents);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "matches", filter: `id=eq.${matchId}` },
        (payload) => {
          const row = payload.new as { status: string; score_home: number; score_away: number };
          setStatus(row.status);
          setScoreHome(row.score_home);
          setScoreAway(row.score_away);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_events", filter: `match_id=eq.${matchId}` },
        (payload) => {
          const row = payload.new as {
            id: string;
            minute: number;
            type: string;
            team: string | null;
            note: string | null;
            player_id: string | null;
          };
          const playerName = lineup.find((l) => l.profileId === row.player_id)?.name ?? null;
          setEvents((prev) =>
            prev.some((e) => e.id === row.id)
              ? prev
              : [...prev, { id: row.id, minute: row.minute, type: row.type, team: row.team, note: row.note, playerName }].sort(
                  (a, b) => a.minute - b.minute
                )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-5">
        <span className="text-sm text-muted">{STATUS_LABEL[status] ?? status}</span>
        <span className="font-display text-3xl font-bold text-gold">
          {scoreHome}:{scoreAway}
        </span>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 font-medium">Live ticker</h2>
        <ul className="flex flex-col gap-2">
          {events.map((e) => {
            const meta = TYPE_LABEL[e.type] ?? { emoji: "•", label: e.type };
            return (
              <li key={e.id} className="flex items-start gap-2 text-sm">
                <span className="w-8 shrink-0 text-muted">{e.minute}&apos;</span>
                <span>{meta.emoji}</span>
                <span className="flex-1">
                  {meta.label}
                  {e.playerName ? ` — ${e.playerName}` : ""}
                  {e.note ? ` (${e.note})` : ""}
                </span>
                <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[10px] text-muted">
                  Coach input
                </span>
              </li>
            );
          })}
          {events.length === 0 && <p className="text-sm text-muted">Zápas sa ešte nezačal.</p>}
        </ul>
      </div>

      {isCoach && status !== "finished" && (
        <form
          action={async (formData: FormData) => {
            await addMatchEvent(formData);
          }}
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <h2 className="mb-3 font-medium">Zadať udalosť (manuálny vstup trénera)</h2>
          <input type="hidden" name="match_id" value={matchId} />
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                type="number"
                name="minute"
                min={0}
                max={130}
                required
                placeholder="Minúta"
                className="w-24 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
              />
              <select name="type" required className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green">
                <option value="kickoff">Výkop</option>
                <option value="goal">Gól</option>
                <option value="yellow_card">Žltá karta</option>
                <option value="red_card">Červená karta</option>
                <option value="half_time">Polčas</option>
                <option value="full_time">Koniec zápasu</option>
              </select>
            </div>
            <div className="flex gap-3">
              <select name="team" className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green">
                <option value="">Tím —</option>
                <option value="home">Domáci</option>
                <option value="away">Hostia</option>
              </select>
              <select name="player_id" className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green">
                <option value="">Hráč —</option>
                {lineup.map((p) => (
                  <option key={p.profileId} value={p.profileId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="note"
              placeholder="Poznámka (voliteľné)"
              className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            />
            <button type="submit" className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110">
              Pridať udalosť
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
