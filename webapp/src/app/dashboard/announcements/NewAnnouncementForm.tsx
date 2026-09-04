"use client";

import { useActionState, useState } from "react";
import { createAnnouncement, type FormState } from "./actions";

type Category = { id: string; name: string; club_id: string };

const initialState: FormState = { error: null };

export function NewAnnouncementForm({
  clubIds,
  categories,
  clubNames,
}: {
  clubIds: string[];
  categories: Category[];
  clubNames: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(createAnnouncement, initialState);
  const [open, setOpen] = useState(false);
  const [clubId, setClubId] = useState(clubIds[0] ?? "");
  const clubCategories = categories.filter((c) => c.club_id === clubId);

  if (clubIds.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left font-medium">
        <span>➕ Nový oznam</span>
        <span className="text-muted">{open ? "–" : "+"}</span>
      </button>

      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          {clubIds.length > 1 && (
            <select
              name="club_id"
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            >
              {clubIds.map((id) => (
                <option key={id} value={id}>
                  {clubNames[id]}
                </option>
              ))}
            </select>
          )}
          {clubIds.length === 1 && <input type="hidden" name="club_id" value={clubId} />}

          <input
            type="text"
            name="title"
            required
            placeholder="Nadpis"
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Text oznamu..."
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-muted">Komu (môžeš vybrať viac kategórií naraz — broadcast)</span>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="scope" value="all" className="h-4 w-4 accent-green" />
              Celý klub
            </label>
            {clubCategories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="scope" value={c.id} className="h-4 w-4 accent-green" />
                {c.name}
              </label>
            ))}
          </div>

          {state.error && <p className="text-sm text-coral">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Odosielam..." : "Odoslať oznam"}
          </button>
        </form>
      )}
    </div>
  );
}
