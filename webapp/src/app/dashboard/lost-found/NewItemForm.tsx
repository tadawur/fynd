"use client";

import { useActionState, useState } from "react";
import { createItem, type FormState } from "./actions";

const initialState: FormState = { error: null };

export function NewItemForm({ clubIds, clubNames }: { clubIds: string[]; clubNames: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(createItem, initialState);
  const [open, setOpen] = useState(false);

  if (clubIds.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left font-medium">
        <span>➕ Nahlásiť stratu / nález</span>
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
          <select name="kind" className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green">
            <option value="lost">Stratil/a som</option>
            <option value="found">Našiel/našla som</option>
          </select>
          <input type="text" name="title" required placeholder="Čo (napr. čierne kopačky)" className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
          <textarea name="description" rows={2} placeholder="Popis (voliteľné)" className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
          {state.error && <p className="text-sm text-coral">{state.error}</p>}
          <button type="submit" disabled={pending} className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60">
            {pending ? "Ukladám..." : "Nahlásiť"}
          </button>
        </form>
      )}
    </div>
  );
}
