"use client";

import { useActionState, useState } from "react";
import { createRewardItem, type FormState } from "./actions";

const initialState: FormState = { error: null };

export function NewRewardItemForm({ clubIds, clubNames }: { clubIds: string[]; clubNames: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(createRewardItem, initialState);
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left font-medium">
        <span>➕ Pridať odmenu (admin)</span>
        <span className="text-muted">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          <select name="club_id" className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green">
            {clubIds.map((id) => (
              <option key={id} value={id}>
                {clubNames[id]}
              </option>
            ))}
          </select>
          <input type="text" name="name" required placeholder="Názov odmeny" className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
          <div className="flex gap-3">
            <input type="number" name="xp_cost" required min={1} placeholder="Cena v XP" className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
            <input type="number" name="min_level" min={1} defaultValue={1} placeholder="Min. level" className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
          </div>
          {state.error && <p className="text-sm text-coral">{state.error}</p>}
          <button type="submit" disabled={pending} className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60">
            {pending ? "Ukladám..." : "Pridať"}
          </button>
        </form>
      )}
    </div>
  );
}
