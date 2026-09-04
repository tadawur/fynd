"use client";

import { useActionState, useState } from "react";
import { createMatch, type FormState } from "./actions";

type Membership = {
  club_id: string;
  category_id: string | null;
  clubs: { name: string } | null;
  categories: { name: string } | null;
};

const initialState: FormState = { error: null };

export function NewMatchForm({ memberships }: { memberships: Membership[] }) {
  const [state, formAction, pending] = useActionState(createMatch, initialState);
  const [open, setOpen] = useState(false);
  const options = memberships.filter((m) => m.category_id);

  if (options.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left font-medium">
        <span>➕ Nový zápas</span>
        <span className="text-muted">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          <select
            name="category_id"
            required
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            onChange={(e) => {
              const opt = e.target.selectedOptions[0];
              const form = e.target.closest("form")!;
              (form.elements.namedItem("club_id") as HTMLInputElement).value = opt.dataset.clubId ?? "";
            }}
          >
            {options.map((m) => (
              <option key={m.category_id} value={m.category_id!} data-club-id={m.club_id}>
                {m.clubs?.name} · {m.categories?.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="club_id" defaultValue={options[0]?.club_id} />

          <input
            type="text"
            name="opponent_name"
            required
            placeholder="Súper"
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_home" defaultChecked className="h-4 w-4 accent-green" />
            Domáci zápas
          </label>
          <input
            type="text"
            name="competition"
            placeholder="Súťaž (voliteľné)"
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
          <div className="flex gap-3">
            <input type="date" name="date" required className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
            <input type="time" name="time" required defaultValue="10:00" className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green" />
          </div>

          {state.error && <p className="text-sm text-coral">{state.error}</p>}

          <button type="submit" disabled={pending} className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60">
            {pending ? "Ukladám..." : "Vytvoriť zápas"}
          </button>
        </form>
      )}
    </div>
  );
}
