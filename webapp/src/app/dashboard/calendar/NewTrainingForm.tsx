"use client";

import { useActionState, useState } from "react";
import { createTraining, type FormState } from "./actions";

type CoachMembership = {
  club_id: string;
  category_id: string | null;
  clubs: { name: string } | null;
  categories: { name: string } | null;
};

const initialState: FormState = { error: null };

export function NewTrainingForm({ memberships }: { memberships: CoachMembership[] }) {
  const [state, formAction, pending] = useActionState(createTraining, initialState);
  const [open, setOpen] = useState(false);
  const options = memberships.filter((m) => m.category_id);

  if (options.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left font-medium"
      >
        <span>➕ Nový tréning</span>
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
              (form.elements.namedItem("club_id") as HTMLInputElement).value =
                opt.dataset.clubId ?? "";
            }}
          >
            {options.map((m) => (
              <option key={m.category_id} value={m.category_id!} data-club-id={m.club_id}>
                {m.clubs?.name} · {m.categories?.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="club_id" defaultValue={options[0]?.club_id} />

          <div className="flex gap-3">
            <input
              type="date"
              name="date"
              required
              className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            />
            <input
              type="time"
              name="time"
              required
              defaultValue="17:00"
              className="flex-1 rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            />
          </div>
          <input
            type="text"
            name="location"
            placeholder="Miesto (voliteľné)"
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />

          {state.error && <p className="text-sm text-coral">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Ukladám..." : "Vytvoriť tréning"}
          </button>
        </form>
      )}
    </div>
  );
}
